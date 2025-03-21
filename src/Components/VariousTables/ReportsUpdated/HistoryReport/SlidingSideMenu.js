import { CButton } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FaBars } from "react-icons/fa";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "./SlidingSideMenu.css";
import axios from "axios";
import { MdOutlineRefresh } from "react-icons/md";
import L from "leaflet";
import { BiSolidShow, BiHide } from "react-icons/bi";
import { FaClock, FaCalendarAlt, FaRoad, FaMapMarkerAlt } from "react-icons/fa";

dayjs.extend(duration);

const formatDuration = (milliseconds) => {
  const d = dayjs.duration(milliseconds);
  return `${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`;
};

const toRadians = (degree) => (degree * Math.PI) / 180;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const parseCoordinate = (coord) => {
  if (!coord) return 0; // Handle undefined/null cases safely
  return parseFloat(
    coord
      .toString()
      .replace(/[^\d.-]/g, "")
      .trim()
  );
};

const fetchAddress = async (latitude, longitude) => {
  try {
    const apiKey = "lQr3Sx7viwc3xjVIB3lp";
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`,
      { mode: "no-cors" }
    );
    if (!response.ok)
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.results[0]?.formatted_address || "Address not found";
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Error fetching address";
  }
};

const processStopData = (stopData) => {
  return stopData.map((stop, index, array) => {
    const previousStop = array[index - 1];
    const nextStop = array[index + 1];

    const arrivalTime = dayjs(stop.startTime);
    const departureTime = stop.endTime
      ? dayjs(stop.endTime)
      : nextStop?.startTime
      ? dayjs(nextStop.startTime)
      : null;

    const durationFromPreviousStop = previousStop
      ? arrivalTime.diff(dayjs(previousStop.endTime), "milliseconds")
      : 0;

    const haltTime = departureTime
      ? departureTime.diff(arrivalTime, "milliseconds")
      : null;

    const distanceFromPrevious = previousStop
      ? calculateDistance(
          parseCoordinate(stop.startLatitude),
          parseCoordinate(stop.startLongitude),
          parseCoordinate(previousStop.endLatitude),
          parseCoordinate(previousStop.endLongitude)
        ) / 1000
      : 0;

    return {
      ...stop,
      arrivalTime: stop.startTime,
      departureTime: stop.endTime,
      distanceFromPrevious: distanceFromPrevious.toFixed(2),
      durationFromPreviousStop: formatDuration(durationFromPreviousStop),
      haltTime: haltTime ? formatDuration(haltTime) : "N/A",
    };
  });
};

const SlidingSideMenu = ({
  stopData,
  mapRef,
  setIsPlaying,
  originalPositions,
  setPositions,
  trips,
  setCurrentPositionIndex,
  showStopages,
  toggleStopages,
  handleFilterData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [stopPage, setStopPage] = useState(true);
  const [tripPage, setTripPage] = useState(false);
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Process stop data
  useEffect(() => {
    const processAndSetData = async () => {
      const processed = processStopData(stopData);
      const withAddresses = await Promise.all(
        processed.map(async (stop) => {
          const address = await fetchAddress(
            parseCoordinate(stop.startLatitude),
            parseCoordinate(stop.startLongitude)
          );
          return { ...stop, address };
        })
      );
      setProcessedData(withAddresses);
    };

    if (stopData) processAndSetData();
  }, [stopData]);

  // Toggle menu
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleMenuBack = () => setIsOpen(false);

  // Handle stop click
  const handleStopDiv = (latitude, longitude, index) => {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);
    setIsPlaying(false);
    mapRef.current.setView([lat, lng], 14);

    const popupContent = `
      <div class="custom-popup">
        <h4>Stop ${index + 1}</h4>
      </div>
    `;

    L.popup({ closeButton: true })
      .setLatLng([lat, lng])
      .setContent(popupContent)
      .openOn(mapRef.current);
  };

  // Handle trip filtering
  const filterPositionsByTrip = (trip) => {
    const tripStartTime = dayjs(trip.startTime);
    const tripEndTime = dayjs(trip.endTime);

    const filteredPositions = originalPositions.filter((pos) => {
      const posTime = dayjs(pos.serverTime);
      return posTime.isBetween(tripStartTime, tripEndTime, null, "[]");
    });

    handleFilterData(filteredPositions);
    setPositions(filteredPositions);
    setCurrentPositionIndex(0);
    setIsPlaying(true);

    if (filteredPositions.length > 0) {
      const bounds = L.latLngBounds(
        filteredPositions.map((pos) => [
          parseCoordinate(pos.latitude),
          parseCoordinate(pos.longitude),
        ])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView(
        [
          parseCoordinate(trip.startLatitude),
          parseCoordinate(trip.startLongitude),
        ],
        14
      );
    }
  };

  // Fetch trip data
  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        const enrichedData = await Promise.all(
          trips.map(async (trip) => {
            try {
              const startLat = parseCoordinate(trip.startLatitude);
              const startLng = parseCoordinate(trip.startLongitude);
              const endLat = parseCoordinate(trip.endLatitude);
              const endLng = parseCoordinate(trip.endLongitude);

              const startAddress = await fetchAddress(startLat, startLng);
              const endAddress = await fetchAddress(endLat, endLng);

              return {
                ...trip,
                startAddress,
                endAddress,
                duration: dayjs(trip.endTime).diff(dayjs(trip.startTime)),
              };
            } catch (error) {
              console.error("Error processing trip:", error);
              return {
                ...trip,
                startAddress: "N/A",
                endAddress: "N/A",
                duration: 0,
              };
            }
          })
        );
        setTripData(enrichedData);
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (trips && trips.length > 0) fetchTripData();
  }, [trips]);

  // Handle initial trip reset
  const handleIntialTrip = () => {
    setPositions(originalPositions);
    setCurrentPositionIndex(0);
    setIsPlaying(false);
    if (originalPositions.length > 0) {
      const bounds = L.latLngBounds(
        originalPositions.map((pos) => [
          parseCoordinate(pos.latitude),
          parseCoordinate(pos.longitude),
        ])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <>
      <button onClick={toggleMenu} className="menu-toggle-button">
        <FaBars />
      </button>

      <div className={`sliding-menu ${isOpen ? "open" : ""}`}>
        <Scrollbars>
          <div className="control-trips">
            <CButton
              color="success"
              className="text-white"
              onClick={() => setStopPage(true)}
            >
              Stops
            </CButton>
            <CButton
              color="primary"
              className="text-white"
              onClick={() => setStopPage(false)}
            >
              Trips
            </CButton>
            <CButton
              color="danger"
              className="text-white"
              onClick={handleMenuBack}
            >
              Back
            </CButton>
          </div>

          {stopPage ? (
            <>
              {/* Stops Section */}
              <div className="d-flex p-2 gap-3 justify-content-between align-items-center">
                <div className="d-flex">
                  <div className="label">
                    Total Stops: {processedData?.length ?? 0}
                  </div>
                </div>
                <CButton
                  color={showStopages ? "primary" : "success"}
                  onClick={toggleStopages}
                  className="toggle-button"
                >
                  {showStopages ? <BiSolidShow /> : <BiHide />}
                </CButton>
              </div>

              <hr />

              {processedData.map((stop, index) => (
                <div
                  key={index}
                  className="mb-3 shadow-sm card"
                  onClick={() =>
                    handleStopDiv(
                      stop.startLatitude,
                      stop.startLongitude,
                      index
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h6 className="px-2 card-title">Stop {index + 1}</h6>
                    <hr />
                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-start gap-2 px-2">
                        <FaClock className="icon" />
                        <div>
                          <span>
                            {" "}
                            Arrival:{" "}
                            {stop.startTime
                              ? new Date(stop.startTime)
                                  .toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                  .replace(",", "") // Remove extra comma
                                  .replace(" ", ", ") // Add comma after day
                                  .replace(" at", " •") // Replace 'at' with '•'
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-start gap-2 px-2">
                        <FaCalendarAlt className="icon" />
                        <div>
                          <span>
                            Departure:{" "}
                            {stop.endTime
                              ? new Date(stop.endTime)
                                  .toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                  .replace(",", "") // Remove extra comma
                                  .replace(" ", ", ") // Add comma after day
                                  .replace(" at", " •") // Replace 'at' with '•'
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex align-items-start gap-2 px-2">
                        <FaRoad className="icon" />
                        <div>
                          <span>Distance: {stop.distanceFromPrevious} km</span>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex align-items-start gap-2 px-2">
                        <FaMapMarkerAlt className="icon" />
                        <div>
                          <span>Location: {stop.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Trips Section */}
              <div className="summary-header table-responsive">
                <div className="summary-box">
                  <div className="label">Total Trips</div>
                  <div className="value">
                    {tripData?.filter(
                      (trip) => parseFloat(trip?.distance1 || 0) > 1
                    ).length || 0}
                  </div>
                </div>
                <div className="summary-box">
                  <div className="label">Total Distance</div>
                  <div className="value">
                    {(
                      (tripData?.reduce(
                        (total, trip) =>
                          total + parseFloat(trip?.distance1 || 0),
                        0
                      ) || 0) / 1000
                    ).toFixed(2)}{" "}
                    km
                  </div>
                </div>
                <CButton
                  color="primary"
                  onClick={handleIntialTrip}
                  className="toggle-button"
                  title="Refresh"
                >
                  <MdOutlineRefresh />
                </CButton>
              </div>

              <hr className="divider" />

              {tripData
                .filter((trip) => parseFloat(trip?.distance1 || 0) > 1)
                .map((trip, index) => (
                  <div
                    key={index}
                    className="trip-card"
                    onClick={() => filterPositionsByTrip(trip)}
                  >
                    <div className="trip-header">
                      <div className="indicator-container">
                        <div className="dot green"></div>
                        <div className="dashed-line"></div>
                        <div className="dot red"></div>
                      </div>

                      <div className="trip-details">
                        <div className="time-address">
                          <div className="time">
                            {trip?.startTime
                              ? dayjs(trip.startTime).format(
                                  "MMM D, YYYY • h:mm A"
                                )
                              : "N/A"}
                          </div>
                          <div className="address">
                            {trip?.startAddress || "Loading address..."}
                          </div>
                        </div>

                        <div className="time-address">
                          <div className="time">
                            {trip?.endTime
                              ? dayjs(trip.endTime).format(
                                  "MMM D, YYYY • h:mm A"
                                )
                              : "N/A"}
                          </div>
                          <div className="address">
                            {trip?.endAddress || "Loading address..."}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="metrics">
                      <div className="metric-box">
                        <div className="label">Running</div>
                        <div className="value">
                          {formatDuration(trip?.duration)}
                        </div>
                      </div>
                      <div className="metric-box">
                        <div className="label">Distance</div>
                        <div className="value">
                          {(trip?.distance1 / 1000).toFixed(2)} km
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </Scrollbars>
      </div>
    </>
  );
};

export default SlidingSideMenu;
