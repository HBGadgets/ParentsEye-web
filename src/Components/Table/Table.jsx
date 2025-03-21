import React, { useState, useEffect, useCallback, useContext } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { COLUMNS } from "./columns.js";
import MOCK_DATA from "./MOCK_DATA.json";
import GoogleMapComponent from "../googlemap/googlemap.jsx";
import { Cards } from "../Cards/Cards.jsx";
import * as XLSX from "xlsx";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { StyledTablePagination } from "../../Components/VariousTables/PaginationCssFile/TablePaginationStyles.js";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  Typography,
  keyframes,
} from "@mui/material";
import IndividualGooglemap from "../googlemap/IndividualGooglemap/IndividualGooglemap.jsx";
import "./table.css";
import {
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { IoMdBatteryCharging } from "react-icons/io";
import { MdGpsFixed, MdGpsNotFixed } from "react-icons/md";
import { PiEngineFill } from "react-icons/pi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "./DashCon.css";
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
// Extend dayjs with the duration plugin
import busY from "../../assets/school-bus-yellow.png";
import { TotalResponsesContext } from "../../TotalResponsesContext.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNewAddress } from "./addressSlice.js";
import schoolbus from "../images/schoolbus-png.png";
dayjs.extend(duration);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

export const Tablee = ({ data }) => {
  // console.log(data);
  const [page, setPage] = useState(0);
  const [individualDataObj, setIndividualDataObj] = useState({});
  const [filterText, setFilterText] = useState("");
  const [filteredRows, setFilteredRows] = useState(
    MOCK_DATA.map((row) => ({ ...row, isSelected: false }))
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS.map((col) => [col.accessor, true]))
  );
  const [visibleColumns, setVisibleColumns] = useState({
    srNo: true,
    vehicle: true,
    deviceName: true,
    address: true,
    driver: true,
    lastUpdate: true,
    speed: true,
    distance: true,
    satellite: true,
    ignition: true,
    gps: true,
    power: true,
    track: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [vehicleRunningCount, setVehicleRunningCount] = useState(0);
  const [vehicleStoppedCount, setVehicleStoppedCount] = useState(0);
  const [vehicleOverspeedCount, setVehicleOverspeedCount] = useState(0);
  const [vehicleIdleCount, setVehicleIdleCount] = useState(0);
  const [vehicleUnreachableCount, setVehicleUnreachableCount] = useState(0);
  const [apiData, setAPIData] = useState([]);
  const [assetDetailsModalOpen, setAssetDetailsModalOpen] = useState(false);
  //updated by sudesh
  const [assetStatusValue, setAssetStatusValue] = useState("All assets");
  const [filteringData, setFilteringData] = useState(data);
  const [assetsValue, setAssetsValue] = useState("All assets");
  const [searchItem, setSearchItem] = useState("");
  //till here
  const [usersValue, setUsersValue] = useState("");
  const [groupsValue, setGroupsValue] = useState("");
  const [areasValue, setAreasValue] = useState("");
  const [landmarksValue, setLandmarksValue] = useState("");
  const [vehiclesValue, setVehiclesValue] = useState("");
  const [totDist, setTotDist] = useState(0);
  const [attributes1, setAttributes1] = useState("");
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [addressesValue, setAddressesValue] = useState();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [lati, setLati] = useState(0);
  const [longi, setLongi] = useState(0);
  const [individualMap, setIndividualMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const role = localStorage.getItem("role");
  const [currentPage, setCurrentPage] = useState(0); // State for the current page
  const [rowsPerPage, setRowsPerPage] = useState(13); // State for the number of rows per page
  const [selectedDriver, setSelectedDriver] = useState(""); // To manage selected value
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const dispatch = useDispatch();
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const [searchTerm, setSearchTerm] = useState("");
  const { newAddress } = useSelector((state) => state.address);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const filteredData = filteringData.filter((item) => {
    const nameMatch =
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const deviceIdMatch =
      typeof item.deviceId === "string" &&
      item.deviceId.toLowerCase().includes(searchTerm.toLowerCase());
    const distanceMatch =
      typeof item.attributes?.distance === "number" &&
      item.attributes.distance.toString().includes(searchTerm);
    const driverMatch =
      typeof item.driver_name === "string" &&
      item.driver_name.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || deviceIdMatch || distanceMatch || driverMatch;
  });
  const currentRows = filteredData.slice(startIndex, endIndex);
  if (data) {
    console.log("my data", data);
  }
  const getSortValue = (item, column) => {
    switch (column) {
      case "deviceName":
        return item.name?.toLowerCase();
      case "address":
        return newAddress[item.deviceId]?.toLowerCase();
      case "driver":
        return drivers
          .find((d) => d.deviceId === item.deviceId)
          ?.driverName?.toLowerCase();
      case "lastUpdate":
        return new Date(item.lastUpdate);
      case "speed":
        return item.speed;
      case "distance":
        return item.attributes.distance;
      case "satellite":
        return item.attributes.sat;
      case "ignition":
        return item.attributes.ignition;
      case "gps":
        return item.valid;
      case "power":
        return item.attributes.battery;
      default:
        return 0;
    }
  };
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const sortedRows = [...currentRows].sort((a, b) => {
    if (!sortBy) return 0;

    const valueA = getSortValue(a, sortBy);
    const valueB = getSortValue(b, sortBy);

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

 
  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Update the current page state
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value)); // Update rows per page
    setCurrentPage(0); // Reset to first page
  };

  // Calculate the number of pages
  const pageCount = Math.ceil(data.length / rowsPerPage);

  // Get the current rows based on the selected page
  
  // const   currentRows = data.slice(startIndex, endIndex);

 
 

  useEffect(() => {
    setFilteredRows(data.map((row) => ({ ...row, isSelected: false })));
  }, [data]);

  useEffect(() => {
    setLatitude(data.map((row) => row.latitude));
    // console.log(latitude);
  }, [data]);

  useEffect(() => {
    setLongitude(data.map((row) => row.longitude));
    //  console.log(longitude);
  }, [data]);

  useEffect(() => {}, [filteredRows]);

  useEffect(() => {
    const running = data.filter(
      (row) =>
        row.speed >= 2 && row.speed <= 60 && row.attributes.ignition === true
    ).length;
    setVehicleRunningCount(running);

    const stopped = data.filter(
      (row) => row.speed < 1 && row.attributes.ignition === false
    ).length;
    setVehicleStoppedCount(stopped);

    const overspeed = data.filter(
      (row) => row.speed > 60 && row.attributes.ignition === true
    ).length;
    setVehicleOverspeedCount(overspeed);

    const idle = data.filter(
      (row) => row.speed < 2 && row.attributes.ignition === true
    ).length;
    setVehicleIdleCount(idle);

    const currentTime = new Date();
    const thirtyHoursInMilliseconds = 30 * 60 * 60 * 1000;

    const unreachable = data.filter(
      (row) =>
        row.status === "offline" &&
        currentTime - new Date(row.lastUpdate) > thirtyHoursInMilliseconds
    ).length;
    setVehicleUnreachableCount(unreachable);
  }, [data]);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
  };

  const filterData = (text) => {
    const filteredData = MOCK_DATA.filter((row) =>
      Object.values(row).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(text.toLowerCase())
      )
    ).map((row) => ({ ...row, isSelected: false }));
    setFilteredRows(filteredData);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleVehicleClick = () => {
    setAssetDetailsModalOpen(true);
  };

  const handleLocationClick = (latitude, longitude, row) => {
    setIndividualMap(true);
    console.log("I am row .........................   ", row);
    setLati(latitude);

    setLongi(longitude);
  };

  const handleData = (dataLat, dataLng, data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].latitude === dataLat && data[i].longitude === dataLng) {
        setIndividualDataObj(data[i]);
        // console.log(data[i]);
      }
    }
  };

  const handleExport = () => {
    const dataToExport = filteredRows.map((row) => {
      const { isSelected, ...rowData } = row;
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Dashboard.xlsx");
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prevState) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const handleRowSelect = (index) => {
    const newFilteredRows = [...filteredRows];
    newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
    setFilteredRows(newFilteredRows);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newFilteredRows = filteredRows.map((row) => ({
      ...row,
      isSelected: newSelectAll,
    }));
    setFilteredRows(newFilteredRows);
    setSelectAll(newSelectAll);
  };

  const sortedData = [...filteredRows];

  if (sortConfig.key !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const columns = COLUMNS.map((col) => ({
    ...col,
    Cell:
      col.accessor === "select"
        ? ({ row }) => (
            <input
              type="checkbox"
              checked={row.original.isSelected}
              onChange={() => handleRowSelect(row.index)}
            />
          )
        : col.Cell,
  }));
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  const determineStatus = (vehicle) => {
    const currentTime = new Date();
    const lastUpdateTime = new Date(vehicle.lastUpdate); // Assuming vehicle has a lastUpdate property

    if (vehicle.ignition && vehicle.speed > 5) return "Running";
    if (vehicle.ignition && vehicle.speed <= 5) return "Ideal";
    if (!vehicle.ignition && vehicle.speed === 0) return "Stopped";
    if (!vehicle.ignition && currentTime - lastUpdateTime > 24 * 60 * 60 * 1000)
      return "Unreachable";
    return "New";
  };
  const [filteredAssets, setFilteredAssets] = useState(data);

  const filteredVehicles = filteredAssets.filter((vehicle) => {
    const status = determineStatus(vehicle);
    return assetStatusValue === "All assets" || status === assetStatusValue;
  });
  useEffect(() => {
    if (assetsValue === "All assets" || assetsValue === "") {
      setFilteredAssets(data);
    } else {
      const filteredData = data.filter((asset) => asset.name === assetsValue);
      setFilteredAssets(filteredData);
    }
  }, [assetsValue, data]);

  // Update the filteredRows to use filteredAssets
  useEffect(() => {
    setFilteredRows(
      filteredAssets.map((row) => ({ ...row, isSelected: false }))
    );
  }, [filteredAssets]);

  useEffect(() => {
    let filteredData = data;

    if (vehiclesValue && vehiclesValue !== "All vehicles") {
      filteredData = filteredData.filter(
        (asset) => asset.category === vehiclesValue
      );
    }

    setFilteredAssets(filteredData);
  }, [vehiclesValue, data]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const { selectedVehicle, setSelectedVehicle } = useContext(
    TotalResponsesContext
  );
  const handleSelectVehicle = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue == "All assets") {
      // Clear selection to show all devices
      setSelectedVehicle({});
    } else {
      // Find the selected device and set its details
      const selectedDevice = data.find(
        (asset) => asset.deviceId == selectedValue
      );
      const selectedDeviceDetails = {
        deviceId: selectedDevice.deviceId,
        name: selectedDevice.name,
        latitude: selectedDevice.latitude,
        longitude: selectedDevice.longitude,
      };
      setSelectedVehicle(selectedDeviceDetails);
      console.log("Selected Device:", selectedDeviceDetails);
    }
  };
  const [totalResponses, setTotalResponses] = useState(0);

  const [childrenList, setChildrenList] = useState([]); // State to hold child names
  // const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const { setCoordinates } = useContext(TotalResponsesContext);

  const handleRowDoubleClick = (item) => {
    // Assuming `item` has latitude and longitude properties
    if (item) {
      const { latitude, longitude, name } = item;
      setCoordinates({ latitude, longitude, name });
      console.log(
        `Latitude: ${latitude}, Longitude: ${longitude}, deviceName: ${name}`
      ); // Optional: Log the coordinates
    }
  };
  const fetchData = async (startDate = "", endDate = "") => {
    try {
      let response;
      if (role == 1) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 4) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_USERBRANCH}/read-children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data); // Log the entire response data
      // fetchgeofencepoint();
      if (response?.data) {
        const allData =
          role == 1
            ? response.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.children) && branch.children.length > 0
                    ? branch.children.map((child) => ({
                        ...child, // Spread child object to retain all existing properties
                        schoolName: school.schoolName,
                        branchName: branch.branchName,
                      }))
                    : []
                )
              )
            : role == 4
            ? response?.data.updatedChildData.map((child) => ({
                ...child,
              }))
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.children) && branch.children.length > 0
                  ? branch.children
                  : []
              )
            : response?.data.data;

        console.log(allData);
        const childNames = allData.map((child) => child.childName);
        // const childNames = response.data; // Replace this with the actual extracted childName array
        setChildrenList(childNames);
        console.log("All Child Names:", childNames);
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);
  const [groups, setGroups] = useState([]); // Holds the fetched groups
  // const [groupsValue, setGroupsValue] = useState(''); // Holds the selected group
  // const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://104.251.212.84/api/groups", {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("hbtrack:123456@"), // Replace with actual credentials
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setGroups(data); // Assuming the API returns an array of groups
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGroups();
  }, []);
  // const [areasValue, setAreasValue] = useState('');

  useEffect(() => {
    const fetchAreasData = async () => {
      try {
        const username = "hbtrack"; // Replace with your actual username
        const password = "123456@"; // Replace with your actual password
        const token = btoa(`${username}:${password}`); // Base64 encode the username and password

        const response = await fetch("http://104.251.212.84/api/geofences", {
          method: "GET",
          headers: {
            Authorization: `Basic ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Geofence data: ", data);

        // Transform data to create dropdown options
        setAreas(data.map((item) => item.name));
      } catch (error) {
        console.error("Error fetching areas data:", error);
        setError(error.message);
      }
    };

    fetchAreasData();
  }, []);

  const [drivername, setdrivername] = useState([]);
  const fetchDataDriver = async (startDate = "", endDate = "") => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 4) {
        response = await axios.get(
          `${process.env.REACT_APP_USERBRANCH}/getdriverdata`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data);

      if (response?.data) {
        console.log(response.data);
        const allData =
          role == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.drivers) && branch.drivers.length > 0
                    ? branch.drivers
                    : []
                )
              )
            : role == 2
            ? response?.data.branches.flatMap((branch) => branch.drivers)
            : response?.data.drivers;

        console.log("drivers : ", allData);

        console.log("this is drivers data", allData);
        const driverNames = allData.map((child) => child.driverName);
        // const childNames = response.data; // Replace this with the actual extracted childName array

        console.log("All driver Names:", driverNames);
        setDrivers(allData); // If no date range, use all data
        setdrivername(driverNames);
      } else {
        console.error("Expected an array but got:", response.data.drivers);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [supervisorsNames, setsupervisorsNames] = useState([]);
  const fetchDatasupervisor = async (startDate = "", endDate = "") => {
    try {
      const token = localStorage.getItem("token");
      let response;

      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-supervisors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 4) {
        response = await axios.get(
          `${process.env.REACT_APP_USERBRANCH}/readSuperviserBybranchgroupuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data); // Log the entire response data

      if (response?.data) {
        const allData =
          role == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.supervisors) &&
                  branch.supervisors.length > 0
                    ? branch.supervisors
                    : []
                )
              )
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.supervisors) &&
                branch.supervisors.length > 0
                  ? branch.supervisors
                  : []
              )
            : response.data.supervisors;

        console.log("supervisirs", allData);
        const SupervisorsNames = allData.map((child) => child.supervisorName);

        setsupervisorsNames(SupervisorsNames);
      } else {
        console.error("Expected an array but got:", response.data.supervisors);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [parentsNames, setparentsNames] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const fetchDataparent = async (startDate = "", endDate = "") => {
    try {
      const token = localStorage.getItem("token");
      let response;
      if (role == 1) {
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-parents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-parents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-parents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 4) {
        response = await axios.get(
          `${process.env.REACT_APP_USERBRANCH}/getparentbybranchgroup`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("fetch data", response.data); // Log the entire response data

      if (response.data) {
        const allData =
          role == 1
            ? response?.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.parents) && branch.parents.length > 0
                    ? branch.parents.map((parent) => ({
                        ...parent,
                        schoolName: school.schoolName,
                        branchName: branch.branchName,
                      }))
                    : []
                )
              )
            : role == 4
            ? response.data.data.flatMap((item) =>
                Array.isArray(item.branches) && item.branches.length > 0
                  ? item.branches.flatMap((branch) =>
                      Array.isArray(branch.parents) && branch.parents.length > 0
                        ? branch.parents.map((child) => ({
                            ...child,
                          }))
                        : []
                    )
                  : []
              )
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.parents) && branch.parents.length > 0
                  ? branch.parents
                  : []
              )
            : response.data.parents;

        console.log(allData);
        const ParentsNames = allData.map((child) => child.parentName);

        setparentsNames(ParentsNames);
        // Apply local date filtering if dates are provided
      } else {
        console.error("Expected an array but got:", response.data.parents);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [selectedGeofence, setSelectedGeofence] = useState("");

  const [geofencesNames, setgeofencesNames] = useState([]);
  const fetchDatageofences = async (startDate = "", endDate = "") => {
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

      console.log("fetch data geofence", response.data);
      if (response?.data) {
        let allData;

        // Logic for role 1: Devices and stops
        if (role == 1) {
          allData = Object.entries(response.data).flatMap(([deviceId, stops]) =>
            stops.map((stop) => ({
              ...stop, // Retain all stop properties
              deviceId, // Add deviceId to each stop
            }))
          );

          // Logic for role 2: Branches and geofences
        } else if (role == 2) {
          allData = response?.data?.branches.flatMap(
            (branch) =>
              branch.geofences?.map((geofence) => ({
                ...geofence, // Retain all geofence properties
                branchId: branch.branchId, // Add branchId to each geofence
                branchName: branch.branchName, // Add branchName to each geofence
              })) || [] // Handle the case where geofences is undefined or empty
          );

          // Logic for role 3: Branches and devices
        } else if (role == 3) {
          allData = response?.data.geofences.map((geofence) => ({
            ...geofence, // Keep all geofence properties
            branchId: response.data.branchId, // Add branchId from the response
            branchName: response.data.branchName, // Add branchName from the response
            schoolName: response.data.schoolName, // Add schoolName from the response
          }));

          console.log(allData);
        } else if (role == 4) {
          allData = response?.data?.branches.flatMap(
            (branch) =>
              branch.geofences?.map((geofence) => ({
                ...geofence, // Retain all geofence properties
                branchId: branch.branchId, // Add branchId to each geofence
                branchName: branch.branchName, // Add branchName to each geofence
              })) || [] // Handle the case where geofences is undefined or empty
          );
          console.log("aa", allData);
        }

        const geofencesNames = allData.map((child) => child.name);

        setgeofencesNames(geofencesNames);
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchDataDriver();
    fetchDatasupervisor();
    fetchDataparent();
    fetchDatageofences();
  }, []);

  // Handle the search input change
  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  // const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };



  const fetchAddress = async (vehicleId, longitude, latitude) => {
    try {
      const apiKey = "DG2zGt0KduHmgSi2kifd"; // Replace with your actual MapTiler API key
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
      );
      // console.log(response)
      const address =
        response.data.features.length <= 5
          ? response.data.features[0].place_name_en
          : response.data.features[1].place_name_en;

      setAddress((prevAddresses) => ({
        ...prevAddresses,
        [vehicleId]: address, // Update the specific vehicle's address
      }));
    } catch (error) {
      console.error("Error fetching the address:", error);
      setAddress((prevAddresses) => ({
        ...prevAddresses,
        [vehicleId]: "Error fetching address",
      }));
    }
  };

  const setNewAddressForRedux = (address) => {
    if (address) {
      dispatch(setNewAddress(address));
    }
  };

  useEffect(() => {
    setNewAddressForRedux(address);
  }, [address]);

  useEffect(() => {
    console.log("filtered vehicle", currentRows);
    currentRows.forEach((vehicle) => {
      if (
        vehicle?.deviceId &&
        vehicle.longitude &&
        vehicle.latitude &&
        !address[vehicle.id]
      ) {
        // Fetch address only if it's not already fetched for this vehicle
        fetchAddress(vehicle.deviceId, vehicle.longitude, vehicle.latitude);
      }
    });
    // console.log(address)
  }, [currentRows]);

  //updated by sudesh
  useEffect(() => {
    const filterData = () => {
      const now = dayjs(); // current time for calculating offline status

      let filtered = data;
      switch (assetStatusValue) {
        case "Running":
          filtered = data.filter(
            (obj) =>
              obj.speed > 2 &&
              obj.speed < 60 &&
              obj.attributes.ignition === true
          );
          break;
        case "Over Speed":
          filtered = data.filter(
            (obj) => obj.speed > 60 && obj.attributes.ignition === true
          );
          break;
        case "Parked":
          filtered = data.filter(
            (obj) => obj.speed < 2 && obj.attributes.ignition === false
          );
          break;
        case "Offline":
          filtered = data.filter(
            (obj) =>
              now.diff(dayjs(obj.lastUpdate), "hour") > 30 &&
              obj.attributes.ignition === false
          );
          break;
        default: // "All assets"
          filtered = data;
      }

      setFilteringData(filtered);
    };

    filterData();
  }, [assetStatusValue, data]);

  const handleVehicle = (event, newValue) => {
    setAssetsValue(newValue ? newValue : "All assets");
    setFilteringData(
      newValue === "All assets"
        ? data
        : data.filter((vehicle) => vehicle.name === newValue)
    );
  };

  const navigate = useNavigate();
  const handleClickOnTrack = (vehicle) => {
    console.log("trcak clicked");
    navigate(
      `/salesman/${vehicle.deviceId}/${vehicle.category}/${vehicle.name}`
    );
  };
  //till here
  // const [page, setPage] = useState(0);
  //  const [rowsPerPage, setRowsPerPage] = useState(25);
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage); // Set to all rows if -1
    setPage(0); // Reset to the first page
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };
  return (
    <>
      <div style={{ marginTop: "80px" }}>
        {individualMap ? (
          <></>
        ) : (
          <>
            {/* <hr /> */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "0px",
                padding: "0 20px",
              }}
            >
              <FormControl
                variant="outlined"
                fullWidth
                sx={{ width: 250, "& .MuiInputBase-root": { height: 50 } }}
              >
                <InputLabel id="asset-status-label-1">Asset Status</InputLabel>
                <Select
                  labelId="asset-status-label-1"
                  id="asset-status-select-1"
                  value={assetStatusValue}
                  onChange={(e) => setAssetStatusValue(e.target.value)}
                  label="Select Asset Status"
                >
                  <MenuItem value="All assets">All assets</MenuItem>
                  <MenuItem value="Running">Running</MenuItem>
                  <MenuItem value="Parked">Parked</MenuItem>
                  <MenuItem value="Over Speed">Over Speed</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                sx={{ width: 250, "& .MuiInputBase-root": { height: 50 } }}
              >
                <Autocomplete
                  aria-placeholder="Select Vehicle"
                  options={["All assets", ...data.map((asset) => asset.name)]}
                  value={assetsValue}
                  onChange={handleVehicle}
                  inputValue={searchItem}
                  onInputChange={(event, newInputValue) => {
                    setSearchItem(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Assets"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                sx={{ width: 250, "& .MuiInputBase-root": { height: 50 } }} // Match the width and height of the Assets dropdown
              >
                <InputLabel id="students-label">Student List</InputLabel>
                <Select
                  labelId="students-label"
                  id="students-select"
                  value={usersValue}
                  onChange={(e) => setUsersValue(e.target.value)}
                  label="Select Student"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200, // Set max height for dropdown
                        minWidth: 150, // Set minimum width for the dropdown menu
                        "& .MuiMenu-list": {
                          maxWidth: 150, // Limit the max width of the menu items
                          // Enable horizontal scrolling for overflow
                        },
                      },
                    },
                    // sx:{overflowX: "auto",}
                  }}
                >
                  <MenuItem value="All students">All students</MenuItem>

                  {/* Dynamically create MenuItems from childrenList */}
                  {childrenList.map((child, index) => (
                    <MenuItem
                      key={index}
                      value={child}
                      sx={{ maxWidth: 150 }} // Limit item width and add horizontal scrolling
                    >
                      {child}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                sx={{ width: 250, "& .MuiInputBase-root": { height: 50 } }} // Match the width and height
              >
                <InputLabel id="drivers-label">Driver List</InputLabel>
                <Select
                  labelId="drivers-label"
                  id="drivers-select"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  label="Select Driver"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200, // Set max height for dropdown
                        minWidth: 150, // Set minimum width for the dropdown menu
                        "& .MuiMenu-list": {
                          maxWidth: 150, // Limit the max width of the menu items
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="All drivers">All drivers</MenuItem>

                  {/* Dynamically create MenuItems from drivername list */}
                  {drivername.map((driver, index) => (
                    <MenuItem key={index} value={driver}>
                      {driver}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                fullWidth
                sx={{ width: 250, "& .MuiInputBase-root": { height: 50 } }} // Match the width and height
              >
                <InputLabel id="supervisors-label">Supervisor List</InputLabel>
                <Select
                  labelId="supervisors-label"
                  id="supervisors-select"
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.target.value)}
                  label="Select Supervisor"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200, // Set max height for dropdown
                        minWidth: 150, // Set minimum width for the dropdown menu
                        "& .MuiMenu-list": {
                          maxWidth: 150, // Limit the max width of the menu items
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="All supervisors">All Supervisors</MenuItem>

                  {/* Dynamically create MenuItems from supervisorsNames list */}
                  {supervisorsNames.map((supervisor, index) => (
                    <MenuItem key={index} value={supervisor}>
                      {supervisor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                sx={{ width: 250, "& .MuiInputBase-root": { height: 50 } }}
              >
                <InputLabel id="parents-label">Parent List</InputLabel>
                <Select
                  labelId="parents-label"
                  id="parents-select"
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  label="Select Parent"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        minWidth: 150,
                        "& .MuiMenu-list": {
                          maxWidth: 150,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">All parents</MenuItem>

                  {/* Dynamically create MenuItems from parentsNames list */}
                  {parentsNames.map((parent, index) => (
                    <MenuItem key={index} value={parent}>
                      {parent}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                sx={{
                  width: 250,
                  "& .MuiInputBase-root": { height: 50 },
                  marginBottom: 2,
                }}
              >
                <InputLabel id="geofences-label">Geofence List</InputLabel>
                <Select
                  labelId="geofences-label"
                  id="geofences-select"
                  value={selectedGeofence}
                  onChange={(e) => setSelectedGeofence(e.target.value)}
                  label="Select Geofence"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        minWidth: 150,
                        marginBottom: 2,
                        "& .MuiMenu-list": {
                          maxWidth: 150,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">All geofences</MenuItem>

                  {geofencesNames.map((geofence, index) => (
                    <MenuItem key={index} value={geofence}>
                      {geofence}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </>
        )}

        {/* GoogleMaps */}
        {individualMap ? (
          <IndividualGooglemap
            latitude={latitude}
            longitude={longitude}
            setIndividualMap={setIndividualMap}
            style={{ width: "100%" }}
            data={data}
            individualDataObj={individualDataObj}
          />
        ) : (
          <div
            className="gogo"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <GoogleMapComponent
              latitude={latitude}
              longitude={longitude}
              data={filteringData}
            />
          </div>
        )}

        {/* <br /> */}
      </div>

      {individualMap ? (
        <></>
      ) : (
        <>
          <Cards
            vehicleRunningCount={vehicleRunningCount}
            vehicleStoppedCount={vehicleStoppedCount}
            vehicleOverspeedCount={vehicleOverspeedCount}
            vehicleIdleCount={vehicleIdleCount}
            vehicleUnreachableCount={vehicleUnreachableCount}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
          {/* Horizontal line added here */}
        </>
      )}

      {/* <br /> */}

      {individualMap ? <></> : <hr />}
      <div>
        {individualMap ? (
          <></>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Align search and buttons with space between them
              padding: "0 3.5rem", // Adjust as per your layout
              marginBottom: "10px",
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                width: "250px", // Adjust width as needed
                "& .MuiInputBase-root": { height: 40 },
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    style={{
                      cursor: "pointer",
                      marginLeft: "8px", // Adjusted margin for better alignment
                    }}
                  />
                ),
              }}
            />

            {/* Wrapping both buttons in a div */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Button
                variant="contained"
                onClick={() => setModalOpen(true)}
                sx={{
                  color: "black",
                  backgroundColor: "#f4d24a",
                  height: "30px", // Match button height with input field
                  "&:hover": {
                    backgroundColor: "#f8ebb5",
                  },
                }}
              >
                Manage Columns
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<ImportExportIcon />}
                onClick={handleExport}
                sx={{
                  color: "black",
                  height: "30px",
                  backgroundColor: "#f4d24a",
                  "&:hover": {
                    backgroundColor: "#1a242f",
                  },
                }}
                // style={{
                //   marginTop: "20px",
                //   marginBottom: "20px",
                // }}
              >
                Export
              </Button>
            </div>
          </div>
        )}

        {/* {individualMap ? <></> : <hr />} */}

        {/* GoogleMaps */}
        {individualMap ? (
          <></>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="paper">
              <CTable
                className="my-3 border vehiclesTable mt-0"
                hover
                responsive
                style={{
                  maxHeight: "500px", // Set the desired height for the body
                  overflowY: "auto", // Enable vertical scrolling
                  display: "block", // Allow scrolling for the body
                }}
              >
                <CTableHead
                  //  stickyHeader
                  // aria-label="sticky table"
                  className="text-nowrap "
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <CTableRow>
                    {visibleColumns.srNo && (
                      <CTableHeaderCell
                        className="text-center sr-no table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                      >
                        Sr No.
                      </CTableHeaderCell>
                    )}
                    {visibleColumns.vehicle && (
                      <CTableHeaderCell
                        className="text-center vehicle table-cell headCell"
                        style={{ position: "sticky", top: 0 }}
                      >
                        Vehicle
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.deviceName && (
                      <CTableHeaderCell
                        className="text-center device-name table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort("deviceName")}
                      >
                        Device Name
                        {sortBy === "deviceName" &&
                          (sortOrder === "asc" ? " ↑" : " ↓")}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.address && (
                      <CTableHeaderCell
                        className="text-center address table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                          width: "25%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() => handleSort('address')}
                      >
                        Address
                        {sortBy === 'address' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.driver && (
                      <CTableHeaderCell
                        className="text-center address table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                          width: "25%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() => handleSort('driver')}
                      >
                        Driver
                        {sortBy === 'driver' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.lastUpdate && (
                      <CTableHeaderCell
                        className="text-center last-update table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                          width: "25%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() => handleSort('lastUpdate')}
                      >
                        Last Update
                        {sortBy === 'lastUpdate' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.speed && (
                      <CTableHeaderCell
                        className="text-center speed table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort('speed')}
                      >
                        Sp
                        {sortBy === 'speed' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.distance && (
                      <CTableHeaderCell
                        className="text-center distance table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort('distance')}
                      >
                        Distance
                        {sortBy === 'distance' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.satellite && (
                      <CTableHeaderCell
                        className="text-center satellite table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort('satellite')}
                      >
                        Sat
                        {sortBy === 'satellite' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.ignition && (
                      <CTableHeaderCell
                        className="text-center ignition table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort('ignition')}
                      >
                        Ig
                        {sortBy === 'ignition' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.gps && (
                      <CTableHeaderCell
                        className="text-center gps table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort('gps')}
                      >
                        GPS
                        {sortBy === 'gps' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.power && (
                      <CTableHeaderCell
                        className="text-center power table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                        }}
                        onClick={() => handleSort('power')}
                      >
                        Power
                        {sortBy === 'power' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}

                    {visibleColumns.track && (
                      <CTableHeaderCell
                        className="text-center status table-cell headCell"
                        style={{
                          position: "sticky",
                          top: 0,
                          width: "15%",
                        }}
                        onClick={() => handleSort('track')}
                      >
                        Track
                        {sortBy === 'track' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {sortedRows.map((item, index) => (
                    <CTableRow
                      key={index}
                      className={`table-row collapsed trans`}
                      onDoubleClick={() => handleRowDoubleClick(item)}
                    >
                      {/* Sr No. */}
                      {visibleColumns.srNo && (
                        <CTableDataCell className="text-center sr-no table-cell">
                          {index + 1}
                        </CTableDataCell>
                      )}

                      {visibleColumns.vehicle && (
                        <CTableDataCell className="text-center vehicle table-cell">
                          <div>
                            <img
                              src={busY}
                              className="dashimg upperdata"
                              alt="vehicle"
                            />
                          </div>
                        </CTableDataCell>
                      )}

                      {visibleColumns.deviceName && (
                        <CTableDataCell className="device-name table-cell n text-center">
                          {(() => {
                            // const device = salesman.find((device) => device.id === item.deviceId)
                            if (item && item.name) {
                              const nameParts = item.name.split(" ");
                              const firstWord = nameParts[0];
                              const remainingWords = nameParts
                                .slice(1)
                                .join(" "); // Join remaining words

                              return (
                                <>
                                  <div className="upperdata">
                                    <div>{firstWord}</div>{" "}
                                    {/* First word on the first line */}
                                    {remainingWords && (
                                      <div>{remainingWords}</div>
                                    )}{" "}
                                    {/* Remaining words on the second line if present */}
                                  </div>
                                </>
                              );
                            }
                            return <div className="upperdata">Unknown</div>;
                          })()}
                        </CTableDataCell>
                      )}

                      {visibleColumns.address && (
                        <CTableDataCell
                          className="text-center address table-cell"
                          style={{ width: "18rem" }}
                        >
                          <div
                            className="upperdata"
                            style={{
                              fontSize: "0.7rem",
                              wordWrap: "break-word", // Ensures long words break to fit within the container
                              overflowWrap: "break-word", // Provides compatibility for older browsers
                              whiteSpace: "normal", // Allows text wrapping instead of keeping it on a single line
                            }}
                          >
                            {newAddress[item.deviceId] || "Loading..."}
                          </div>
                        </CTableDataCell>
                      )}

                      {visibleColumns.driver && (
                        <CTableDataCell
                          className="text-center address table-cell"
                          style={{ width: "20rem" }}
                        >
                          <div
                            className="upperdata"
                            style={{ fontSize: "1rem" }}
                          >
                            {(() => {
                              // Find the driver based on the matching deviceId from item
                              const driver = drivers.find(
                                (driver) => driver.deviceId == item.deviceId
                              );

                              // Return driver name or "N/A" if not found
                              return driver ? driver.driverName : "N/A";
                            })()}
                          </div>
                        </CTableDataCell>
                      )}
                      {/* {visibleColumns.lastUpdate && ( */}
                      {visibleColumns.lastUpdate && (
                        <CTableDataCell className="text-center last-update table-cell">
                          {(() => {
                            // const device = salesman.find((device) => device.id === item.deviceId)
                            if (item && item.lastUpdate) {
                              const date = dayjs(item.lastUpdate).format(
                                "YYYY-MM-DD"
                              ); // Format date
                              const time = dayjs(item.lastUpdate).format(
                                "HH:mm:ss"
                              ); // Format time
                              return (
                                <div className="upperdata ld">
                                  <div>{date}</div> {/* Date on one line */}
                                  <div>{time}</div>{" "}
                                  {/* Time on the next line */}
                                </div>
                              );
                            }
                            return <div>N/A</div>;
                          })()}
                        </CTableDataCell>
                      )}

                      {visibleColumns.speed && (
                        <CTableDataCell className="text-center sp speed table-cell">
                          <div className="upperdata">{`${Math.round(
                            item.speed
                          )} kmph`}</div>
                        </CTableDataCell>
                      )}
                      {/* )} */}
                      {/* {visibleColumns.distance && ( */}
                      {visibleColumns.distance && (
                        <CTableDataCell className="text-center d distance table-cell">
                          {`${Math.round(item.attributes.distance)} km`}
                        </CTableDataCell>
                      )}

                      {visibleColumns.satellite && (
                        <CTableDataCell className="text-center satelite table-cell">
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <MdGpsNotFixed style={{ fontSize: "1.6rem" }} />{" "}
                            {/* Adjust icon size as needed */}
                            <span
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "49%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "0.8rem", // Adjust text size
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {item.attributes.sat}
                            </span>
                          </div>
                        </CTableDataCell>
                      )}
                      {/* // )} */}
                      {visibleColumns.ignition && (
                        <CTableDataCell className="text-center ignition table-cell">
                          {(() => {
                            const { ignition } = item.attributes;

                            let iconColor = "gray"; // Default color
                            let iconText = "N/A"; // Default text

                            if (ignition) {
                              iconColor = "green";
                              iconText = "On";
                            } else if (ignition === false) {
                              iconColor = "red";
                              iconText = "Off";
                            }

                            return (
                              <div
                                style={{ color: iconColor, fontSize: "1.1rem" }}
                              >
                                <PiEngineFill />
                              </div>
                            );
                          })()}
                        </CTableDataCell>
                      )}
                      {/* {visibleColumns.gps && ( */}
                      {visibleColumns.gps && (
                        <CTableDataCell className="text-center gps table-cell">
                          {(() => {
                            const { valid } = item;

                            let iconColor = "gray"; // Default color
                            let iconText = "N/A"; // Default text

                            if (valid) {
                              iconColor = "green";
                              iconText = "On";
                            } else if (valid === false) {
                              iconColor = "red";
                              iconText = "Off";
                            }

                            return (
                              <div
                                style={{ color: iconColor, fontSize: "1.1rem" }}
                              >
                                <MdGpsFixed />
                              </div>
                            );
                          })()}
                        </CTableDataCell>
                      )}
                      {/* )} */}
                      {/* {visibleColumns.power && ( */}
                      {visibleColumns.power && (
                        <CTableDataCell className="text-center power table-cell">
                          {(() => {
                            const power = item.attributes.battery;

                            let iconColor = "gray"; // Default color
                            let iconText = "N/A"; // Default text

                            if (power) {
                              iconColor = "green";
                              iconText = "On";
                            } else if (power === false) {
                              iconColor = "red";
                              iconText = "Off";
                            }

                            return (
                              <div
                                style={{ color: iconColor, fontSize: "1.2rem" }}
                              >
                                <IoMdBatteryCharging />
                              </div>
                            );
                          })()}
                        </CTableDataCell>
                      )}
                      {/* )} */}
                      {visibleColumns.track && (
                        <CTableDataCell className="text-center status table-cell">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleClickOnTrack(item)}
                          >
                            Live Track
                          </button>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
            <StyledTablePagination>
              <TablePagination
                rowsPerPageOptions={[
                  { label: "All", value: -1 },
                  10,
                  25,
                  100,
                  1000,
                ]}
                component="div"
                count={sortedData.length}
                rowsPerPage={
                  rowsPerPage == sortedData.length ? -1 : rowsPerPage
                }
                page={page}
                onPageChange={(event, newPage) => {
                  console.log("Page changed:", newPage);
                  handleChangePage(event, newPage);
                }}
                onRowsPerPageChange={(event) => {
                  console.log("Rows per page changed:", event.target.value);
                  handleChangeRowsPerPage(event);
                }}
              />
            </StyledTablePagination>
          </div>
        )}

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500, // Increased width for better spacing
              height: 400, // Defined height
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6">Column Visibility</Typography>
              <IconButton onClick={() => setModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content Section with Two-Part Layout */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Two equal columns
                gap: 2, // Space between columns
                overflowY: "auto", // Scrollable if content overflows
              }}
            >
              {Object.keys(visibleColumns).map((column, index) => (
                <Box
                  key={column}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderRadius: 1,
                    backgroundColor: "grey.100",
                  }}
                >
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {column}
                  </Typography>
                  <Switch
                    checked={visibleColumns[column]}
                    onChange={() => toggleColumnVisibility(column)}
                    color="primary"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Modal>

        <Modal
          open={assetDetailsModalOpen}
          onClose={() => setAssetDetailsModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper>
                  <h3>Asset Details</h3>
                  <br />
                  <p>Asset Name</p>
                  <p>Device Id</p>
                  <p>Device Description</p>
                  <p>Device Status</p>
                  <p>SIM Number or SAT</p>
                  <p>Driver Name</p>
                  <p>Driver Mobile No</p>
                  <p>Battery Size</p>
                  <p>KM Reading</p>
                  <p>Max Speed Limit</p>
                  <p>Provider 3G or SAT</p>
                  <p>Engine Runtime</p>
                  <p>Sensor Type</p>
                  <p>Message Cause</p>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Current Location</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Distance Travel(Today)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Max Speed</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Distance Graph(Last 7 Days)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Speed Graph(Last 3 hours)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Landmark Report(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Distance Location(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>All Points(Last 20 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Stop Report(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Area In/Out Report(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    </>
  );
};
