import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Circle, // Import Circle
} from "react-leaflet";
import { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FcAlarmClock } from "react-icons/fc";
import { FaTruck } from "react-icons/fa6";
import { FaRegSnowflake } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import "../googlemap/googlemap.css";
import { PiPlugsFill } from "react-icons/pi";
// import Tablee from "./Table"; // Assuming table.jsx is TableComponent

// import carIcon from "./SVG/car-s.png";
import carIcon from "./SVG/bus-s.png";
import motorcycleIcon from "./SVG/bike-s.png";
import truckIcon from "./SVG/truck-s.png";
// import busIcon from "./SVG/bus-s.png";
import axios from "axios";

import {
  MdLocationPin,
  MdAccessTime,
  MdOutlineSatelliteAlt,
  MdSatelliteAlt,
} from "react-icons/md";
import GeoFencing from "../GeoFencing/GeoFencing";
import { TotalResponsesContext } from "../../TotalResponsesContext";
import locationimg from "../../../src/Components/googlemap/SVG/locationfinal.png";
import MarkerClusterGroup from "react-leaflet-cluster";
const car = new L.Icon({
  iconUrl: carIcon,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -30],
});
const truck = new L.Icon({
  iconUrl: truckIcon,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -30],
});
const motorcycle = new L.Icon({
  iconUrl: motorcycleIcon,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -30],
});
const osmProvider = {
  url: "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=jXbNOuobzSRdq08XiuKY",
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
};

const initialCenter = {
  lat: 19.9606,
  lng: 79.2961,
};

function GoogleMapComponent({ latitude, longitude, data }) {
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  const [geofence, setgeofence] = useState("");
  const [vehicleData, setVehicleData] = useState([]);
  const [center, setCenter] = useState(initialCenter);
  const ZOOM_LEVEL = 13; // Maximum zoom level
  const mapRef = useRef();

  const showMyLocation = useCallback((lati, longi) => {
    mapRef.current.flyTo([lati, longi], ZOOM_LEVEL, {
      animate: true,
      duration: 2, // Duration in seconds
    });
  }, []);

  const { coordinates } = useContext(TotalResponsesContext);
  const { selectedVehicle } = useContext(TotalResponsesContext);
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          { timeout: 5000 } // 5 seconds timeout
        );

        const data = response.data;
        console.log(data);

        setAddress(
          `${data.address.neighbourhood || ""}, ${data.address.city || ""}, ${
            data.address.state || ""
          }, ${data.address.postcode || ""}`
        );
      } catch (error) {
        console.error("Error fetching address:", error.message || error);
        setError(`Error fetching address: ${error.message || error}`);
      }
    };

    if (latitude && longitude) {
      fetchAddress();
    }
  }, [latitude, longitude]);

  // Function to get the appropriate icon based on the category
  const getIconByCategory = (category) => {
    console.log(`Category: ${category}`);
    switch (category) {
      case "car":
        return car;
      case "truck":
        return truck;
      case "motorcycle":
        return motorcycle;
      default:
        return car; // Default to car icon if category is unknown
    }
  };

  const [geofences, setGeofence] = useState([]);

  const fetchData = async (startDate = "", endDate = "") => {
    try {
      const token = localStorage.getItem("token");
      let response;

      // Fetch data based on role
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/geofences`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/geofences`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 4) {
        response = await axios.get(
          `${process.env.REACT_APP_USERBRANCH}/getgeofence`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data);
      if (response?.data) {
        let allData;

        if (role == 1) {
          allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
            stops.map((stop) => ({
              ...stop,
              deviceId,
            }))
          );
        } else if (role == 2) {
          allData = Object.entries(response.data.branches || {}).flatMap(
            ([branchIndex, branch]) =>
              branch.geofences?.map((geofence) => ({
                ...geofence,
                branchId: branch.branchId,
                branchName: branch.branchName,
                deviceId: `deviceId: ${geofence.deviceId}`,
              })) || []
          );
        } else if (role == 3) {
          allData = Object.entries(response.data.geofences || {}).flatMap(
            ([index, geofence]) => [
              {
                ...geofence,
                branchId: response.data.branchId,
                branchName: response.data.branchName,
                schoolName: response.data.schoolName,
                deviceId: `deviceId: ${geofence.deviceId}`,
              },
            ]
          );
        } else if (role == 4) {
          allData = Object.entries(response.data.branches || {}).flatMap(
            ([branchIndex, branch]) =>
              branch.geofences?.map((geofence) => ({
                ...geofence,
                branchId: branch.branchId,
                branchName: branch.branchName,
              })) || []
          );
        }

        console.log("my geeofencesss", allData);

        setGeofence(allData);
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]); // Refetch data when the role changes
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  // const scaleFactor = 2;
  // Render the geofences using the Circle component
  const renderGeofences = () => {
    return geofences.map((geofence, index) => {
      // Extract latitude, longitude, and radius from geofence area
      const areaData = geofence.area.match(
        /Circle\(([^ ]+) ([^,]+), ([^,]+)\)/
      );
      // const areaData = geofence.area.match(/Circle\(([^ ]+) ([^,]+), ([0-9]+(?:\.[0-9]+)?)\)/);
      // console.log("areaData",areaData);
      if (areaData) {
        let lng = parseFloat(areaData[1]);
        let lat = parseFloat(areaData[2]);
        if (isNaN(lng) || isNaN(lat)) {
          // If either longitude or latitude is invalid, set default values or handle the case
          lng = 0; // Default longitude
          lat = 0; // Default latitude
          console.warn("Invalid coordinates, using default values: [0, 0]");
        }
        const radius = parseFloat(areaData[3]);

        return (
          <Circle
            key={index}
            center={[lng, lat]}
            radius={radius}
            color="red"
            fillOpacity={0.2}
            eventHandlers={{
              click: () => {
                setSelectedGeofence(geofence); // Set the selected geofence on click
                //  alert(`Geofence Name: ${geofence.name}\nDevice Name: ${geofence.deviceName}`);

                // mapRef.current.setView([lat,lng], 18); // Adjust zoom level as needed
                mapRef.current.setView([lng, lat], 18); // Adjust zoom level as needed
              },
              dblclick: () => {
                // Reset the map zoom on double-clicking the selected geofence
                const currentZoom = mapRef.current.getZoom();
                mapRef.current.setZoom(currentZoom - 7); // Decrease zoom level by 1
                console.log("Coordinates in GoogleMap areee:", coordinates);
              },
              mouseover: () => {
                setSelectedGeofence(geofence); // Show popup on hover
              },
              mouseout: () => {
                setSelectedGeofence(null); // Hide popup when not hovering
              },
            }}
          />
        );
      }
      return null; // Return null if area data is not valid
    });
  };

  const [showGeofences, setShowGeofences] = useState(false); // State to track geofence visibility
  const [streetView, setStreetView] = useState(false); // State to track geofence visibility

  // const [selectedGeofence, setSelectedGeofence] = useState(null); // State for selected geofence

  // const toggleGeofences = () => {
  //   setShowGeofences((prev) => !prev); // Toggle the state
  // };
  const toggleGeofences = () => {
    setShowGeofences((prev) => {
      if (prev) {
        // If geofences are being hidden, reset selectedGeofence
        setSelectedGeofence(null);
      }
      return !prev; // Toggle the state
    });
  };
  const togglestreetview = () => {
    setStreetView((prev) => {
      if (prev) {
        setStreetView(null);
      }
      return !prev;
    });
  };
  const [hoveredVehicle, setHoveredVehicle] = useState(null);
  useEffect(() => {
    if (
      coordinates &&
      coordinates.latitude &&
      coordinates.longitude &&
      mapRef.current
    ) {
      const map = mapRef.current;
      map.setView(
        [coordinates.latitude, coordinates.longitude, coordinates.name],
        16
      ); // Zoom level 13 can be adjusted as needed
    }
  }, [coordinates]);
  const customIcon = new DivIcon({
    html: `<img src="${locationimg}" style="width: 25px; height: 25px;" alt="Location Icon"/>`,
    className: "custom-icon", // Optional: Add a custom class if you want to style it further
  });
  const currentZoom = mapRef.current ? mapRef.current.getZoom() : 13; // Default zoom level

  useEffect(() => {
    if (
      selectedVehicle &&
      selectedVehicle.latitude &&
      selectedVehicle.longitude &&
      mapRef.current
    ) {
      // Smoothly animate the map to the selected vehicle's location with flyTo
      mapRef.current.flyTo(
        [selectedVehicle.latitude, selectedVehicle.longitude],
        13,
        {
          animate: true,
          duration: 1.5, // duration in seconds
        }
      );
    } else if (mapRef.current) {
      // Zoom out by 7 levels if no vehicle is selected
      mapRef.current.setZoom(currentZoom - 7);
    }
  }, [selectedVehicle]);

  const [clickedVehicle, setClickedVehicle] = useState(null); // State for clicked vehicle

  const handleMouseOver = (vehicle) => {
    setHoveredVehicle(vehicle.deviceId);
  };

  const handleMouseOut = () => {
    setHoveredVehicle(null);
  };

  const handleMarkerClick = (vehicle) => {
    setClickedVehicle(vehicle); // Set clicked vehicle
  };
  return (
    <div style={{ position: "relative", height: "500px", width: "99vw" }}>
      <button
        onClick={toggleGeofences}
        style={{
          position: "absolute",
          top: "10px", // Adjust the top position as needed
          right: "10px", // Adjust the right position as needed
          padding: "5px 10px", // Smaller padding for a smaller button
          fontSize: "0.8rem", // Smaller font size
          backgroundColor: "#fff", // Button background color
          border: "1px solid #ccc", // Border style
          borderRadius: "5px", // Rounded corners
          cursor: "pointer",
          zIndex: 1000, // Ensure the button is above the map
        }}
      >
        {showGeofences ? "Hide Geofences" : "Show Geofences"}
      </button>
      <button
        onClick={togglestreetview}
        style={{
          position: "absolute",
          top: "50px", // Adjust the top position as needed
          right: "10px", // Adjust the right position as needed
          padding: "10px 10px", // Smaller padding for a smaller button
          fontSize: "0.8rem", // Smaller font size
          backgroundColor: "#fff", // Button background color
          border: "1px solid #ccc", // Border style
          borderRadius: "5px", // Rounded corners
          cursor: "pointer",
          zIndex: 1000, // Ensure the button is above the map
        }}
      >
        {streetView ? <MdOutlineSatelliteAlt /> : <MdSatelliteAlt />}
      </button>
      <MapContainer
        center={center}
        zoom={7} // Initial zoom level
        ref={mapRef}
        style={{
          height: "500px",
          width: "99vw",
          border: "2px solid rgb(140 133 118)",
          // borderRadius: "6px",
          marginBottom: "0px",
          marginLeft: "0.75px",
        }}
      >
        {" "}
        {streetView ? (
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" // Satellite View
            attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
          />
        ) : (
          <TileLayer
            url={osmProvider.url}
            attribution={osmProvider.attribution}
          />
        )}
        <MarkerClusterGroup chunkedLoading>
          {data
            .filter(
              (vehicle) =>
                !selectedVehicle.deviceId ||
                vehicle.deviceId === selectedVehicle.deviceId
            )
            .map((vehicle, index) =>
              vehicle.latitude && vehicle.longitude ? (
                <Marker
                  key={index}
                  position={[vehicle.latitude, vehicle.longitude]}
                  icon={getIconByCategory(vehicle.category)}
                  eventHandlers={{
                    click: () => {
                      showMyLocation(vehicle.latitude, vehicle.longitude);
                    },
                    mouseover: () => {
                      // Set the hovered vehicle to show popup on hover
                      setHoveredVehicle(vehicle.deviceId);
                    },
                    mouseout: () => {
                      // Clear the hovered vehicle on mouse out
                      setHoveredVehicle(null);
                    },
                  }}
                >
                  <Popup
                    offset={[0, 0]}
                    style={{ zIndex: 300, fontSize: "1.1rem", color: "black" }}
                  >
                    <div className="popup" style={{ height: "275px" }}>
                      <div
                        className="tooltipHead"
                        style={{ marginBottom: "8px" }}
                      >
                        <div className="tooltipNamePlate">
                          <div className="ind">
                            <p>IND</p>
                          </div>
                          <div className="name">
                            <p>{vehicle.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="popupInfo">
                        <PopupElement
                          icon={<MdLocationPin style={{ color: "#d53131" }} />}
                          // text={vehicle.address}
                          text={address}
                        />
                        <PopupElement
                          icon={<FcAlarmClock style={{ color: "#f8a34c" }} />}
                          text={new Date().toLocaleString()}
                        />
                        <PopupElement
                          icon={<PiPlugsFill style={{ color: "#ff7979" }} />}
                          text={
                            vehicle.ignition ? "Ignition On" : "Ignition Off"
                          }
                        />
                        <PopupElement
                          icon={<FaTruck style={{ color: "#ecc023" }} />}
                          text={`${vehicle.distance} kmph`}
                        />
                        <PopupElement
                          icon={<MdAccessTime style={{ color: "#74f27e" }} />}
                          text="12D 01H 04M"
                        />
                        <PopupElement
                          icon={<FaRegSnowflake style={{ color: "#aa9d6f" }} />}
                          text="Ac off"
                        />
                        <PopupElement
                          icon={
                            <BsFillFuelPumpFill style={{ color: "#5fb1fe" }} />
                          }
                          text="0.00 L"
                        />
                        <GeoFencing
                          className="geoFence"
                          lat={vehicle.latitude}
                          long={vehicle.longitude}
                          deviceId={vehicle.deviceId}
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
        </MarkerClusterGroup>
        {/* Add custom marker for current coordinates with the location icon */}
        {coordinates && coordinates.latitude && coordinates.longitude && (
          <Marker
            // position={[coordinates.latitude, coordinates.longitude]}
            position={[coordinates.latitude, coordinates.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h4>Device And Location</h4>
                <p>Bus Name:{coordinates.name}</p>
                <p>Latitude: {coordinates.latitude}</p>
                <p>Longitude: {coordinates.longitude}</p>
              </div>
            </Popup>
          </Marker>
        )}
        {/* Render geofences */}
        {showGeofences && renderGeofences()}
        {/* Render popup for selected geofence */}
        {selectedGeofence && (
          <Popup
            // position={[parseFloat(selectedGeofence.area.split(' ')[1]), parseFloat(selectedGeofence.area.split(' ')[0].split('(')[1])]}
            position={[
              parseFloat(selectedGeofence.area.split(" ")[0].split("(")[1]),
              parseFloat(selectedGeofence.area.split(" ")[1]),
            ]}
            onClose={() => setSelectedGeofence(null)} // Close popup on close event
          >
            <div>
              <h6>{selectedGeofence.name}</h6>
              <p>Device: {selectedGeofence.deviceName}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}

const PopupElement = ({ icon, text }) => (
  <div className="popupElement">
    <div>{icon}</div>
    <span style={{ fontSize: "0.9rem", color: "black" }}>{text}</span>
  </div>
);

export default GoogleMapComponent;

//sample
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   MapContainer,
//   Marker,
//   Polyline,
//   Popup,
//   TileLayer,
//   Circle, // Import Circle
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { FcAlarmClock } from "react-icons/fc";
// import { FaTruck } from "react-icons/fa6";
// import { FaRegSnowflake } from "react-icons/fa";
// import { BsFillFuelPumpFill } from "react-icons/bs";
// import "../googlemap/googlemap.css";
// import { PiPlugsFill } from "react-icons/pi";

// import carIcon from "./SVG/bus-s.png";
// import motorcycleIcon from "./SVG/bike-s.png";
// import truckIcon from "./SVG/truck-s.png";
// import axios from "axios";

// import { MdLocationPin, MdAccessTime } from "react-icons/md";
// import GeoFencing from "../GeoFencing/GeoFencing";

// const car = new L.Icon({
//   iconUrl: carIcon,
//   iconSize: [35, 45],
//   iconAnchor: [17, 45],
//   popupAnchor: [0, -30],
// });
// const truck = new L.Icon({
//   iconUrl: truckIcon,
//   iconSize: [35, 45],
//   iconAnchor: [17, 45],
//   popupAnchor: [0, -30],
// });
// const motorcycle = new L.Icon({
//   iconUrl: motorcycleIcon,
//   iconSize: [35, 45],
//   iconAnchor: [17, 45],
//   popupAnchor: [0, -30],
// });
// const osmProvider = {
//   url: "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=jXbNOuobzSRdq08XiuKY",
//   attribution:
//     '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
// };

// const initialCenter = {
//   lat: 19.9606,
//   lng: 79.2961,
// };

// function GoogleMapComponent({ latitude, longitude, data }) {
//   const [error, setError] = useState("");
//   const [address, setAddress] = useState("");
//   const [vehicleData, setVehicleData] = useState([]);
//   const [center, setCenter] = useState(initialCenter);
//   const [geofences, setGeofences] = useState([]); // State to hold geofence circles

//   const ZOOM_LEVEL = 13; // Maximum zoom level
//   const mapRef = useRef();

//   const showMyLocation = useCallback((lati, longi) => {
//     mapRef.current.flyTo([lati, longi], ZOOM_LEVEL, {
//       animate: true,
//       duration: 2, // Duration in seconds
//     });
//   }, []);

//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const response = await axios.get(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
//           { timeout: 5000 } // 5 seconds timeout
//         );

//         const data = response.data;
//         console.log(data);

//         setAddress(
//           `${data.address.neighbourhood || ''}, ${data.address.city || ''}, ${data.address.state || ''}, ${data.address.postcode || ''}`
//         );
//       } catch (error) {
//         console.error('Error fetching address:', error.message || error);
//         setError(`Error fetching address: ${error.message || error}`);
//       }
//     };

//     if (latitude && longitude) {
//       fetchAddress();
//     }
//   }, [latitude, longitude]);

//   const getIconByCategory = (category) => {
//     switch (category) {
//       case "car":
//         return car;
//       case "truck":
//         return truck;
//       case "motorcycle":
//         return motorcycle;
//       default:
//         return car; // Default to car icon if category is unknown
//     }
//   };

//   // Example geofences, replace with actual geofence data from your logic
//   const exampleGeofences = [
//     { lat: 19.9606, lng: 79.2961, radius: 300 },
//     { lat: 19.9616, lng: 79.2971, radius: 500 },
//   ];

//   return (
//     <>
//       <MapContainer
//         center={center}
//         zoom={7} // Initial zoom level
//         ref={mapRef}
//         style={{
//           height: "500px",
//           width: "99vw",
//           border: "2px solid rgb(140 133 118)",
//           marginBottom: "0px",
//           marginLeft: "0.75px",
//         }}
//       >
//         <TileLayer
//           url={osmProvider.url}
//           attribution={osmProvider.attribution}
//         />

//         {data.map((vehicle, index) =>
//           vehicle.latitude && vehicle.longitude ? (
//             <Marker
//               key={index}
//               position={[vehicle.latitude, vehicle.longitude]}
//               icon={getIconByCategory(vehicle.category)}
//               eventHandlers={{
//                 click: () => {
//                   showMyLocation(vehicle.latitude, vehicle.longitude);
//                 },
//               }}
//             >
//               <Popup
//                 offset={[0, 0]}
//                 style={{ zIndex: 300, fontSize: "1.1rem", color: "black" }}
//               >
//                 <div className="popup" style={{ height: "275px" }}>
//                   <div className="tooltipHead" style={{ marginBottom: "8px" }}>
//                     <div className="tooltipNamePlate">
//                       <div className="ind">
//                         <p>IND</p>
//                       </div>
//                       <div className="name">
//                         <p>{vehicle.name}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="popupInfo">
//                     <PopupElement
//                       icon={<MdLocationPin style={{ color: "#d53131" }} />}
//                       text={address}
//                     />
//                     <PopupElement
//                       icon={<FcAlarmClock style={{ color: "#f8a34c" }} />}
//                       text={new Date().toLocaleString()}
//                     />
//                     <PopupElement
//                       icon={<PiPlugsFill style={{ color: "#ff7979" }} />}
//                       text={vehicle.ignition ? "Ignition On" : "Ignition Off"}
//                     />
//                     <PopupElement
//                       icon={<FaTruck style={{ color: "#ecc023" }} />}
//                       text={`${vehicle.distance} kmph`}
//                     />
//                     <PopupElement
//                       icon={<MdAccessTime style={{ color: "#74f27e" }} />}
//                       text="12D 01H 04M"
//                     />
//                     <PopupElement
//                       icon={<FaRegSnowflake style={{ color: "#aa9d6f" }} />}
//                       text="Ac off"
//                     />
//                     <PopupElement
//                       icon={<BsFillFuelPumpFill style={{ color: "#5fb1fe" }} />}
//                       text="0.00 L"
//                     />
//                     <GeoFencing
//                       lat={vehicle.latitude}
//                       long={vehicle.longitude}
//                       deviceId={vehicle.deviceId}
//                       setGeofences={setGeofences} // Pass the state setter to GeoFencing
//                     />
//                   </div>
//                 </div>
//               </Popup>
//             </Marker>
//           ) : null
//         )}

//         {/* Render geofences */}
//         {exampleGeofences.map((geofence, index) => (
//           <Circle
//             key={index}
//             center={[geofence.lat, geofence.lng]}
//             radius={geofence.radius}
//             color="blue"
//             fillOpacity={0.2}
//           />
//         ))}
//       </MapContainer>
//     </>
//   );
// }

// const PopupElement = ({ icon, text }) => (
//   <div className="popupElement">
//     <div>{icon}</div>
//     <span style={{ fontSize: "0.9rem", color: "black" }}>{text}</span>
//   </div>
// );

// export default GoogleMapComponent;
