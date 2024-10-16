
//oct08
import React, { useState, useEffect, useContext, Component } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { COLUMNS } from "./columns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { TotalResponsesContext } from "../../../../TotalResponsesContext";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
// import excelfilestudentdetail from "../../../../../public/studentDetail.xlsx";
import {
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { jwtDecode } from "jwt-decode";
//import { TextField } from '@mui/material';
import { Autocomplete } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Enable vertical scrolling
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
};

export const StudentDetail = () => {
  const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const role = localStorage.getItem("role");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS().map((col) => [col.accessor, true]))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importData, setImportData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalRows, setOriginalRows] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [otherDropdownOptions, setOtherDropdownOptions] = useState([]);
  const [otherSelectedValue, setOtherSelectedValue] = useState("");

  const [schools, setSchools] = useState();
  const [branches, setBranches] = useState();
  const [buses, setBuses] = useState();

  // const [dropdownOptions1, setDropdownOptions1] = useState([]);
  // const [selectedValue1, setSelectedValue1] = useState("");
  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
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
            : role == 2
            ? response?.data.branches.flatMap((branch) =>
                Array.isArray(branch.children) && branch.children.length > 0
                  ? branch.children
                  : []
              )
            : response?.data.data;

        console.log(allData);

        const filteredData =
          startDate || endDate
            ? allData.filter((row) => {
                const registrationDate = parseDate(
                  row.formattedRegistrationDate
                );
                const start = parseDate(startDate);
                const end = parseDate(endDate);

                return (
                  (!startDate || registrationDate >= start) &&
                  (!endDate || registrationDate <= end)
                );
              })
            : allData; // If no date range, use all data
        const reversedData = filteredData.reverse();
        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`);
        console.log(filteredData);
        setFilteredRows(
          reversedData.map((row) => ({ ...row, isSelected: false }))
        );
        setOriginalRows(allData.map((row) => ({ ...row, isSelected: false })));
        setTotalResponses(reversedData.length);
        // Log the date range and filtered data
        console.log(`Data fetched between ${startDate} and ${endDate}:`);
        console.log(filteredData);

      
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Months are 0-indexed
  };

  const handleApplyDateRange = () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // If either date is empty, fetch all data
    if (!startDate && !endDate) {
      fetchData(); // Fetch all data
    } else {
      // Convert to desired format if values are not empty
      const formattedStartDate = startDate ? formatDate(startDate) : "";
      const formattedEndDate = endDate ? formatDate(endDate) : "";

      fetchData(formattedStartDate, formattedEndDate);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

  useEffect(() => {
    fetchData(); // Fetch data when startDate or endDate changes
  }, [startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
  };

  const filterData = (text) => {
    let dataToFilter = originalRows;

    if (startDate && endDate) {
      dataToFilter = dataToFilter.filter((row) => {
        const rowDate = new Date(row.dateOfBirth); // Replace `row.date` with the actual date field
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
      });
    }

    if (text === "") {
      setFilteredRows(dataToFilter); // Reset to filtered data
    } else {
      const filteredData = dataToFilter
        .filter((row) =>
          Object.values(row).some(
            (val) =>
              typeof val === "string" &&
              val.toLowerCase().includes(text.toLowerCase())
          )
        )
        .map((row) => ({ ...row, isSelected: false }));
      setFilteredRows(filteredData);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleColumnVisibilityChange = (accessor) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [accessor]: !prevState[accessor],
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

  const handleEditButtonClick = () => {
    const selected = filteredRows.find((row) => row.isSelected);
    if (selected) {
      setSelectedRow(selected);
      setFormData(selected);
      setEditModalOpen(true);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleDeleteSelected = async () => {
    // Log filteredRows to check its structure
    console.log("Filtered rows:", filteredRows);

    // Get selected row IDs
    const selectedIds = filteredRows
      .filter((row) => row.isSelected)
      .map((row) => {
        // Log each row to check its structure
        console.log("Processing row:", row);
        return row.childId; // Ensure id exists and is not undefined
      });

    console.log("Selected IDs:", selectedIds);

    if (selectedIds.length === 0) {
      alert("No rows selected for deletion.");
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} record(s)?`
    );

    if (!userConfirmed) {
      // If the user clicks "Cancel", exit the function
      return;
    }
    try {
      // Define the API endpoint and token

      const apiUrl =
        role == 1
          ? `${process.env.REACT_APP_SUPER_ADMIN_API}/delete/child`
          : role == 2
          ? `${process.env.REACT_APP_SCHOOL_API}/delete/child`
          : `${process.env.REACT_APP_BRANCH_API}/delete/child`;

      const token = localStorage.getItem("token");
      // Send delete requests for each selected ID
      const deleteRequests = selectedIds.map((id) =>
        fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error deleting record with ID ${id}: ${response.statusText}`
            );
          }
          return response.json();
        })
      );

      // Wait for all delete requests to complete
      await Promise.all(deleteRequests);

      // Filter out deleted rows
      const newFilteredRows = filteredRows.filter((row) => !row.isSelected);

      // Update state
      setFilteredRows(newFilteredRows);
      setSelectAll(false);

      alert("Selected records deleted successfully.");
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Failed to delete selected records.");
    }
    fetchData();
  };

  const handleExport = () => {
    const dataToExport = filteredRows.map((row) => {
      const { isSelected, ...rowData } = row;
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "StudentDetail.xlsx");
  };

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = new Uint8Array(e.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetNames = workbook.SheetNames;
  //       const sheet = workbook.Sheets[sheetNames[0]];
  //       const parsedData = XLSX.utils.sheet_to_json(sheet);
  //       setImportData(parsedData);
  //       console.log("uploadedfile",parsedData);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  //   alert("file imported successfully");
  // };



const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetNames = workbook.SheetNames;
      const sheet = workbook.Sheets[sheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Log the parsed data for verification
      console.log("Uploaded file data:", parsedData);

      // Now make the POST request with parsedData
      axios.post('http://63.142.251.13:4000/parent/import', parsedData)
        .then(response => {
          console.log('Data successfully posted:', response.data);
          alert('File imported and data posted successfully!');
        })
        .catch(error => {
          console.error('Error posting data:', error);
          alert('Error posting data. Please fill data in valid form as shown in sample excel sheet.');
        });
    };
    reader.readAsArrayBuffer(file);

  }
 
  fetchData();
   setImportModalOpen(false);
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

  const handleAddButtonClick = () => {
    setFormData({});
    setAddModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setImportModalOpen(false);
    setFormData({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditSubmit = async () => {
    // Define the API URL and authentication token
    const token = localStorage.getItem("token");
    const apiUrl =
      role == 1
        ? `${process.env.REACT_APP_SUPER_ADMIN_API}/update-child`
        : role == 2 ? `${process.env.REACT_APP_SCHOOL_API}/update-child` : `${process.env.REACT_APP_BRANCH_API}/update-child`

    // Prepare the updated data
    const updatedData = {
      ...formData,
      isSelected: false,
    };

    try {
      // Perform the PUT request
      const response = await fetch(`${apiUrl}/${updatedData.childId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Optionally: Process the response data if needed
      const result = await response.json();
      console.log("Update successful:", result);
      alert("Updated successfully");

      // Update local state after successful API call
      const updatedRows = filteredRows.map((row) =>
        row._id === selectedRow._id // Make sure to use the correct ID property
          ? { ...row, ...formData, isSelected: false }
          : row
      );
      setFilteredRows(updatedRows);

      // Close the modal
      handleModalClose();

      // Fetch the latest data
      fetchData();
    } catch (error) {
      console.error("Error updating row:", error);
      alert(`Error updating row: ${error.message}`);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const decoded = jwtDecode(localStorage.getItem('token'));
      let newRow;

      if(role == 1){
        newRow = {
          ...formData,
          // id: filteredRows.length + 1,
          // isSelected: false,
        };
      }
      else if(role == 2){
        newRow = {
          ...formData,
          schoolName: decoded.schoolName,
          // id: filteredRows.length + 1,
          // isSelected: false,
        };
      }else{
        newRow = {
          ...formData,
          schoolName: decoded.schoolName,
          branchName: decoded.branchName,
        };
      }
      

      console.log(newRow);

      // POST request to the server
      const response = await fetch(

        `${process.env.REACT_APP_API}/parent/register`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRow),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("record created successfully");

      // Assuming the server returns the created object
      const result = await response.json();

      // Update the state with the new row
      setFilteredRows([...filteredRows, result]);

      // Close the modal
      handleModalClose();
      fetchData();
      console.log("error occured in post method");
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("unable to create record");
      // Handle the error appropriately (e.g., show a notification to the user)
    }
  };

 

  // useEffect(() => {
  //   const fetchGeofenceData = async () => {
  //     try {
  //       const username = "school"; // Replace with your actual username
  //       const password = "123456"; // Replace with your actual password
  //       const token = btoa(`${username}:${password}`); // Base64 encode the username and password

  //       const response = await axios.get(
  //         "http://104.251.216.99:8082/api/geofences",
  //         {
  //           headers: {
  //             Authorization: `Basic ${token}`,
  //           },
  //         }
  //       );

  //       const data = response.data;
  //       console.log("pickup points: ", response.data);
  //       // Transform data to create dropdown options
  //       const options = data.map((item) => ({
  //         value: item.name,
  //         label: item.name,
  //       }));

  //       setDropdownOptions(options);
  //     } catch (error) {
  //       console.error("Error fetching geofence data:", error);
  //     }
  //   };

  //   fetchGeofenceData();
  // }, []);

  // useEffect(() => {
  //   const fetchOtherData = async () => {
  //     try {
  //       const username = "school"; // Replace with your actual username
  //       const password = "123456"; // Replace with your actual password
  //       const token = btoa(`${username}:${password}`); // Base64 encode the username and password

  //       const response = await axios.get(
  //         "https://rocketsalestracker.com/api/devices", // Modify the endpoint if different
  //         {
  //           headers: {
  //             Authorization: `Basic ${token}`,
  //           },
  //         }
  //       );

  //       const data = response.data;
  //       console.log(response.data);

  //       // Transform data to create dropdown options
  //       const options = data.map((item) => ({
  //         value: item.id,
  //         label: item.name,
  //       }));

  //       setOtherDropdownOptions(options);
  //     } catch (error) {
  //       console.error("Error fetching other data:", error);
  //     }
  //   };

  //   fetchOtherData();
  // }, []);

 
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const decoded = jwtDecode(localStorage.getItem("token"));
  
  //   if (role == 2 && name == "branchName") {
  //     setFormData({
  //       ...formData,
  //       schoolName: decoded.schoolName, // Fetch schoolName from token
  //       [name]: value, // Update branch name
  //     });
  //     // Filter devices by the selected branch
  //     const filteredDevices = allDevices.filter(device => device.branchName == value);
  //     setBuses(filteredDevices); // Update buses based on selected branch
  //   } else if (name == "schoolName") {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //     const selectedSchoolData = schools.find(
  //       (school) => school.schoolName == value
  //     );
  
  //     if (selectedSchoolData) {
  //       const allBranches = [];
  //       if (selectedSchoolData.branchName) {
  //         allBranches.push({
  //           branchName: selectedSchoolData.branchName,
  //           branchId: selectedSchoolData._id,
  //         });
  //       }
  
  //       if (
  //         selectedSchoolData.branches &&
  //         selectedSchoolData.branches.length > 0
  //       ) {
  //         selectedSchoolData.branches.forEach((branch) => {
  //           allBranches.push({
  //             branchName: branch.branchName,
  //             branchId: branch._id,
  //           });
  //         });
  //       }
  
  //       setBranches(allBranches);
  //       // Filter devices by selected school
  //       const filteredDevices = allDevices.filter(device => device.schoolName == value);
  //       setBuses(filteredDevices); // Update buses based on selected school
  //     }
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };
  // const handleBusChange = (e) => {
  //   const { value } = e.target;
  //   const selectedBus = buses.find(bus => bus.deviceId === value);
  
  //   setFormData({
  //     ...formData,
  //     deviceId: selectedBus?.deviceId,
  //     deviceName: selectedBus?.deviceName,
  //   });
  // };
 

  // const handleBusChange = (e) => {
  //   const { value } = e.target;
  //   const selectedBus = buses.find(bus => bus.deviceId === value);
    
  //   // Update formData with selected bus information
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     deviceId: selectedBus?.deviceId,
  //     deviceName: selectedBus?.deviceName,
  //     pickupPoint: '', // Reset geofence selection
  //   }));
  
  //   // Construct the key for pickupPointsData
  //   const geofenceKey = `deviceId: ${selectedBus?.deviceId}`;
    
  //   // Get geofences for the selected device
  //   const geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];
    
  //   // Update filtered geofences state
  //   setFilteredGeofences(geofencesForSelectedDevice);
    
  //   // Debugging log
  //   console.log("Filtered Geofences:", geofencesForSelectedDevice);
  // };
  
  // const handleBusChange = (e) => {
  //   const { value } = e.target;
  //   const selectedBus = buses.find(bus => bus.deviceId === value);
  
  //   if (!selectedBus) {
  //     console.error("Selected bus not found");
  //     return;
  //   }
  
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     deviceId: selectedBus.deviceId,
  //     deviceName: selectedBus.deviceName,
  //     pickupPoint: '', // Reset geofence selection
  //   }));
  
  //   let geofencesForSelectedDevice = [];
  
  //   if (role == 1) {
  //     // Access geofences using deviceId as the key
  //     const geofenceKey = `deviceId: ${selectedBus.deviceId}`;
  //     geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];
  
  //     if (geofencesForSelectedDevice.length === 0) {
  //       console.error("No geofences found for this deviceId");
  //     }
  //   } else if (role == 2) {
  //     const selectedBranch = branches.find(branch =>
  //       branch.geofences && Array.isArray(branch.geofences) && branch.geofences.some(g => g.deviceId === selectedBus.deviceId)
  //     );
  
  //     if (selectedBranch) {
  //       geofencesForSelectedDevice = selectedBranch.geofences.filter(g => g.deviceId === selectedBus.deviceId);
  //     } else {
  //       console.error("No valid geofences found for the selected branch.");
  //     }
  //   } else if (role == 3) {
  //     const branchData = branches.find(branch => branch.branchId === selectedBus.branchId);
      
  //     if (branchData) {
  //       const deviceData = branchData.devices.find(device => device.deviceId === selectedBus.deviceId);
        
  //       if (deviceData) {
  //         geofencesForSelectedDevice = deviceData.geofences || [];
  //       } else {
  //         console.error("Device data not found for selected bus");
  //       }
  //     } else {
  //       console.error("Branch data not found for selected bus");
  //     }
  //   }
  
  //   setFilteredGeofences(geofencesForSelectedDevice);
  //   console.log("Filtered Geofences:", geofencesForSelectedDevice);
  // };
  // const handleBusChange = (e) => {
  //   const { value } = e.target;
    
  //   if (!buses || !Array.isArray(buses)) {
  //     console.error("Buses data is not available or not an array");
  //     return;
  //   }
    
  //   const selectedBus = buses.find(bus => bus.deviceId === value);
    
  //   if (!selectedBus) {
  //     console.error("Selected bus not found");
  //     return;
  //   }
    
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     deviceId: selectedBus.deviceId,
  //     deviceName: selectedBus.deviceName,
  //     pickupPoint: '', // Reset geofence selection
  //   }));
    
  //   let geofencesForSelectedDevice = [];
    
  //   if (role == 1) {
  //     const geofenceKey = `deviceId: ${selectedBus.deviceId}`;
  //     geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];
    
  //     if (geofencesForSelectedDevice.length === 0) {
  //       console.error("No geofences found for this deviceId");
  //     }
  //   }  else if (role == 2) {
  //     if (!branches || !Array.isArray(branches)) {
  //         console.error("Branches data is not available or not an array");
  //         return;
  //     }
  
  //     const selectedBranch = branches.find(branch => 
  //         branch.geofences && Array.isArray(branch.geofences) &&
  //         branch.geofences.some(g => g.deviceId === selectedBus.deviceId)
  //     );
      
  //     if (selectedBranch) {
  //         geofencesForSelectedDevice = selectedBranch.geofences.filter(g => g.deviceId === selectedBus.deviceId);
  //         if (geofencesForSelectedDevice.length === 0) {
  //             console.error("No geofences found for this deviceId in the selected branch.");
  //         }
  //     } else {
  //         console.error("No valid geofences found for the selected branch.");
  //     }
  // }else if (role === 3) {
  //   if (!branches || !Array.isArray(branches)) {
  //     console.error("Branches data is not available or not an array");
  //     return;
  //   }

  //   const branchData = branches.find(branch => branch.branchId === selectedBus.branchId);

  //   if (branchData) {
  //     const deviceData = branchData.devices.find(device => device.deviceId === selectedBus.deviceId);

  //     if (deviceData) {
  //       geofencesForSelectedDevice = deviceData.geofences || [];
  //     } else {
  //       console.error("Device data not found for selected bus");
  //     }
  //   }else {
  //       console.error("Branch data not found for selected bus");
  //     }
  //   }
    
  //   setFilteredGeofences(geofencesForSelectedDevice);
  //   console.log("Filtered Geofences:", geofencesForSelectedDevice);
  // };
  
//   const handleBusChange = (e) => {
//     const { value } = e.target;

//     if (!buses || !Array.isArray(buses)) {
//         console.error("Buses data is not available or not an array");
//         return;
//     }

//     const selectedBus = buses.find(bus => bus.deviceId === value);

//     if (!selectedBus) {
//         console.error("Selected bus not found");
//         return;
//     }

//     setFormData((prevData) => ({
//         ...prevData,
//         deviceId: selectedBus.deviceId,
//         deviceName: selectedBus.deviceName,
//         pickupPoint: '', // Reset geofence selection
//     }));

//     let geofencesForSelectedDevice = [];

//     if (role == 1) {
//         const geofenceKey = `deviceId: ${selectedBus.deviceId}`;
//         geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];

//         if (geofencesForSelectedDevice.length === 0) {
//             console.error("No geofences found for this deviceId");
//         }
//     } else if (role == 2) {
//         if (!branches || !Array.isArray(branches)) {
//             console.error("Branches data is not available or not an array");
//             return;
//         }

//         const selectedBranch = branches.find(branch =>
//             branch.geofences && Array.isArray(branch.geofences) &&
//             branch.geofences.some(g => g.deviceId === selectedBus.deviceId)
//         );

//         if (selectedBranch) {
//             geofencesForSelectedDevice = selectedBranch.geofences.filter(g => g.deviceId === selectedBus.deviceId);
//             if (geofencesForSelectedDevice.length === 0) {
//                 console.error("No geofences found for this deviceId in the selected branch.");
//             }
//         } else {
//             console.error("No valid geofences found for the selected branch.");
//         }
//     } else if (role === 3) {
//         if (!branches || !Array.isArray(branches)) {
//             console.error("Branches data is not available or not an array");
//             return;
//         }

//         const branchData = branches.find(branch => branch.branchId === selectedBus.branchId);

//         if (branchData) {
//             const deviceData = branchData.devices.find(device => device.deviceId === selectedBus.deviceId);

//             if (deviceData) {
//                 geofencesForSelectedDevice = deviceData.geofences || [];
//             } else {
//                 console.error("Device data not found for selected bus");
//             }
//         } else {
//             console.error("Branch data not found for selected bus");
//         }
//     }

//     setFilteredGeofences(geofencesForSelectedDevice);
//     console.log("Filtered Geofences:", geofencesForSelectedDevice);
// };
// const handleBusChange = (e) => {
//   const { value } = e.target;

//   if (!buses || !Array.isArray(buses)) {
//       console.error("Buses data is not available or not an array");
//       return;
//   }

//   const selectedBus = buses.find(bus => bus.deviceId === value);

//   if (!selectedBus) {
//       console.error("Selected bus not found");
//       return;
//   }

//   setFormData((prevData) => ({
//       ...prevData,
//       deviceId: selectedBus.deviceId,
//       deviceName: selectedBus.deviceName,
//       pickupPoint: '', // Reset geofence selection
//   }));

//   let geofencesForSelectedDevice = [];

//   if (role == 1) {
//       const geofenceKey = `deviceId: ${selectedBus.deviceId}`;
//       geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];

//       if (geofencesForSelectedDevice.length === 0) {
//           console.error("No geofences found for this deviceId");
//       }
//   } else if (role == 2) {
//       if (!branches || !Array.isArray(branches)) {
//           console.error("Branches data is not available or not an array");
//           return;
//       }

//       const selectedBranch = branches.find(branch =>
//           branch.geofences && Array.isArray(branch.geofences) &&
//           branch.geofences.some(g => g.deviceId === selectedBus.deviceId)
//       );

//       if (selectedBranch) {
//           geofencesForSelectedDevice = selectedBranch.geofences.filter(g => g.deviceId === selectedBus.deviceId);
//           if (geofencesForSelectedDevice.length === 0) {
//               console.error("No geofences found for this deviceId in the selected branch.");
//           }
//       } else {
//           console.error("No valid geofences found for the selected branch.");
//       }
//   } else if (role === 3) {
//       if (!branches || !Array.isArray(branches)) {
//           console.error("Branches data is not available or not an array");
//           return;
//       }

//       const branchData = branches.find(branch => branch.branchId === selectedBus.branchId);

//       if (branchData) {
//           const deviceData = branchData.devices.find(device => device.deviceId === selectedBus.deviceId);

//           if (deviceData) {
//               geofencesForSelectedDevice = deviceData.geofences || [];
//           } else {
//               console.error("Device data not found for selected bus");
//           }
//       } else {
//           console.error("Branch data not found for selected bus");
//       }
//   }

//   setFilteredGeofences(geofencesForSelectedDevice);
//   console.log("Filtered Geofences:", geofencesForSelectedDevice);
// };
const handleBusChange = (e) => {
  const { value } = e.target;

  if (!buses || !Array.isArray(buses)) {
      console.error("Buses data is not available or not an array");
      return;
  }

  // Find the selected bus by its deviceId
  const selectedBus = buses.find(bus => bus.deviceId === value);

  if (!selectedBus) {
      console.error("Selected bus not found");
      return;
  }

  // Update the form data with the selected device details
  setFormData((prevData) => ({
      ...prevData,
      deviceId: selectedBus.deviceId,
      deviceName: selectedBus.deviceName,
      pickupPoint: '', // Reset geofence selection
  }));

  let geofencesForSelectedDevice = [];

  if (role == 2) {
      // For role == 2, look up geofences in pickupPointsData by the selectedBus.deviceId
      geofencesForSelectedDevice = pickupPointsData[selectedBus.deviceId] || [];

      if (geofencesForSelectedDevice.length === 0) {
          console.error("No geofences found for this deviceId");
      }
  } else if (role == 1) {
      const geofenceKey = `deviceId: ${selectedBus.deviceId}`;
      geofencesForSelectedDevice = pickupPointsData[geofenceKey] || [];

      if (geofencesForSelectedDevice.length === 0) {
          console.error("No geofences found for this deviceId");
      }
  } else if (role == 3) {
    // Handling for role 3
    geofencesForSelectedDevice = pickupPointsData[selectedBus.deviceId] || [];

      if (geofencesForSelectedDevice.length === 0) {
          console.error("No geofences found for this deviceId");
      }
  }

  // Update the filtered geofences state
  setFilteredGeofences(geofencesForSelectedDevice);
  console.log("Filtered Geofences:", geofencesForSelectedDevice);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "schoolName") {
      setFormData({
        ...formData,
        [name]: value,
        branchName: "", // Reset branch when school changes
      });
      
      // Filter branches for the selected school
      const selectedSchool = schools.find(school => school.schoolName === value);
      if (selectedSchool) {
        const branches = selectedSchool.branches.map(branch => ({
          branchName: branch.branchName,
          branchId: branch.branchId,
        }));
        setBranches(branches);
  
        // Filter devices for the selected school
        const filteredDevices = allDevices.filter(device => device.schoolName === value);
        setBuses(filteredDevices); // Update buses based on selected school
      }
    } else if (name === "branchName") {
      setFormData({
        ...formData,
        [name]: value,
      });
  
      // Filter devices for the selected branch
      const filteredDevices = allDevices.filter(device => device.branchName === value);
      setBuses(filteredDevices); // Update buses based on selected branch
    } if (name === "deviceId") {
      setSelectedDeviceId(value); // Set the selected device ID
      setFormData({
        ...formData,
        [name]: value,
      });
  
      // Filter geofences based on the selected bus (deviceId)
      const selectedDeviceGeofences = pickupPointsData[value] || []; // Access geofences using the deviceId as the key
      setFilteredGeofences(selectedDeviceGeofences); // Update geofences in state
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
 
  
  

  const handleSelectChange = (event) => {
    setFormData({
      ...formData,
      [lastSecondColumn.accessor]: event.target.value,
    });
    setSelectedValue(event.target.value);
  };
  const handleOtherSelectChange = (event) => {
    setFormData({
      ...formData,
      [lastThirdColumn.accessor]: event.target.value,
    });
    setOtherSelectedValue(event.target.value);
  };

 
  const [allDevices, setAllDevices] = useState([]);
  const columns = COLUMNS();
  const lastSecondColumn = columns[columns.length - 2]; // Last second column
  const lastThirdColumn = columns[columns.length - 3];
  // const columns1 = COLUMNS();
  // const lastthirdColumn = columns1[columns1.length - 3];
  const [pickupPointsData, setPickupPointsData] = useState([]); // Use descriptive state name
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [filteredGeofences, setFilteredGeofences] = useState([]); 
  useEffect(() => {
    const fetchSchool = async (startDate = "", endDate = "") => {
      setLoading(true);
      if (role == 1) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.REACT_APP_SUPER_ADMIN_API}/getschools`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          console.log("School data fetched:", response.data);

          if (Array.isArray(response.data.schools)) {
            setSchools(response.data.schools);
          }
        } catch (error) {
          console.error("Error fetching schools:", error);
        } finally {
          setLoading(false);
        }
      } else if (role == 2) {
        // Fetch branches for role 2 (School Admin)
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.REACT_APP_SCHOOL_API}/branches`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Branch data fetched:", response.data);
          setBranches(response.data.school.branches);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      }
    };

    const fetchBuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          role == 1
            ? `${process.env.REACT_APP_SUPER_ADMIN_API}/read-devices`
            : role == 2
            ? `${process.env.REACT_APP_SCHOOL_API}/read-devices`
            : `${process.env.REACT_APP_BRANCH_API}/read-devices`;
    
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        let allData = [];
        if (role == 1) {
          allData = response?.data.data.flatMap((school) =>
            school.branches.flatMap((branch) =>
              Array.isArray(branch.devices) && branch.devices.length > 0
                ? branch.devices.map((device) => ({
                    ...device,
                    schoolName: school.schoolName,
                    branchName: branch.branchName,
                  }))
                : []
            )
          );
        } else if (role == 2) {
          allData = response?.data.branches.flatMap((branch) =>
            Array.isArray(branch.devices) && branch.devices.length > 0
              ? branch.devices.map((device) => ({
                  ...device,
                  branchName: branch.branchName,
                  schoolName: response.data.schoolName,
                }))
              : []
          );
        } else if (role == 3) {
          const branchName = response.data.branchName;
          const schoolName = response.data.schoolName;
    
          allData = Array.isArray(response.data.devices)
            ? response.data.devices.map((device) => ({
                ...device,
                branchName,
                schoolName,
              }))
            : [];
        }
    
        setAllDevices(allData); // Store all devices
        setBuses(allData); // Set initial buses as well
        console.log("filter devices according to branch",allData)
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };
   
    // const fetchGeofence = async (startDate = "", endDate = "") => {
    //   // setLoading(true);
    //   try {
    //     const token = localStorage.getItem("token");
    //     let response;
    
    //     // Fetch data based on role
    //     if (role == 1) {
    //       response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //     } else if (role == 2) {
    //       response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //     } else if (role == 3) {
    //       response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //     }
    
    //     if (response?.data) {
    //       let fetchedData = {};
    
    //       if (role == 1) {
    //         // Structure geofences by deviceId
    //         Object.entries(response.data).forEach(([deviceId, stops]) => {
    //           fetchedData[deviceId] = stops.map(stop => ({
    //             ...stop,
    //             deviceId, // Include deviceId in each stop
    //           }));
    //         });
    //       } else if (role == 2) {
    //         // For role 2, assuming response contains branches with geofences
    //         response.data?.branches.forEach(branch => {
    //           if (branch.geofences) {
    //             branch.geofences.forEach(geofence => {
    //               if (!fetchedData[branch.deviceId]) {
    //                 fetchedData[branch.deviceId] = [];
    //               }
    //               fetchedData[branch.deviceId].push({
    //                 ...geofence,
    //                 branchId: branch.branchId,
    //                 branchName: branch.branchName,
    //               });
    //             });
    //           }
    //         });
    //       } else if (role == 3) {
    //         // For role 3, handle geofences by device
    //         response.data.devices.forEach(device => {
    //           device.geofences.forEach(geofence => {
    //             if (!fetchedData[device.deviceId]) {
    //               fetchedData[device.deviceId] = [];
    //             }
    //             fetchedData[device.deviceId].push({
    //               ...geofence,
    //               deviceId: device.deviceId,
    //             });
    //           });
    //         });
    //       }
    
    //       console.log("role is:", role);
    //       console.log("geofences are:", fetchedData);
    //       // Update the state with fetched data
    //       setPickupPointsData(fetchedData);
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };
    
    const fetchGeofence = async (startDate = "", endDate = "") => {
      // setLoading(true);
      try {
          const token = localStorage.getItem("token");
          let response;
  
          // Fetch data based on role
          if (role == 1) {
              response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/geofences`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          } else if (role == 2) {
              response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/geofences`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          } else if (role == 3) {
              response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/geofences`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
          }
  
          if (response?.data) {
              let fetchedData = {};
  
              if (role == 1) {
                  // Structure geofences by deviceId
                  Object.entries(response.data).forEach(([deviceId, stops]) => {
                      fetchedData[deviceId] = stops.map(stop => ({
                          ...stop,
                          deviceId, // Include deviceId in each stop
                      }));
                  });
              } else if (role == 2) {
                  // For role 2, assuming response contains branches with geofences
                  response.data?.branches.forEach(branch => {
                      if (branch.geofences) {
                          branch.geofences.forEach(geofence => {
                              if (!fetchedData[geofence.deviceId]) { // Use geofence.deviceId
                                  fetchedData[geofence.deviceId] = [];
                              }
                              fetchedData[geofence.deviceId].push({
                                  ...geofence,
                                  branchId: branch.branchId,
                                  branchName: branch.branchName,
                              });
                          });
                      }
                  });
              } else if (role == 3) {
                  // For role 3, handle geofences by device
                  response.data.devices.forEach(device => {
                      device.geofences.forEach(geofence => {
                          if (!fetchedData[device.deviceId]) {
                              fetchedData[device.deviceId] = [];
                          }
                          fetchedData[device.deviceId].push({
                              ...geofence,
                              deviceId: device.deviceId,
                          });
                      });
                  });
              }
  
              console.log("role is:", role);
              console.log("geofences are:", fetchedData);
              // Update the state with fetched data
              setPickupPointsData(fetchedData);
          }
      } catch (error) {
          console.error("Error:", error);
      }
  };
    
    fetchBuses();
    fetchSchool();
    fetchGeofence();
  }, [role]);
  const sampleData = [
    ["Student Name", "Class", "Roll No.", "Section","School Name","Branch Name","DOB","Child Age","Parent Name","User Name","Phone Numnber","Password"],
    ["John Doe", "10", "16", "A","Study Point","Branch1","13-03-2009","12","Vicky Doe","Vicky Doe","8989898989","5678"],
    ["Jane Doe", "10", "16", "A","Udemy","Branch6","11-03-2008","13","Vicky Doe","username","8989898989","5678"],
  ];
  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "studentDetail.xlsx";  // Adjust the path here
    link.download = "StudentDetail.xlsx";  // Specify the download filename
    link.click();
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
        Student Detail{" "}
      </h1>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            sx={{ marginRight: "10px", width: "300px" }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    marginRight: "5px",
                  }}
                />
              ),
            }}
          />
          <Button
            onClick={() => setModalOpen(true)}
            sx={{
              backgroundColor: "rgb(85, 85, 85)",
              color: "white",
              fontWeight: "bold",
              marginRight: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ImportExportIcon />
            Column Visibility
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            sx={{ marginRight: "10px" }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditButtonClick}
            sx={{ marginRight: "10px" }}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddButtonClick}
            sx={{ marginRight: "10px" }}
            startIcon={<AddCircleIcon />}
          >
            Add
          </Button>
          <Button
            variant="contained"
            onClick={() => setImportModalOpen(true)}
            sx={{ backgroundColor: "rgb(255, 165, 0)", marginRight: "10px" }}
            startIcon={<CloudUploadIcon />}
          >
            Import
          </Button>
          <Button variant="contained" color="primary" onClick={handleExport}>
            Export
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="date"
            id="startDate"
            placeholder="DD-MM-YYYY"
            style={{
              width: "140px",
              marginRight: "10px",
              padding: "2px",
              marginLeft: "3px",
              border: " 0.1px solid black",
              borderRadius: "3px",
            }}
          />
          <input
            type="date"
            id="endDate"
            placeholder="DD-MM-YYYY"
            style={{
              width: "140px",
              marginRight: "10px",
              padding: "2px",
              marginLeft: "3px",
              border: " 0.1px solid black",
              borderRadius: "3px",
            }}
          />
          <button
            onClick={handleApplyDateRange}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Apply Date Range
          </button>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 440,
                border: "1.5px solid black",
                borderRadius: "7px",
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
                style={{ border: "1px solid black" }}
              >
                <TableHead>
                  <TableRow
                    style={{
                      borderBottom: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                  >
                    <TableCell
                      padding="checkbox"
                      style={{
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                      }}
                    >
                      <Switch
                        checked={selectAll}
                        onChange={handleSelectAll}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        minWidth: 70, // Adjust width if needed
                        borderRight: "1px solid #e0e0e0",
                        borderBottom: "2px solid black",
                        padding: "4px 4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      S.No.
                    </TableCell>
                    {COLUMNS()
                      .filter((col) => columnVisibility[col.accessor])
                      .map((column) => (
                        <TableCell
                          key={column.accessor}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            cursor: "pointer",
                            borderRight: "1px solid #e0e0e0",
                            borderBottom: "2px solid black",
                            padding: "4px 4px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                          onClick={() => requestSort(column.accessor)}
                        >
                          {column.Header}
                          {sortConfig.key === column.accessor ? (
                            sortConfig.direction === "ascending" ? (
                              <ArrowUpwardIcon fontSize="small" />
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )
                          ) : null}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          COLUMNS().filter(
                            (col) => columnVisibility[col.accessor]
                          ).length
                        }
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          fontSize: "16px",
                          color: "#757575",
                          // fontStyle: 'italic',
                        }}
                      >
                        {/* <img src="emptyicon.png" alt="" /> */}
                        <h4>No Data Available</h4>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                          onClick={() =>
                            handleRowSelect(page * rowsPerPage + index)
                          }
                          selected={row.isSelected}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                            borderBottom: "none", // White for even rows, light grey for odd rows
                          }}
                        >
                          <TableCell
                            padding="checkbox"
                            style={{ borderRight: "1px solid #e0e0e0" }}
                          >
                            <Switch checked={row.isSelected} color="primary" />
                          </TableCell>
                          <TableCell
                            style={{
                              minWidth: 70, // Adjust width if needed
                              borderRight: "1px solid #e0e0e0",
                              paddingTop: "4px",
                              paddingBottom: "4px",
                              borderBottom: "none",
                              textAlign: "center",
                              fontSize: "smaller",
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                              // borderBottom: "none",
                            }}
                          >
                            {page * rowsPerPage + index + 1}{" "}
                            {/* Serial number starts from 1 */}
                          </TableCell>
                          {COLUMNS()
                            .filter((col) => columnVisibility[col.accessor])
                            .map((column) => {
                              const value = row[column.accessor];
                              return (
                                <TableCell
                                  key={column.accessor}
                                  align={column.align}
                                  style={{
                                    borderRight: "1px solid #e0e0e0",
                                    paddingTop: "4px",
                                    paddingBottom: "4px",
                                    borderBottom: "none",
                                    backgroundColor:
                                      index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                                    fontSize: "smaller", // White for even rows, light grey for odd rows
                                  }}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* //</></div> */}
          </>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={style}>
            <h2>Column Visibility</h2>
            {COLUMNS().map((col) => (
              <div key={col.accessor}>
                <Switch
                  checked={columnVisibility[col.accessor]}
                  onChange={() => handleColumnVisibilityChange(col.accessor)}
                  color="primary"
                />
                {col.Header}
              </div>
            ))}
          </Box>
        </Modal>
        <Modal open={editModalOpen} onClose={handleModalClose}>
          {/* <Box sx={style}>
           
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Edit Student Details</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS()
              .slice(0, -3)
              .map((col) => (
                <TextField
                  key={col.accessor}
                  label={col.Header}
                  variant="outlined"
                  name={col.accessor}
                  value={formData[col.accessor] || ""}
                  onChange={handleInputChange}
                  sx={{ marginBottom: "10px" }}
                  fullWidth
                />
              ))}
           
            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <InputLabel>{lastThirdColumn.Header}</InputLabel>

              <Select
                value={formData[lastThirdColumn.accessor] || ""}
                onChange={handleOtherSelectChange}
                name={lastThirdColumn.accessor}
                label={lastThirdColumn.Header}
              >
                {otherDropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ marginBottom: "10px" }}
              fullWidth
            >
              <InputLabel>{lastSecondColumn.Header}</InputLabel>

              <Select
                value={formData[lastSecondColumn.accessor] || ""}
                onChange={handleSelectChange}
                name={lastSecondColumn.accessor}
                label={lastSecondColumn.Header}
              >
                {dropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
           
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSubmit}
            >
              Submit
            </Button>
          </Box> */}
           <Box sx={style}>
            {/* <h2>Add Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Add student</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              key={"childName"}
              label={"Student Name"}
              variant="outlined"
              name="childName"
              value={formData["childName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Date of Birth
              </FormLabel>

              <TextField
                key={"childAge"}
                type="date"
                placeholder="Date of Birth"
                variant="outlined"
                name="dateOfBirth"
                value={formData["dateOfBirth"] || ""}
                onChange={handleInputChange}
                sx={{ marginBottom: "10px", width: "200px" }}
                fullWidth
              />
            </FormControl>

            <TextField
              key={"childAge"}
              label={"Student Age"}
              variant="outlined"
              name="childAge"
              value={formData["childAge"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />

            {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="class"
                value={formData["class"] || ""}
                label="Class"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl> */}
<FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <Autocomplete
    id="searchable-select"
    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}  // Array of values to choose from
    getOptionLabel={(option) => option.toString()}  // Convert numeric values to string for display
    value={formData["class"] || null}
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "class", value: newValue },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Class"
        variant="outlined"
        name="class"
      />
    )}
  />
</FormControl>
            <TextField
              key={"roleno"}
              label={"Roll No"}
              variant="outlined"
              name="rollno"
              value={formData["rollno"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"section"}
              label={"Section"}
              variant="outlined"
              name="section"
              value={formData["section"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            {role == 1 ? (
              <>
                {/* <FormControl
                  variant="outlined"
                  sx={{ marginBottom: "10px" }}
                  fullWidth
                >
                  <InputLabel>{"School Name"}</InputLabel>

                  <Select
                    value={formData["schoolName"] || ""}
                    onChange={handleInputChange}
                    name="schoolName"
                    label={"School Name"}
                  >
                    {schools?.map((option) => (
                      <MenuItem key={option._id} value={option.schoolName}>
                        {option.schoolName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-school-select"
    options={schools || []} // Ensure schools is an array
    getOptionLabel={(option) => option.schoolName || ""} // Display school name
    value={Array.isArray(schools) ? schools.find(school => school.schoolName === formData["schoolName"]) : null} // Safely find the selected school
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "schoolName", value: newValue?.schoolName || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="School Name"
        variant="outlined"
        name="schoolName"
      />
    )}
  />
</FormControl>
                {/* <FormControl
                  variant="outlined"
                  sx={{ marginBottom: "10px" }}
                  fullWidth
                >
                  <InputLabel>{"Branch Name"}</InputLabel>

                  <Select
                    value={formData["branchName"] || ""}
                    onChange={handleInputChange}
                    name="branchName"
                    label={"Branch Name"}
                  >
                    {branches?.map((option) => (
                      <MenuItem key={option.branchId} value={option.branchName}>
                        {option.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                 <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-branch-select"
    options={Array.isArray(branches) ? branches : []} // Ensure branches is an array
    getOptionLabel={(option) => option.branchName || ""} // Display branch name
    value={Array.isArray(branches) ? branches.find(branch => branch.branchName === formData["branchName"]) : null} // Safely find the selected branch
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "branchName", value: newValue?.branchName || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Branch Name"
        variant="outlined"
        name="branchName"
      />
    )}
  />
</FormControl>
              </>
            ) : role == 2 ? (
              // <FormControl
              //   variant="outlined"
              //   sx={{ marginBottom: "10px" }}
              //   fullWidth
              // >
              //   <InputLabel>{"Branch Name"}</InputLabel>

              //   <Select
              //     value={formData["branchName"] || ""}
              //     onChange={handleInputChange}
              //     name="branchName"
              //     label={"Branch Name"}
              //   >
              //     {branches?.map((option) => (
              //       <MenuItem key={option.branchId} value={option.branchName}>
              //         {option.branchName}
              //       </MenuItem>
              //     ))}
              //   </Select>
              // </FormControl>
              <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
              <Autocomplete
                id="searchable-branch-select"
                options={branches || []} // List of branch objects
                getOptionLabel={(option) => option.branchName || ""} // Display branch name
                value={branches.find(branch => branch.branchName === formData["branchName"]) || null} // Find the selected branch
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: { name: "branchName", value: newValue?.branchName || "" },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch Name"
                    variant="outlined"
                    name="branchName"
                  />
                )}
              />
            </FormControl>
            ) : null}
            {/* <FormControl
  variant="outlined"
  sx={{ marginBottom: "10px" }}
  fullWidth
>
  <InputLabel>{"Bus Name"}</InputLabel>
  
  <Select
    value={formData["deviceId"] || ""}  // Select based on deviceId
    onChange={handleBusChange}
    name="deviceId"  // Name reflects deviceId for posting
    label={"Bus Name"}
  >
    {buses?.map((option) => (
      <MenuItem key={option.deviceId} value={option.deviceId}>
        {option.deviceName}  
      </MenuItem>
    ))}
  </Select>
</FormControl> */}
 {/* <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <InputLabel>{"Bus Name"}</InputLabel>
  <Select
    value={formData["deviceId"] || ""}
    onChange={handleBusChange}
    name="deviceId"
    label={"Bus Name"}
  >
    {buses?.map((option) => (
      <MenuItem key={option.deviceId} value={option.deviceId}>
        {option.deviceName}
      </MenuItem>
    ))}
  </Select>
</FormControl> */}
<FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-bus-select"
    options={Array.isArray(buses) ? buses : []} // Ensure buses is an array
    getOptionLabel={(option) => option.deviceName || ""} // Display bus name
    value={Array.isArray(buses) ? buses.find(bus => bus.deviceId === formData["deviceId"]) : null} // Safely find the selected bus
    onChange={(event, newValue) => {
      handleBusChange({
        target: { name: "deviceId", value: newValue?.deviceId || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Bus Name"
        variant="outlined"
        name="deviceId"
      />
    )}
  />
</FormControl>
{/* Geofences display based on selected Bus */}
{/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <InputLabel id="geofence-id-label">Select Geofence</InputLabel>
  <Select
    labelId="geofence-id-label"
    name="pickupPoint"
    value={formData["pickupPoint"] || ""}
    onChange={handleInputChange}
  >
    {filteredGeofences.length > 0 ? (
      filteredGeofences.map(geofence => (
        <MenuItem key={geofence._id} value={geofence.name}>
          {geofence.name} 
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No geofences available</MenuItem>
    )}
  </Select>
</FormControl> */}
<FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <Autocomplete
    id="geofence-autocomplete"
    options={filteredGeofences || []} // List of geofence objects
    getOptionLabel={(option) => option.name || ""} // Display geofence name
    value={filteredGeofences.find(geofence => geofence.name === formData["pickupPoint"]) || null} // Find the selected geofence
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "pickupPoint", value: newValue?.name || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Geofence"
        variant="outlined"
        name="pickupPoint"
      />
    )}
  />
</FormControl>



            <TextField
              key={"parent"}
              label={"Parent Name"}
              variant="outlined"
              name="parentName"
              value={formData["parentName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"phone"}
              label={"Phone Number"}
              variant="outlined"
              name="phone"
              value={formData["phone"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"email"}
              label={"Parent's Email"}
              variant="outlined"
              name="email"
              value={formData["email"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"password"}
              label={"Password"}
              variant="outlined"
              name="password"
              value={formData["password"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
          {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <InputLabel id="device-id-label">Select Device</InputLabel>
  <Select
    labelId="device-id-label"
    name="deviceId"
    value={selectedDeviceId}
    onChange={handleInputChange}
  >
    {pickupPointsData.map((item) => (
      <MenuItem key={item.deviceId} value={item.deviceId}>
        {item.deviceId} 
      </MenuItem>
    ))}
  </Select>
</FormControl>
{filteredGeofences.length > 0 && (
  <div>
    <h3>Geofences for Device {selectedDeviceId}:</h3>
    <ul>
      {filteredGeofences.map(geofence => (
        <li key={geofence._id}>{geofence.name}</li> // Display geofence name
      ))}
    </ul>
  </div>
)} */}



            <TextField
              key={"fcmToken"}
              label={"fcm Token"}
              variant="outlined"
              name="fcmToken"
              value={formData["fcmToken"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>


        <Modal open={addModalOpen} onClose={handleModalClose}>
          <Box sx={style}>
            {/* <h2>Add Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Add Student</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              key={"childName"}
              label={"Student Name"}
              variant="outlined"
              name="childName"
              value={formData["childName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ marginRight: 4 }} // Add some space between label and radio group
              >
                Date of Birth
              </FormLabel>

              <TextField
                key={"childAge"}
                type="date"
                placeholder="Date of Birth"
                variant="outlined"
                name="dateOfBirth"
                value={formData["dateOfBirth"] || ""}
                onChange={handleInputChange}
                sx={{ marginBottom: "10px", width: "200px" }}
                fullWidth
              />
            </FormControl>

            <TextField
              key={"childAge"}
              label={"Student Age"}
              variant="outlined"
              name="childAge"
              value={formData["childAge"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />

            {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="class"
                value={formData["class"] || ""}
                label="Class"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl> */}
<FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <Autocomplete
    id="searchable-select"
    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}  // Array of values to choose from
    getOptionLabel={(option) => option.toString()}  // Convert numeric values to string for display
    value={formData["class"] || null}
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "class", value: newValue },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Class"
        variant="outlined"
        name="class"
      />
    )}
  />
</FormControl>
            <TextField
              key={"roleno"}
              label={"Roll No"}
              variant="outlined"
              name="rollno"
              value={formData["rollno"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"section"}
              label={"Section"}
              variant="outlined"
              name="section"
              value={formData["section"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            {role == 1 ? (
              <>
                {/* <FormControl
                  variant="outlined"
                  sx={{ marginBottom: "10px" }}
                  fullWidth
                >
                  <InputLabel>{"School Name"}</InputLabel>

                  <Select
                    value={formData["schoolName"] || ""}
                    onChange={handleInputChange}
                    name="schoolName"
                    label={"School Name"}
                  >
                    {schools?.map((option) => (
                      <MenuItem key={option._id} value={option.schoolName}>
                        {option.schoolName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-school-select"
    options={schools || []} // Ensure schools is an array
    getOptionLabel={(option) => option.schoolName || ""} // Display school name
    value={Array.isArray(schools) ? schools.find(school => school.schoolName === formData["schoolName"]) : null} // Safely find the selected school
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "schoolName", value: newValue?.schoolName || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="School Name"
        variant="outlined"
        name="schoolName"
      />
    )}
  />
</FormControl>
                {/* <FormControl
                  variant="outlined"
                  sx={{ marginBottom: "10px" }}
                  fullWidth
                >
                  <InputLabel>{"Branch Name"}</InputLabel>

                  <Select
                    value={formData["branchName"] || ""}
                    onChange={handleInputChange}
                    name="branchName"
                    label={"Branch Name"}
                  >
                    {branches?.map((option) => (
                      <MenuItem key={option.branchId} value={option.branchName}>
                        {option.branchName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-branch-select"
    options={Array.isArray(branches) ? branches : []} // Ensure branches is an array
    getOptionLabel={(option) => option.branchName || ""} // Display branch name
    value={Array.isArray(branches) ? branches.find(branch => branch.branchName === formData["branchName"]) : null} // Safely find the selected branch
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "branchName", value: newValue?.branchName || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Branch Name"
        variant="outlined"
        name="branchName"
      />
    )}
  />
</FormControl>
              </>
            ) : role == 2 ? (
              // <FormControl
              //   variant="outlined"
              //   sx={{ marginBottom: "10px" }}
              //   fullWidth
              // >
              //   <InputLabel>{"Branch Name"}</InputLabel>

              //   <Select
              //     value={formData["branchName"] || ""}
              //     onChange={handleInputChange}
              //     name="branchName"
              //     label={"Branch Name"}
              //   >
              //     {branches?.map((option) => (
              //       <MenuItem key={option.branchId} value={option.branchName}>
              //         {option.branchName}
              //       </MenuItem>
              //     ))}
              //   </Select>
              // </FormControl>
              <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
              <Autocomplete
                id="searchable-branch-select"
                options={branches || []} // List of branch objects
                getOptionLabel={(option) => option.branchName || ""} // Display branch name
                value={branches.find(branch => branch.branchName === formData["branchName"]) || null} // Find the selected branch
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: { name: "branchName", value: newValue?.branchName || "" },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch Name"
                    variant="outlined"
                    name="branchName"
                  />
                )}
              />
            </FormControl>
            ) : null}
            {/* <FormControl
  variant="outlined"
  sx={{ marginBottom: "10px" }}
  fullWidth
>
  <InputLabel>{"Bus Name"}</InputLabel>
  
  <Select
    value={formData["deviceId"] || ""}  // Select based on deviceId
    onChange={handleBusChange}
    name="deviceId"  // Name reflects deviceId for posting
    label={"Bus Name"}
  >
    {buses?.map((option) => (
      <MenuItem key={option.deviceId} value={option.deviceId}>
        {option.deviceName}  
      </MenuItem>
    ))}
  </Select>
</FormControl> */}
 {/* <FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <InputLabel>{"Bus Name"}</InputLabel>
  <Select
    value={formData["deviceId"] || ""}
    onChange={handleBusChange}
    name="deviceId"
    label={"Bus Name"}
  >
    {buses?.map((option) => (
      <MenuItem key={option.deviceId} value={option.deviceId}>
        {option.deviceName}
      </MenuItem>
    ))}
  </Select>
</FormControl> */}
<FormControl variant="outlined" sx={{ marginBottom: "10px" }} fullWidth>
  <Autocomplete
    id="searchable-bus-select"
    options={Array.isArray(buses) ? buses : []} // Ensure buses is an array
    getOptionLabel={(option) => option.deviceName || ""} // Display bus name
    value={Array.isArray(buses) ? buses.find(bus => bus.deviceId === formData["deviceId"]) : null} // Safely find the selected bus
    onChange={(event, newValue) => {
      handleBusChange({
        target: { name: "deviceId", value: newValue?.deviceId || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Bus Name"
        variant="outlined"
        name="deviceId"
      />
    )}
  />
</FormControl>
{/* Geofences display based on selected Bus */}
{/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <InputLabel id="geofence-id-label">Select Geofence</InputLabel>
  <Select
    labelId="geofence-id-label"
    name="pickupPoint"
    value={formData["pickupPoint"] || ""}
    onChange={handleInputChange}
  >
    {filteredGeofences.length > 0 ? (
      filteredGeofences.map(geofence => (
        <MenuItem key={geofence._id} value={geofence.name}>
          {geofence.name} 
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No geofences available</MenuItem>
    )}
  </Select>
</FormControl> */}
<FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <Autocomplete
    id="geofence-autocomplete"
    options={filteredGeofences || []} // List of geofence objects
    getOptionLabel={(option) => option.name || ""} // Display geofence name
    value={filteredGeofences.find(geofence => geofence.name === formData["pickupPoint"]) || null} // Find the selected geofence
    onChange={(event, newValue) => {
      handleInputChange({
        target: { name: "pickupPoint", value: newValue?.name || "" },
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Geofence"
        variant="outlined"
        name="pickupPoint"
      />
    )}
  />
</FormControl>



            <TextField
              key={"parent"}
              label={"Parent Name"}
              variant="outlined"
              name="parentName"
              value={formData["parentName"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"phone"}
              label={"Phone Number"}
              variant="outlined"
              name="phone"
              value={formData["phone"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"email"}
              label={"Parent's Email"}
              variant="outlined"
              name="email"
              value={formData["email"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <TextField
              key={"password"}
              label={"Password"}
              variant="outlined"
              name="password"
              value={formData["password"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
          {/* <FormControl fullWidth sx={{ marginBottom: "10px" }}>
  <InputLabel id="device-id-label">Select Device</InputLabel>
  <Select
    labelId="device-id-label"
    name="deviceId"
    value={selectedDeviceId}
    onChange={handleInputChange}
  >
    {pickupPointsData.map((item) => (
      <MenuItem key={item.deviceId} value={item.deviceId}>
        {item.deviceId} 
      </MenuItem>
    ))}
  </Select>
</FormControl>
{filteredGeofences.length > 0 && (
  <div>
    <h3>Geofences for Device {selectedDeviceId}:</h3>
    <ul>
      {filteredGeofences.map(geofence => (
        <li key={geofence._id}>{geofence.name}</li> // Display geofence name
      ))}
    </ul>
  </div>
)} */}



            <TextField
              key={"fcmToken"}
              label={"fcm Token"}
              variant="outlined"
              name="fcmToken"
              value={formData["fcmToken"] || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: "10px" }}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        {/* <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
          <Box sx={style}>
            <h2>Import Data</h2>
            <input type="file" onChange={handleFileUpload} />
            {importData.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setFilteredRows([
                    ...filteredRows,
                    ...importData.map((row) => ({ ...row, isSelected: false })),
                  ])
                }
                sx={{ marginTop: "10px" }}
              >
                Import
              </Button>
            )}
          </Box>
        </Modal> */}
          <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
      <Box sx={style}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2>Import Data</h2>
        <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
        </div>
        {/* <h2>Import Data</h2>
        <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton> */}
        <p>Please upload the file in the following format:</p>

        {/* Sample Excel Format Table */}
        <Table>
          <TableHead>
            <TableRow>
              {sampleData[0].map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Button to Download Sample Excel */}
        <Button variant="contained" color="primary" onClick={handleDownloadSample} sx={{ marginTop: "10px" }}>
          Download Sample Excel
        </Button>
<p>


Note: Please do not make changes to the column headers. Follow the sample Excel sheet's headings and fill in your data according to our format. The required fields are:

Email (must be unique),
Parent Name,
Password </p>
        {/* File Upload Input */}
        <input type="file" onChange={handleFileUpload} style={{ marginTop: "10px" }} />

        {/* Import Button */}
        {importData.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setFilteredRows([
                ...filteredRows,
                ...importData.map((row) => ({ ...row, isSelected: false })),
              ])
            }
            sx={{ marginTop: "10px" }}
          >
            Import
          </Button>
        )}
      </Box>
    </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="warning">
            Please select a row to edit!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};