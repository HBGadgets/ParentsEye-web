import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useHistoryData from "./useHistoryData";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker";
import DriftMarker from "react-leaflet-drift-marker";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { FaForward, FaBackward } from "react-icons/fa";
import { CButton } from "@coreui/react";
import useStoppageTimes from "./useStoppageTimes.js";
import useVehicleImage from "./useVehicleImage.js";
import useGetVehicleIcon from "./useGetVehicleIcon.js";
import location from "../../../../assets/location.svg";
import HistoryLoader from "./HistoryLoader.js";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
import ReactDOMServer from "react-dom/server";
import { Line } from "react-chartjs-2";
import redFlag from "../../../../assets/red-flag-svgrepo-com.svg";
import greenFlag from "../../../../assets/green.svg";
import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Scrollbars } from "react-custom-scrollbars-2";
import SlidingSideMenu from "./SlidingSideMenu";
import L from "leaflet";
import axios from "axios";
import { HistoryStopReport } from "./HistoryStopReport.js";
import { ContactlessOutlined } from "@mui/icons-material";
import { set } from "mongoose";
import { HistoryTripReport } from "./HistoryTripReport.js";
import { TotalResponsesContext } from "../../../../TotalResponsesContext.jsx";

// Register Chart.js components
ChartJS.register(
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
);

const createNumberedIcon = (number) => {
  return L.divIcon({
    className: "custom-marker", // Optional custom class for styling
    html: `
      <div style="position: relative; width: 42px; height: 42px;">
        <img src="${location}" alt="location" style="width: 100%; height: 100%;" />
        <div style="
          position: absolute;
          top: 33%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: black;
          text-shadow: 0 0 2px black;
          background-color: white !important;
          border-radius: 50%;
          border: 1px solid black;
          width: 48%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${number}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const redFlagIcon = L.icon({
  iconUrl: redFlag,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const greenFlagIcon = L.icon({
  iconUrl: greenFlag,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const HistoryMap = ({
  fromDateTime,
  toDateTime,
  deviceId,
  fetch,
  setFetch,
  historyOn,
  setHistoryOn,
  category,
  name,
}) => {
  const { data, loading } = useHistoryData(
    "https://rocketsalestracker.com/api/positions",
    { deviceId, from: fromDateTime, to: toDateTime },
    fetch
  );

  const [filteredRows, setFilteredRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const { setTotalResponses } = useContext(TotalResponsesContext);
  const [stopData, setStopData] = useState([]);
  const [appliedTripFilter, setAppliedTripFilter] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  // stop report
  useEffect(() => {
    if (!deviceId || !fromDateTime || !toDateTime) return;

    const controller = new AbortController();
    const fetchHistoryStopReport = async () => {
      await HistoryStopReport(
        deviceId,
        fromDateTime,
        toDateTime,
        setFilteredRows,
        setOriginalRows,
        setTotalResponses
      );
    };

    fetchHistoryStopReport();
    return () => controller.abort(); // Cleanup function to cancel previous request
  }, [deviceId, fromDateTime, toDateTime]);

  useEffect(() => {
    setStopData(filteredRows);
    console.log("stopData:", filteredRows);
  }, [filteredRows]);

  const [filtereRow, setFiltereRow] = useState([]);
  const [originalRow, setOriginalRow] = useState([]);
  const { setTotalResponse } = useContext(TotalResponsesContext);
  const [tripData, setTripData] = useState([]);

  // trip report
  useEffect(() => {
    if (!deviceId || !fromDateTime || !toDateTime) return;

    const controller = new AbortController();
    const fetchHistoryTripReport = async () => {
      await HistoryTripReport(
        deviceId,
        fromDateTime,
        toDateTime,
        setFiltereRow,
        setOriginalRow,
        setTotalResponse
      );
    };

    fetchHistoryTripReport();
    return () => controller.abort(); // Cleanup function to cancel previous request
  }, [deviceId, fromDateTime, toDateTime]);

  useEffect(() => {
    console.log("tripData:", filtereRow);
    setTripData(filtereRow);
  }, [filtereRow]);

  //##################################################################################//
  const [positions, setPositions] = useState([]);
  const [showStopages, setShowStopages] = useState(true);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [zoomLevel, setZoomLevel] = useState(17);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trips, setTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [longestTrip, setLongestTrip] = useState(null);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [prevhoveredIndex, setPrevHoveredIndex] = useState(null);
  const [originalPositions, setOriginalPositions] = useState([]);

  const mapRef = useRef();

  useEffect(() => {
    if (tripData) {
      setTrips(tripData);
      setTotalTrips(tripData.length);
      // findLongestTrip(tripData);
    }
  }, [tripData]);

  const convertDurationToMinutes = (duration) => {
    const [hours, minutes] = duration
      .split(/h|m/)
      .map((item) => parseInt(item.trim()) || 0);
    return hours * 60 + minutes;
  };

  const fetchAddress = async (latitude, longitude, setAddress) => {
    const apiKey = "DG2zGt0KduHmgSi2kifd"; // Replace with your MapTiler API key
    const addressUrl = `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`;

    try {
      const response = await axios.get(addressUrl);
      const results = response.data?.features;

      if (results && results.length > 0) {
        const place = results[0]?.text || "";
        const pincode =
          results[0]?.context?.find((item) => item.id.startsWith("postal_code"))
            ?.text || "Unknown Pincode";

        setAddress(`${place}, ${pincode}`);
      } else {
        setAddress("Address not available");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Unable to fetch address");
    }
  };

  const fetchAddressStop = async (latitude, longitude) => {
    const apiKey = "DG2zGt0KduHmgSi2kifd";
    const addressUrl = `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`;

    try {
      const response = await axios.get(addressUrl);
      const results = response.data?.features;

      if (results && results.length > 0) {
        const place = results[0]?.text || "Unknown Place";
        const pincode =
          results[0]?.context?.find((item) => item.id.startsWith("postal_code"))
            ?.text || "Unknown Pincode";

        return `${place}, ${pincode}`;
      } else {
        return "Address not available";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unable to fetch address";
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // const filteredData = useMemo(() => {
  //   if (!data?.length) return [];
  //   return data.rSSSeduce((acc, current, i) => {
  //     if (
  //       i === 0 ||
  //       haversineDistance(
  //         acc[acc.length - 1].latitude,
  //         acc[acc.length - 1].longitude,
  //         current.latitude,
  //         current.longitude
  //       ) <= 0.5
  //     ) {
  //       acc.push(current);
  //     }
  //     return acc;
  //   }, []);
  // }, [data]);

  // Filter data using useMemo for optimization
  const filteredData = useMemo(() => {
    if (!data?.length) return [];
    return data;
  }, [data]);

  useEffect(() => {
    if (filteredData.length > 0) {
      setPositions(filteredData.filter((item) => item.attributes.ignition));
      setOriginalPositions(filteredData);
      setIsPlaying(true);
    }
  }, [filteredData]);

  const handleTripFilter = (filteredPositions, trip) => {
    setAppliedTripFilter(true);
    setCurrentTrip(trip);
    setPositions(filteredPositions);
    setCurrentPositionIndex(0);

    // Calculate bounds for the filtered positions
    if (filteredPositions.length > 0) {
      const bounds = L.latLngBounds(
        filteredPositions.map((pos) => [pos.latitude, pos.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const resetTripFilter = () => {
    setAppliedTripFilter(false);
    setCurrentTrip(null);
    setPositions(originalPositions);
    setCurrentPositionIndex(0);
    if (originalPositions.length > 0) {
      mapRef.current.fitBounds(
        L.latLngBounds(
          originalPositions.map((pos) => [pos.latitude, pos.longitude])
        ),
        { padding: [50, 50] }
      );
    }
  };

  const poly = useMemo(
    () => positions.map((item) => [item.latitude, item.longitude, item.course]),
    [positions]
  );

  const handleGraphHover = (index) => {
    if (!isPlaying) setIsPlaying(false);
    setHoveredIndex(index);
    setCurrentPositionIndex(index);
    if (isPlaying) setIsPlaying(true);
  };

  const handleGraphLeave = () => {
    setHoveredIndex(null);
    setIsPlaying(true);
  };

  const speedData = positions?.map((pos) => pos.speed) || [];
  const labels = positions?.map((_, index) => index) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Speed",
        data: speedData,
        borderColor: "rgba(31, 116, 38, 0.5)",
        backgroundColor: "rgba(95, 237, 51, 0.5)",
        cubicInterpolationMode: "monotone",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Position Index" },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "Speed (km/h)" },
        grid: { drawBorder: false },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        intersect: false,
        mode: "index",
        callbacks: {
          label: (tooltipItem) => `Speed: ${tooltipItem.raw} km/h`,
        },
      },
      crosshair: {
        line: {
          color: "rgba(0, 0, 0, 0.5)",
          width: 1,
        },
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    onHover: (event, chartElement) => {
      if (chartElement.length) {
        const index = chartElement[0].index;
        setPrevHoveredIndex(currentPositionIndex);
        handleGraphHover(index);
      } else {
        handleGraphLeave();
      }
    },
  };

  useEffect(() => {
    if (positions.length > 0 && isPlaying) {
      const intervalSpeed = Math.max(100, 1000 / speed);
      const interval = setInterval(() => {
        setCurrentPositionIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % positions.length;
          setProgress(((nextIndex + 1) / positions.length) * 100);
          return nextIndex;
        });
      }, intervalSpeed);
      return () => clearInterval(interval);
    }
  }, [positions, isPlaying, speed]);

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleForward = () =>
    setCurrentPositionIndex((prevIndex) =>
      Math.min(prevIndex + 10, positions.length - 1)
    );
  const handleBackward = () =>
    setCurrentPositionIndex((prevIndex) => Math.max(prevIndex - 10, 0));
  const handleZoomChange = (level) => setZoomLevel(level);
  const [segmentProgress, setSegmentProgress] = useState(0);

  const currentMarkerPosition = useMemo(() => {
    if (positions.length === 0) return [0, 0];
    if (positions.length === 1)
      return [positions[0].latitude, positions[0].longitude];

    const validIndex = currentPositionIndex % positions.length;
    const current = positions[validIndex];
    const next = positions[(validIndex + 1) % positions.length];
    const lerp = (start, end, t) => start + (end - start) * t;
    const lat = lerp(current.latitude, next.latitude, segmentProgress);
    const lng = lerp(current.longitude, next.longitude, segmentProgress);
    return [lat, lng];
  }, [currentPositionIndex, segmentProgress, positions]);

  const MapZoomController = () => {
    const map = useMap();
    const [lastPosition, setLastPosition] = useState(null);

    // Update the map view on position changes using the current zoomLevel.
    useEffect(() => {
      if (positions.length > 0) {
        const currentPosition = positions[currentPositionIndex];
        if (
          !lastPosition ||
          Math.abs(currentPosition?.latitude - lastPosition?.latitude) >
            0.001 ||
          Math.abs(currentPosition?.longitude - lastPosition?.longitude) > 0.001
        ) {
          map.setView(
            [currentPosition?.latitude, currentPosition?.longitude],
            zoomLevel
          );
          setLastPosition(currentPosition);
        }
      }
    }, [currentPositionIndex, zoomLevel, map, positions, lastPosition]);

    // Listen for manual zoom events and update the zoomLevel state.
    useEffect(() => {
      const onZoomEnd = () => {
        setZoomLevel(map.getZoom());
      };
      map.on("zoomend", onZoomEnd);
      return () => map.off("zoomend", onZoomEnd);
    }, [map]);

    return null;
  };

  const handleBack = (e) => {
    window.location.reload();
  };

  const arrowPositions = useMemo(() => {
    return poly.map((pos, index) => {
      const [lat1, lon1] = poly[index];
      const [lat2, lon2] = pos;
      // Calculate the angle in degrees from the previous point to the current point
      const angle = pos.course;
      return { lat: lat2, lon: lon2, angle };
    });
  }, [poly]);

  const courseDirection = positions.map((pos) => pos.course);

  const iconImage = useGetVehicleIcon(
    positions[currentPositionIndex],
    category
  );
  const vehicleImage = useVehicleImage(
    category,
    positions[currentPositionIndex]
  );

  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    if (positions.length > 1 && currentPositionIndex > 0) {
      let accumulatedDistance = 0;
      // Ensure we do not exceed the last valid index
      const lastIndex = Math.min(currentPositionIndex, positions.length - 1);
      // Loop from index 1 to lastIndex (inclusive)
      for (let i = 1; i <= lastIndex; i++) {
        const prev = positions[i - 1];
        const current = positions[i];
        // Check if both previous and current positions exist
        if (prev && current) {
          accumulatedDistance += haversineDistance(
            prev.latitude,
            prev.longitude,
            current.latitude,
            current.longitude
          );
        }
      }
      setTotalDistance(accumulatedDistance);
    }
  }, [currentPositionIndex, positions]);

  const renderMarkers = () => {
    return arrowPositions
      .filter((_, index) => index % 4 === 0) // For example, show an arrow every 4 segments
      .map((arrow, index) => {
        // Convert the icon component to a string
        const iconHtml = ReactDOMServer.renderToString(
          <MdOutlineKeyboardDoubleArrowUp />
        );

        // Create the icon HTML without duplicating the rotation
        const arrowIconHtml = `
        <div style="font-size: 18px; font-weight: 900; color:#fff;">${iconHtml}</div>
      `;

        // Create a divIcon and apply the rotation using arrow.angle
        const icon = L.divIcon({
          html: `<div style="transform: rotate(${courseDirection[index]}deg);">${arrowIconHtml}</div>`,
          className: "custom-arrow", // optional CSS class for further styling
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        return (
          <Marker
            key={`arrow-${index}`}
            position={[arrow.lat, arrow.lon]}
            icon={icon}
          />
        );
      });
  };

  const [filteredPositions, setFilteredPositions] = useState([]);
  const [stopages, setStopages] = useState(
    filtereRow?.finalDeviceDataByStopage || []
  );

  const handleFilterData = (positions) => {
    setFilteredPositions(positions);
  };

  const toggleStopages = (e) => {
    e.preventDefault();
    // Check if there's valid stop data to toggle
    if (!stopData || stopData.length === 0) {
      alert("This vehicle has not made any stops in this time period.");
      return;
    }
    setShowStopages((prev) => !prev);
  };

  console.log("Original Positions", originalPositions);
  console.log("Filtered Position", filteredPositions);

  return (
    <div className="individualMap position-relative border border-5">
      <div className="graphAndMap" style={{ width: "100%" }}>
        <MapContainer
          ref={mapRef}
          center={
            filteredData && positions && currentPositionIndex
              ? [
                  positions[currentPositionIndex]?.latitude,
                  positions[currentPositionIndex]?.longitude,
                ]
              : [21.1458, 79.0882]
          }
          zoom={zoomLevel}
          scrollWheelZoom={true}
          dragging={true}
          style={{
            position: "relative",
            height: "400px",
            width: "100%",
            borderRadius: "15px",
            border: "2px solid gray",
          }}
        >
          <MapZoomController />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
          />
          {positions.length > 0 && (
            <>
              <Polyline
                positions={poly}
                pathOptions={{ color: "blue", weight: 1, opacity: 0.6 }}
                arrowheads={{
                  size: "15px",
                  frequency: "endonly",
                  fill: true,
                  color: "white", // Arrow color set to white
                }}
              />
              {renderMarkers()}

              {showStopages &&
                stopData?.map((stop, index) => {
                  const lat = stop.startLatitude;
                  const lng = stop.startLongitude;

                  if (typeof lat !== "number" || typeof lng !== "number") {
                    console.error(
                      `Invalid stop coordinates at index ${index}`,
                      stop
                    );
                    return null;
                  }

                  return (
                    <Marker
                      key={`stop-${index}`}
                      position={[lat, lng]}
                      icon={redFlagIcon}
                    />
                  );
                })}
              <DriftMarker
                position={currentMarkerPosition}
                duration={450}
                keepAtCenter={true}
                icon={iconImage}
              >
                <Popup>
                  {`Vehicle at ${currentMarkerPosition[0]}, ${currentMarkerPosition[1]}`}
                </Popup>
              </DriftMarker>
            </>
          )}
          {positions.length > 0 &&
            positions[0]?.latitude &&
            positions[0].longitude && (
              <>
                <Marker
                  position={[positions[0].latitude, positions[0].longitude]}
                  icon={greenFlagIcon}
                />
                {positions[positions.length - 1]?.latitude &&
                  positions[positions.length - 1]?.longitude && (
                    <Marker
                      position={[
                        positions[positions.length - 1]?.latitude,
                        positions[positions.length - 1]?.longitude,
                      ]}
                      icon={redFlagIcon}
                    />
                  )}
              </>
            )}
        </MapContainer>
        {historyOn && chartData && chartOptions && (
          <>
            <div
              className="infoNav"
              style={{
                display: "flex",
                alignItems: "center",
                height: "60px",
                width: "100%",
                padding: "0 1rem",
                flexWrap: "nowrap",
              }}
            >
              <div
                className="info-img"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3rem",
                  minWidth: "150px",
                }}
              >
                <img src={vehicleImage} alt="Car icon" className="vehicle" />
                <p className="name" style={{ margin: 0 }}>
                  {name}
                </p>
              </div>
              <div
                className="divide"
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  whiteSpace: "nowrap",
                }}
              >
                <div className="bolder">Speed : </div>
                <div className="lighter">
                  {fetch && positions
                    ? Math.round(positions[currentPositionIndex]?.speed * 1.6)
                    : "0"}{" "}
                  km/hr
                </div>
              </div>
              <div
                className="divide"
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  whiteSpace: "nowrap",
                }}
              >
                <div className="bolder">Ignition: </div>
                <div className="lighter">
                  {fetch && positions
                    ? positions[currentPositionIndex]?.attributes?.ignition
                      ? "On"
                      : "Off"
                    : "Off"}
                </div>
              </div>
              <div
                className="divide"
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  whiteSpace: "nowrap",
                }}
              >
                <div className="bolder">Distance: </div>
                <div className="lighter">
                  {fetch && positions
                    ? `${totalDistance.toFixed(2)} Km`
                    : "0 Km"}
                </div>
              </div>
              <div
                className="controls"
                style={{
                  flexGrow: 1,
                  minWidth: "300px",
                  padding: "0 1rem",
                }}
              >
                <div className="center">
                  <div
                    className="pro"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div onClick={handleBackward}>
                      <FaBackward />
                    </div>
                    <div onClick={handlePlayPause}>
                      {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => {
                        const newIndex = Math.floor(
                          (positions.length * e.target.value) / 100
                        );
                        setCurrentPositionIndex(newIndex);
                        setProgress(e.target.value);
                      }}
                    />
                    <div onClick={handleForward}>
                      <FaForward />
                    </div>
                    <div
                      className={`zoom-control ${
                        isExpanded ? "expanded" : ""
                      } d-flex`}
                    >
                      <select
                        value={speed}
                        className="speed-toggle"
                        onChange={(e) => setSpeed(Number(e.target.value))}
                      >
                        <option value={2}>1x</option>
                        <option value={4}>2x</option>
                        <option value={6}>3x</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <CButton
                color={showStopages ? "primary" : "success"}
                style={{
                  height: "2.1rem",
                  width: "10rem",
                  fontSize: "1rem",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={toggleStopages}
              >
                {showStopages ? "Hide Stopages" : "Show Stopages"}
              </CButton>
              <CButton
                color="danger"
                onClick={handleBack}
                style={{
                  height: "2.1rem",
                  width: "4rem",
                  fontSize: "1rem",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Back
              </CButton>
            </div>
            <div style={{ height: "140px", width: "100%" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
      {loading && <HistoryLoader />}
      {historyOn && (
        <div>
          <SlidingSideMenu
            stopData={stopData}
            trips={tripData}
            mapRef={mapRef}
            setIsPlaying={setIsPlaying}
            originalPositions={originalPositions}
            setPositions={setPositions}
            positions={positions}
            setCurrentPositionIndex={setCurrentPositionIndex}
            toggleStopages={toggleStopages}
            showStopages={showStopages}
            handleFilterData={handleFilterData}
            handleTripFilter={handleTripFilter}
            resetTripFilter={resetTripFilter}
            currentTrip={currentTrip}
          />
        </div>
      )}
    </div>
  );
};

export default HistoryMap;
