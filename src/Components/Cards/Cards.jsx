import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { green, red, yellow, blue, grey, orange } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StopIcon from "@mui/icons-material/Stop";
import SpeedIcon from "@mui/icons-material/Speed";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { useContext } from "react";
import { TotalResponsesContext } from "../../TotalResponsesContext";
import animetedcarimg from "../googlemap/SVG/animetedcarimg.png";
import cartoonimgbus from "../googlemap/SVG/cartoonimgbus.png";
import schoolbus from "../images/schoolbus-png.png";
//import {StudentDetail} from "./Components/VariousTables/School/StudentDetail/StudentDetail.jsx"
//import {StudentDetail} from ".VariousTables/StudentDetail"
// import Leave from './Components/School/Leave/Leave.jsx';
export const Cards = ({
  vehicleRunningCount,
  vehicleStoppedCount,
  vehicleOverspeedCount,
  vehicleIdleCount,
  vehicleUnreachableCount,
  onCardClick,
  setAssetStatusValue,
}) => {
  const handleClick = (component) => {
    onCardClick(component);
  };
  const {
    TotalResponsesStudent,
    totalResponses,
    allDevices,
    totalLeaveRequest,
    TotalResponsesPresent,
    TotalResponsesAbsent,
    TotalResponsesDrivers,
    TotalResponsesSupervisor,
    loading,
  } = useContext(TotalResponsesContext); // Consume the context
  // const { totalLeaveRequest } = useContext(TotalResponsesContext);
  useEffect(() => {
    console.log(
      "card Data",
      TotalResponsesStudent,
      totalResponses,
      allDevices,
      totalLeaveRequest,
      TotalResponsesPresent,
      TotalResponsesAbsent,
      TotalResponsesDrivers,
      TotalResponsesSupervisor,
      loading
    );
  }, [
    TotalResponsesStudent,
    totalResponses,
    allDevices,
    totalLeaveRequest,
    TotalResponsesPresent,
    TotalResponsesAbsent,
    TotalResponsesDrivers,
    TotalResponsesSupervisor,
    loading,
  ]);
  const [elementcard, setelementcard] = useState("");
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1px 100px",
      }}
      key={TotalResponsesStudent}
    >
      {/* <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "200px",
      height: "110px",
      marginTop: "20px",
      padding: "12px",
      borderRadius: 2,
      borderLeft: "4px solid",
      borderColor: "success.main",
      backgroundColor: "background.paper",
      boxShadow: 2,
      position: "relative",
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: "6px",
        }}
      >
        Total students
      </Typography>

      <Typography
        sx={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "success.main",
        }}
      >
        {TotalResponsesStudent}
      </Typography>
    </Box>

    <Box
      sx={{
        position: "absolute",
        bottom: "8px",
        right: "10px",
        cursor: "pointer",
      }}
    >
      <img
        style={{
          width: "3.5rem",
        }}
        src={schoolbus}
        alt="School Bus"
      />
    </Box>
  </Box> */}
      <Box
        onClick={() => handleClick("Student Detail")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main",
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slightly enlarges the card
            boxShadow: 4, // Adds a stronger shadow
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Total Students
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main",
            }}
          >
            {TotalResponsesStudent}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => handleClick("Present")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main",
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slightly enlarges the card
            boxShadow: 4, // Adds a stronger shadow
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Running text */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Present Students
          </Typography>

          {/* Student count */}
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main",
            }}
          >
            {TotalResponsesPresent}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => handleClick("Absent")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Red border for absent status
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slightly enlarges the card
            boxShadow: 4, // Adds a stronger shadow
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Running text */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Absent
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Red color for absent count
            }}
          >
            {TotalResponsesAbsent}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => handleClick("Leave Request")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Blue border for request status
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slightly enlarges the card
            boxShadow: 4, // Adds a stronger shadow
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Running text */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Requests
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Blue color for requests
            }}
          >
            {totalLeaveRequest}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => handleClick("Drivers")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Green border for drivers
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slightly enlarges the card
            boxShadow: 4, // Adds a stronger shadow
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Running text */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Drivers
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Green color for drivers
            }}
          >
            {TotalResponsesDrivers}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => handleClick("Supervisor Approve")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Green border for consistency
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect
            boxShadow: 4, // Enhanced shadow on hover
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Running text */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Supervisors
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Keeping the theme consistent
            }}
          >
            {TotalResponsesSupervisor}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => setAssetStatusValue("Running")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main",
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect
            boxShadow: 4, // Enhanced shadow on hover
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Text Section */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Running Vehicles
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main",
            }}
          >
            {vehicleRunningCount}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => setAssetStatusValue("Parked")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Different color for parked vehicles
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect
            boxShadow: 4, // Enhanced shadow on hover
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        {/* Text Section */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Parked Vehicles
          </Typography>

          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Keeping a distinct color
            }}
          >
            {vehicleStoppedCount}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => setAssetStatusValue("Offline")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Yellow color to indicate offline vehicles
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition effect
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect
            boxShadow: 4, // Stronger shadow on hover
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Offline Vehicles
          </Typography>

          {/* Vehicle count */}
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Using warning color (orange) for offline
            }}
          >
            {vehicleUnreachableCount}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>

      <Box
        onClick={() => handleClick("Devices")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "200px",
          height: "110px",
          marginTop: "20px",
          padding: "12px",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "success.main", // Blue color to differentiate total devices
          backgroundColor: "background.paper",
          boxShadow: 2,
          position: "relative",
          transition: "all 0.3s ease-in-out", // Smooth transition effect
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect
            boxShadow: 4, // Stronger shadow on hover
            backgroundColor: "grey.100", // Light background on hover
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "6px",
            }}
          >
            Total Devices
          </Typography>

          {/* Device count */}
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "success.main", // Blue color for total count
            }}
          >
            {allDevices}
          </Typography>
        </Box>

        {/* Image at the bottom (car icon) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "3.5rem",
              transition: "transform 0.3s ease-in-out",
            }}
            src={schoolbus}
            alt="School Bus"
          />
        </Box>
      </Box>
    </Box>
  );
};
