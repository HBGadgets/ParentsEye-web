import React, { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";

import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import { RedAlertZone } from "../redAlertZone/redAlertZone.jsx";
import { Modal, Box as MuiBox, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import ChangePassword from "../ChangePassword.jsx";
import LockResetTwoToneIcon from "@mui/icons-material/LockResetTwoTone";
import { Login } from "@mui/icons-material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { TotalResponsesContext } from "../../TotalResponsesContext.jsx";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import notificationSound from "../../Google_Event.mp3";
import NotificationDropdown from "./header/NotificationDropdown.js";
import { CHeaderNav } from "@coreui/react";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InfoIcon from "@mui/icons-material/Info";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import AccountTreeIcon from "@mui/icons-material/AccountTree";

import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DevicesIcon from "@mui/icons-material/Devices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";

import AltRouteIcon from "@mui/icons-material/AltRoute";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SummarizeIcon from "@mui/icons-material/Summarize";
import InsightsIcon from "@mui/icons-material/Insights";
import { deepOrange, deepPurple, orange, teal } from "@mui/material/colors";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import axios from "axios";
import { Straighten as StraightenIcon } from "@mui/icons-material";
import { Map as MapIcon } from "@mui/icons-material";

const username = "schoolmaster"; // Replace with your actual username
const password = "123456";

const pages = [
  {
    title: "Home",
    icon: <HomeIcon />,
    arr: [{ name: "Dashboard", icon: <DashboardIcon /> }],
  },
  // { title: 'Master', icon: <DriveEtaIcon />, arr: ['Server','Device','Groups','Assets','School', 'Assets Type','Assets Command','Assets Category','Assets Class','Assets Group','Users','Assets URL','User Profile','Users Assets Mapping','User Menu Master','Import Location','Assets Division','Assets Owner','Driver Master','Over speed setting','Device Settings','Geo Data', 'Landmark Group','Commands','Top Main Menu Master','Import Trip','Top Menu Master','Broker','Address Book','Main Menu Master','Address Book Group','User Display Settings','RFID','Telecom Master','Landmark Images','Landmark Waypoints','Emails'] },
  // { title: 'Masterupdated', icon: <DriveEtaIcon />, arr: ['Preferences', 'Notifications', 'Account', 'Devices', 'Geofences', 'Groups', 'Drivers', 'Calendars', 'Computed Attributes', 'Maintenance', 'Saved Commands', 'Server', 'Userrr'] },

  // { title: 'School', icon: <SchoolIcon />, arr: ['Student Detail', 'Geofence', 'Pickup And Drop List', 'Absent', 'Present', 'Leave', 'Status', 'Approved Request', 'Denied Request'] },
  {
    title: "School",
    icon: <SchoolIcon />,
    arr: [
      { name: "Student Detail", icon: <PersonIcon /> },
      { name: "Geofence", icon: <LocationOnIcon /> },
      { name: "Pickup And Drop List", icon: <DirectionsBusIcon /> },
      { name: "Absent", icon: <NotInterestedIcon /> },
      { name: "Present", icon: <CheckCircleIcon /> },
      { name: "Leave Request", icon: <EventAvailableIcon /> },
      { name: "Status", icon: <InfoIcon /> },
      { name: "Approved Request", icon: <ThumbUpIcon /> },
      { name: "Denied Request", icon: <ThumbDownIcon /> },
    ],
  },
  // { title: 'Users', icon: <GroupIcon />, arr: ["SchoolMaster", "BranchMaster", 'Driver Approve', 'Parent Approve', 'Supervisor Approve', 'AddDevices', 'MyBranchDevices','Read Devices','User Access'] },
  {
    title: "Users",
    icon: <GroupIcon />,
    arr: [
      { name: "School Master", icon: <SchoolIcon /> },
      { name: "Branch Master", icon: <AccountTreeIcon /> },
      { name: "Driver Approve", icon: <DriveEtaIcon /> },
      { name: "Student Approve", icon: <EmojiPeopleIcon /> },
      { name: "Supervisor Approve", icon: <SupervisorAccountIcon /> },
      { name: "AddDevices", icon: <AddCircleIcon /> },
      { name: "My Branch Devices", icon: <DevicesIcon /> },
      { name: "Read Devices", icon: <VisibilityIcon /> },
      { name: "User Access", icon: <LockOpenIcon /> },
      { name: "Notification", icon: <NotificationsIcon /> },
    ],
  },
  {
    title: "Reports",
    icon: <BarChartIcon />,
    arr: [
      { name: "Device Status", icon: <DevicesIcon /> },
      { name: "Route", icon: <AltRouteIcon /> },
      { name: "Event", icon: <EventIcon /> },
      { name: "Trips", icon: <DirectionsCarIcon /> },
      { name: "Distance Report", icon: <DirectionsCarIcon /> },
      { name: "Stops", icon: <StopCircleIcon /> },
      { name: "Summary", icon: <SummarizeIcon /> },
      { name: "Statistics", icon: <InsightsIcon /> },
      { name: "Kilometer Distance", icon: <StraightenIcon /> },
      { name: "Geofence Report", icon: <MapIcon /> },
      { name: "History Report", icon: <SummarizeIcon /> },
    ],
  },

  // // { title: 'Geofencing', icon: <DriveEtaIcon />, arr: ['Create Landmark', 'Edit Landmarks','Create Route','Edit Routes','Create Area','Edit Areas','Create Zone','Edit Zones','Trips'] },
  //  { title: 'Reports', icon: <BarChartIcon />, arr: ['Summary', 'Stop Report', 'Area In/Out Report', 'Area Report', 'Landmark Distance', 'Landmark Report', 'Location Wise Distance', 'Distance Report', 'Run Report', 'Distance Graph', 'Speed Graph', 'Trip Report', 'All Point Report','RFID','Distance Between Report','Vehicle Average','Alerts','Data Logs','AC Report', 'Petrolling Report','Bin Details Report','ETA details report','ETA details'] },
  // { title: 'Reports', icon: <BarChartIcon />, arr: ['Device Status', 'Route', 'Event', 'Trips', 'Stops', 'Summary', 'Statistics'] },
  // // {title: 'Institutestudent', icon: <BarChartIcon />, arr: ['Combined1','Route1','Events1','Trips1','Stops1','Summary1','Statistics1','Newdemo',"New2","Server2"]}
  // { title: 'Maintenance', icon: <SettingsIcon />, arr: ['Search','Add maintenance','Type of operation','Custom Profile'] },
];

export const Navbar = (props) => {
  const [selectedPage, setSelectedPage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filteredPages, setFilteredPages] = useState([]);
  const role = localStorage.getItem("role");
  const decode = jwtDecode(localStorage.getItem("token"));
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const silentFeature = (isOn) => {
    if (isOn) {
      console.log("Volume is ON");
    } else {
      console.log("Volume is OFF");
    }
  };
  const toggleVolume = () => {
    const newVolumeState = !isVolumeOn;
    setIsVolumeOn(newVolumeState);
    silentFeature(newVolumeState);
  };

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }

    if (role == 1) {
      setFilteredPages(pages);
    } else if (role == 2 || role == 3 || role == 4) {
      const pagesToFilter = [
        "Home",
        "School",
        "Users",
        "Reports",
        "Maintenance",
      ];
      const filter = pages.filter((item) => pagesToFilter.includes(item.title));

      setFilteredPages(filter);
    }
  }, []);

  const handleNavClick = (arr, title) => {
    console.log("Role:", role);
    console.log("Original Array:", arr);
    console.log("Title:", title);

    let updatedArr = [];
    if (role == 1) {
      updatedArr = arr.filter((item) => item.name !== "My Branch Devices");
    } else if (role == 2) {
      updatedArr = arr.filter(
        (item) =>
          item.name !== "School Master" &&
          item.name !== "AddDevices" &&
          item.name !== "My Branch Devices" &&
          item.name !== "User Access" &&
          item.name !== "Notification"
      );
    } else if (role == 3 || role == 4) {
      updatedArr = arr.filter(
        (item) =>
          item.name !== "School Master" &&
          item.name !== "Branch Master" &&
          item.name !== "AddDevices" &&
          item.name !== "My Branch Devices" &&
          item.name !== "User Access" &&
          item.name !== "Notification"
      );
    }
    console.log("Updated Array:", updatedArr);
    props.propFunc(updatedArr);
    props.propBool(true);
    setSelectedPage(title);
  };

  const handleRedAlert = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Programmatically navigate to login and force reload
    navigate("/Login", { replace: true });
    window.location.reload(); // Ensures the app state is cleared
  };

  useEffect(() => {
    const handlePopState = () => {
      // Redirect to Login if token is not present
      if (!localStorage.getItem("token")) {
        navigate("/Login", { replace: true });
        window.history.pushState(null, null, "/Login");
      }
    };

    // Attach popstate listener
    window.addEventListener("popstate", handlePopState);

    // Perform initial check when Navbar loads
    if (!localStorage.getItem("token")) {
      navigate("/Login", { replace: true });
      window.history.pushState(null, null, "/Login");
    }

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  // ################### notification code is here ##########

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const socket = io(`${process.env.REACT_APP_API}`);
  const branchId = decodedToken && decodedToken.id;
  const [notifications, setNotifications] = useState([]);
  const [allowedNotifications, setAllowedNotifications] = useState({
    data: [],
  });
  const [notificationPreferences, setNotificationPreferences] = useState([]);

  const fetchAllowedNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        // `${process.env.REACT_APP_SUPER_ADMIN_API}/read-devices`,
        `${process.env.REACT_APP_API}/getnotificationtypes`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllowedNotifications(response.data);
      console.log("Fetcheeeeed Allowed Notification", response.data);
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };
  useEffect(() => {
    const notificationSocket = () => {
      const audio = new Audio(notificationSound);
      socket.emit("authenticate", { token });

      socket.on("allAlerts", (data) => {
        console.log("Notification received:", data);
        // if (isVolumeOn) {
        //   audio.play();
        // }

        // Map notifications to readable messages
        const flattenedData = data.flat();
        const updatedMessages = flattenedData
          .map((item) => {
            const matchingDevice = allowedNotifications.data.find(
              (device) => parseInt(device.deviceId) == Number(item.deviceId)
            );

            if (!matchingDevice) {
              console.log("No matching device found.");
              return null; // Skip if no matching device
            } else {
              if (isVolumeOn) {
                audio.play();
              }
            }

            let message = null;
            if (item.ignition && matchingDevice.ignitionOn) {
              message = `Bus On - ${matchingDevice.deviceName}`;
            } else if (item.ignition == false && matchingDevice.ignitionOff) {
              console.log("ignition item", item.ignition);
              message = `Bus Off - ${matchingDevice.deviceName}`;
            } else if (
              item.status == "Entered" &&
              matchingDevice.geofenceEnter
            ) {
              //write geofence and absent present logic of notification similar to above logic
              message = `Geofence Enter  ${item.geofenceName} - ${matchingDevice.deviceName}`;
            } else if (
              item.status == "Exited" &&
              matchingDevice.geofenceEnter
            ) {
              message = `Geofence Exit ${item.geofenceName} - ${matchingDevice.deviceName}`;
            }

            return message;
          })
          .filter(Boolean);
        console.log("Generated Messages:", updatedMessages);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...updatedMessages,
        ]);
      });
    };

    if (allowedNotifications.data) {
      notificationSocket(); // Initialize socket only if allowedNotifications are available
    }

    return () => {
      socket.off("allAlerts"); // Cleanup socket on component unmount
    };
  }, [allowedNotifications, isVolumeOn]);

  // const notificationSocket = () => {
  //   const audio = new Audio(notificationSound);
  //   console.log("this is notification function and i am waiting for notification")
  //   socket.emit('registerBranch', branchId);
  //   socket.on("notification", (data) => {
  //     console.log("Notification", data);
  //     audio.play();
  //     setNotifications((prevNotifications) => [...prevNotifications, data])
  //   });
  // }

  useEffect(() => {
    console.log("this is notification socket code");
    fetchAllowedNotification();
    // notificationSocket();
  }, []);

  const handleAccount = () => {
    <Grid item>
      <Tooltip title="Add" placement="bottom-start">
        <Button>bottom-start</Button>
      </Tooltip>
    </Grid>;
  };

  return (
    <>
      {" "}
      <AppBar
        position="fixed"
        sx={{ zIndex: 1301, backgroundColor: "#f4d24a", height: "61px" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to={"/"}>
              <img
                src="parentslogo.png"
                style={{
                  height: "61px",
                  width: "142px",
                  paddingTop: "10px",
                  paddingBottom: "5px",
                }}
              />
            </Link>
            <br />
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                marginLeft: "5px",
              }}
            ></Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                paddingTop: "0px",
              }}
            >
              {filteredPages.map((page) => (
                <Button
                  key={page.title}
                  sx={{
                    mx: 1,
                    color: "black",
                    backgroundColor:
                      selectedPage === page.title
                        ? "rgba(255, 255, 255, 0.2)"
                        : "transparent",
                  }}
                  onClick={() => handleNavClick(page.arr, page.title)}
                >
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{ display: "flex", alignItems: "left" }}
                  >
                    {page.icon}
                    {page.title}
                    <ExpandMoreIcon />
                  </Typography>
                </Button>
              ))}
            </Box>

            {/* 　<CHeaderNav className="ms-auto">
            <div>
              {isVolumeOn ? (
                <VolumeUpIcon
                  style={{ fontSize: 30, cursor: "pointer", color: "#000000" }}
                  onClick={toggleVolume}
                />
              ) : (
                <VolumeOffIcon
                  style={{ fontSize: 30, cursor: "pointer", color: "#f50057" }}
                  onClick={toggleVolume}
                />
              )}
            </div>
          </CHeaderNav> */}
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                paddingTop: "0px",
              }}
            >
              {/* <CHeaderNav className="ms-auto">
              <IconButton sx={{ p: 0 }}>
                <NotificationDropdown notifications={notifications} />
              </IconButton>
          </CHeaderNav> */}
              <CHeaderNav className="ms-auto">
                {/* Notification Dropdown with Icon from CoreUI */}
                <Tooltip title="Notifications">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                      paddingRight: "15px",
                    }}
                  >
                    <NotificationDropdown notifications={notifications} />
                  </div>
                </Tooltip>
              </CHeaderNav>
              {/* <Tooltip title='Red Zone Alert'>
              <IconButton sx={{ p: 0 }} onClick={handleRedAlert}>
                <ReportProblemOutlinedIcon style={{ color: 'red', marginRight: 10 }} />
              </IconButton>
            </Tooltip> */}
              <Tooltip title="Refresh Page">
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => window.location.reload()}
                >
                  <LoopSharpIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
              <Tooltip>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      {/* <Avatar sx={{ width: 32, height: 32 }}></Avatar> */}
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: orange[900] }}
                      >
                        {decode.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  // onClick={handleClose}
                  sx={{ zIndex: 1302 }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  alignItems={{ horizontal: "right" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(to right, rgb(253, 215, 52),rgba(216, 125, 34, 0.91))",
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon sx={{ marginRight: 1 }}>
                        <Avatar
                          fontSize="small"
                          sx={{ bgcolor: orange[900] }}
                        />
                      </ListItemIcon>
                      Profile: {decode.username}
                    </MenuItem>
                    {/* <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                  </MenuItem> */}
                  </div>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    <a
                      href="tel:+9370180012"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Helpline No: 9370180012
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <div
                        onClick={toggleVolume}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        {isVolumeOn ? (
                          <VolumeUpIcon
                            style={{ fontSize: 25, color: "#000000" }}
                          />
                        ) : (
                          <VolumeOffIcon
                            style={{ fontSize: 25, color: "#f50057" }}
                          />
                        )}
                        <span style={{ marginLeft: "8px" }}>
                          {isVolumeOn
                            ? "Mute notification"
                            : "Unmute notification"}
                        </span>
                      </div>
                    </ListItemIcon>
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Language
                </MenuItem> */}
                  <Link to={"/Login"}>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Login fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Link>
                  {/* <Link to={"/ChangePassword"} >
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <LockResetTwoToneIcon fontsize="small" />
                    </ListItemIcon>
                    ChangePassword
                  </MenuItem>
                </Link> */}
                </Menu>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="red-alert-modal-title"
          aria-describedby="red-alert-modal-description"
        >
          <MuiBox sx={style}>
            <div
              style={{
                backgroundColor: "rgb(253, 215, 52)",
                color: "black",
                height: 40,
                display: "flex",
              }}
            >
              <b style={{ marginLeft: 5 }}>Red Alert Zone</b>
            </div>
            <Typography id="red-alert-modal-title" variant="h6" component="h2">
              RedZone Time
            </Typography>
            <select style={{ width: 200, height: 40 }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
            </select>
            <br />

            <RedAlertZone />
          </MuiBox>
        </Modal>
      </AppBar>
    </>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid rgb(253, 215, 52)",
  boxShadow: 24,
};
