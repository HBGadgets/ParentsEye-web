// import React, { useState, useEffect, useContext, Component } from "react";
// import axios from "axios";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import TextField from "@mui/material/TextField";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import Button from "@mui/material/Button";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Switch from "@mui/material/Switch";
// import { COLUMNS } from "./columns";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ImportExportIcon from "@mui/icons-material/ImportExport";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import * as XLSX from "xlsx";
// import Alert from "@mui/material/Alert";
// import Snackbar from "@mui/material/Snackbar";
// import { TotalResponsesContext } from "../../../../TotalResponsesContext";
// import CircularProgress from "@mui/material/CircularProgress";
// import CloseIcon from "@mui/icons-material/Close";
// import { IconButton } from "@mui/material";
// import { saveAs } from 'file-saver'; // Save file to the user's machine
// // import * as XLSX from 'xlsx'; // To process and convert the excel file to JSON
// //import { TextField } from '@mui/material';
// import Select from "react-select";
// import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   height: "80%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   overflowY: "auto", // Enable vertical scrolling
//   display: "flex",
//   flexDirection: "column",
//   padding: "1rem",
// };

// export const Trips = () => {
//   const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [filterText, setFilterText] = useState("");
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });
//   const [columnVisibility, setColumnVisibility] = useState(
//     Object.fromEntries(COLUMNS().map((col) => [col.accessor, true]))
//   );
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [importData, setImportData] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [originalRows, setOriginalRows] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterData(filterText);
//   }, [filterText]);

 

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleFilterChange = (event) => {
//     const text = event.target.value;
//     setFilterText(text);
//   };

 
//   const filterData = (text) => {
//     // Apply text-based filtering
//     if (text === "") {
//       // If no text is provided, reset to original rows
//       setFilteredRows(originalRows.map(row => ({ ...row, isSelected: false })));
//     } else {
//       // Filter based on text
//       const filteredData = originalRows
//         .filter((row) =>
//           Object.values(row).some(
//             (val) =>
//               typeof val === "string" &&
//               val.toLowerCase().includes(text.toLowerCase())
//           )
//         )
//         .map((row) => ({ ...row, isSelected: false }));
  
//       setFilteredRows(filteredData);
//     }
//   };
  
//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleColumnVisibilityChange = (accessor) => {
//     setColumnVisibility((prevState) => ({
//       ...prevState,
//       [accessor]: !prevState[accessor],
//     }));
//   };

//   const handleRowSelect = (index) => {
//     const newFilteredRows = [...filteredRows];
//     newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
//     setFilteredRows(newFilteredRows);
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     const newFilteredRows = filteredRows.map((row) => ({
//       ...row,
//       isSelected: newSelectAll,
//     }));
//     setFilteredRows(newFilteredRows);
//     setSelectAll(newSelectAll);
//   };

//   const handleEditButtonClick = () => {
//     const selected = filteredRows.find((row) => row.isSelected);
//     if (selected) {
//       setSelectedRow(selected);
//       setFormData(selected);
//       setEditModalOpen(true);
//     } else {
//       setSnackbarOpen(true);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     // Log filteredRows to check its structure
//     console.log("Filtered rows:", filteredRows);

//     // Get selected row IDs
//     const selectedIds = filteredRows
//       .filter((row) => row.isSelected)
//       .map((row) => {
//         // Log each row to check its structure
//         console.log("Processing row:", row);
//         return row._id; // Ensure id exists and is not undefined
//       });

//     console.log("Selected IDs:", selectedIds);

//     if (selectedIds.length === 0) {
//       alert("No rows selected for deletion.");
//       return;
//     }
//     const userConfirmed = window.confirm(
//       `Are you sure you want to delete ${selectedIds.length} record(s)?`
//     );

//     if (!userConfirmed) {
//       // If the user clicks "Cancel", exit the function
//       return;
//     }
//     try {
//       // Define the API endpoint and token
//       const apiUrl =
//         "https://jnmcmanagement-4-pzsf.onrender.com/jnmc/delete";
//       const token =
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0"; // Replace with actual token

//       // Send delete requests for each selected ID
//       const deleteRequests = selectedIds.map((id) =>
//         fetch(`${apiUrl}/${id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }).then((response) => {
//           if (!response.ok) {
//             throw new Error(
//               `Error deleting record with ID ${id}: ${response.statusText}`
//             );
//           }
//           return response.json();
//         })
//       );

//       // Wait for all delete requests to complete
//       await Promise.all(deleteRequests);

//       // Filter out deleted rows
//       const newFilteredRows = filteredRows.filter((row) => !row.isSelected);

//       // Update state
//       setFilteredRows(newFilteredRows);
//       setSelectAll(false);

//       alert("Selected records deleted successfully.");
//     } catch (error) {
//       console.error("Error during deletion:", error);
//       alert("Failed to delete selected records.");
//     }
//     fetchData();
//   };

//   const handleExport = () => {
//     const dataToExport = filteredRows.map((row) => {
//       const { isSelected, ...rowData } = row;
//       return rowData;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "Trips.xlsx");
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetNames = workbook.SheetNames;
//         const sheet = workbook.Sheets[sheetNames[0]];
//         const parsedData = XLSX.utils.sheet_to_json(sheet);
//         setImportData(parsedData);
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const sortedData = [...filteredRows];
//   if (sortConfig.key !== null) {
//     sortedData.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? 1 : -1;
//       }
//       return 0;
//     });
//   }

//   const handleAddButtonClick = () => {
//     setFormData({});
//     setAddModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setEditModalOpen(false);
//     setAddModalOpen(false);
//     setFormData({});
//     setModalOpen(false);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };


// const handleEditSubmit = async () => {
//   const apiUrl = `http://104.251.212.84/api/server`; // Ensure this is correct
//   const username = "test";
//   const password = "123456";
//   const token = btoa(`${username}:${password}`);

//   // Ensure formData contains the full structure with nested attributes
//   const updatedData = {
//     ...formData, // formData should have the same structure as the object you are retrieving
//     isSelected: false,
//     attributes: {
//       ...formData.attributes,
//       speedUnit: "kmh", // Ensure this is updated correctly
//     }
//   };

//   try {
//     console.log("Sending request to:", apiUrl);
//     console.log("Request payload:", JSON.stringify(updatedData, null, 2));

//     const response = await fetch(apiUrl, {
//       method: "PUT", // PUT method to update the resource
//       headers: {
//         "Authorization": `Basic ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedData), // Convert updatedData to JSON
//     });

//     console.log("Response status:", response.status);
//     console.log("Response headers:", response.headers);

//     if (!response.ok) {
//       const errorResult = await response.json();
//       console.error("Error response:", errorResult);
//       throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`);
//     }

//     const result = await response.json();
//     console.log("Update successful:", result);
//     alert("Updated successfully");

//     // Update filteredRows in state
//     const updatedRows = filteredRows.map((row) =>
//       row.id === selectedRow.id
//         ? { ...row, ...updatedData, isSelected: false } // Ensure the updated data includes nested fields
//         : row
//     );
//     setFilteredRows(updatedRows);

//     handleModalClose();
//     fetchData(); // Refetch data to ensure the UI is up-to-date
//   } catch (error) {
//     console.error("Error updating row:", error.message, error.stack);
//     alert("Error updating data");
//   }
// };

 
//   const handleAddSubmit = async () => {
//     try {
//       const newRow = {
//         ...formData,
//         id: filteredRows.length + 1,
//         isSelected: false,
//       };

//       // POST request to the server
//       const response = await fetch(
//         "https://jnmcmanagement-4-pzsf.onrender.com/parent/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newRow),
//         }
//       );
//       alert('record created successfully');
    
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       // Assuming the server returns the created object
//       const result = await response.json();

//       // Update the state with the new row
//       setFilteredRows([...filteredRows, result]);

//       // Close the modal
//       handleModalClose();
//       fetchData();
//       console.log("error occured in post method");
//     } catch (error) {
//       console.error("Error during POST request:", error);
//       alert('unable to create record');
//       // Handle the error appropriately (e.g., show a notification to the user)
//     }
//   };


//   const [devices, setDevices] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const response = await fetch('https://rocketsalestracker.com/api/devices', {
//           headers: {
//             'Authorization': 'Basic ' + btoa('schoolmaster:123456'), // Replace with your username and password
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setDevices(data); // Adjust according to the actual response format
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDevices();
//   }, []);
  
//   const [groups, setGroups] = useState([]);
//   // const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await fetch('https://rocketsalestracker.com/api/groups', {
//           method: 'GET',
//           headers: {
//             'Authorization': 'Basic ' + btoa('schoolmaster:123456') // Replace with actual credentials
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setGroups(data); // Assuming the API returns { groups: [...] }
//       } catch (error) {
//         setError(error.message);
//       }
//     };

//     fetchGroups();
//   }, []);

  
//   const [selectedDevice, setSelectedDevice] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState('');
//   const [apiUrl, setApiUrl] = useState('');
  

//   const handleShowClick = () => {
//     const formattedStartDate = formatToUTC(startDate);
//     const formattedEndDate = formatToUTC(endDate);

//     if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
//       alert('Please fill all fields');
//       return;
//     }

//     // Construct the API URL
//     const url = `
// https://rocketsalestracker.com/api/reports/trips?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}`;
    
//     setApiUrl(url); // Update the state with the generated URL
//     fetchData(url); // Call fetchData with the generated URL
//   };
//   const formatToUTC = (localDateTime) => {
//     if (!localDateTime) return '';
//     const localDate = new Date(localDateTime);
//     const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//     return utcDate.toISOString();
//   };
  

  
  
 
  
 





// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // For downloading binary data
//     });

//     console.log('Content-Type:', response.headers['content-type']);

//     // Check if the response is JSON
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text); // Parse JSON
//       console.log('Processed JSON Data:', jsonResponse);

      
//       const processedData = jsonResponse.map(data => ({
//         deviceId: data.deviceId || 'N/A',
//         deviceName: data.deviceName || 'N/A',
//         distance: data.distance || 'N/A',
//         averageSpeed: data.averageSpeed ? `${data.averageSpeed.toFixed(2)} mph` : 'N/A',
//         maxSpeed: data.maxSpeed ? `${data.maxSpeed.toFixed(2)} mph` : 'N/A',
//         spentFuel: data.spentFuel ? `${data.spentFuel.toFixed(2)} L` : 'N/A',
//         startOdometer: data.startOdometer ? `${data.startOdometer.toFixed(2)} mi` : 'N/A',
//         endOdometer: data.endOdometer ? `${data.endOdometer.toFixed(2)} mi` : 'N/A',
//         startTime: data.startTime ? new Date(data.startTime).toLocaleString() : 'N/A',
//         endTime: data.endTime ? new Date(data.endTime).toLocaleString() : 'N/A',
//         startLat: data.startLat ? `${data.startLat.toFixed(6)}°` : 'N/A',
//         startLon: data.startLon ? `${data.startLon.toFixed(6)}°` : 'N/A',
//         endLat: data.endLat ? `${data.endLat.toFixed(6)}°` : 'N/A',
//         endLon: data.endLon ? `${data.endLon.toFixed(6)}°` : 'N/A',
//         startAddress: data.startAddress || 'N/A',
//         endAddress: data.endAddress || 'N/A',
//         duration: data.duration ? `${(data.duration / 1000 / 60).toFixed(2)} min` : 'N/A',
//         driverUniqueId: data.driverUniqueId || 'N/A',
//         driverName: data.driverName || 'N/A',
//         startPositionId: data.startPositionId || 'N/A',  // Added missing field
//         endPositionId: data.endPositionId || 'N/A'       // Added missing field
//     }));
    
//       console.log('Processed Data:', processedData);

//       setFilteredRows(processedData);
//       setTotalResponses(processedData.length);

//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel file
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'report.xlsx'); // Save Excel file

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         console.log('Extracted JSON from Excel:', jsonData);

//         // Process the data from Excel
//         const processedDataFromExcel = jsonData.map(data => ({
//           deviceId: data.deviceId || 'N/A',
//           deviceName: data.deviceName || 'N/A',
//           distance: data.distance ? `${data.distance.toFixed(2)} mi` : 'N/A',
//           averageSpeed: data.averageSpeed ? `${data.averageSpeed.toFixed(2)} mph` : 'N/A',
//           maxSpeed: data.maxSpeed ? `${data.maxSpeed.toFixed(2)} mph` : 'N/A',
//           spentFuel: data.spentFuel ? `${data.spentFuel.toFixed(2)} L` : 'N/A',
//           startOdometer: data.startOdometer ? `${data.startOdometer.toFixed(2)} mi` : 'N/A',
//           endOdometer: data.endOdometer ? `${data.endOdometer.toFixed(2)} mi` : 'N/A',
//           startTime: data.startTime ? new Date(data.startTime).toLocaleString() : 'N/A',
//           endTime: data.endTime ? new Date(data.endTime).toLocaleString() : 'N/A',
//           startLat: data.startLat ? `${data.startLat.toFixed(6)}°` : 'N/A',
//           startLon: data.startLon ? `${data.startLon.toFixed(6)}°` : 'N/A',
//           endLat: data.endLat ? `${data.endLat.toFixed(6)}°` : 'N/A',
//           endLon: data.endLon ? `${data.endLon.toFixed(6)}°` : 'N/A',
//           startAddress: data.startAddress || 'N/A',
//           endAddress: data.endAddress || 'N/A',
//           duration: data.duration ? `${(data.duration / 1000 / 60).toFixed(2)} min` : 'N/A',
//           driverUniqueId: data.driverUniqueId || 'N/A',
//           driverName: data.driverName || 'N/A'
//         }));

//         setFilteredRows(processedDataFromExcel);
//         setTotalResponses(processedDataFromExcel.length);
//       };

//       reader.readAsArrayBuffer(blob);
//     } else {
//       throw new Error('Unexpected content type: ' + response.headers['content-type']);
//     }
//   } catch (error) {
//     console.error('Error fetching the report:', error);
//     alert('Failed to download or process report.');
//   } finally {
//     setLoading(false);
//   }
// };
// const options = devices.map((device) => ({
//   value: device.id,
//   label: device.name,
// }));

// const handleChange = (selectedOption) => {
//   setSelectedDevice(selectedOption ? selectedOption.value : null);
// };

//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//        Trips 
//       </h1>
//       <div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
//          <TextField
//     label="Search"
//     variant="outlined"
//     value={filterText}
//     onChange={handleFilterChange}
//     sx={{
//       marginRight: "10px",
//       width: "200px", // Smaller width
//       '& .MuiOutlinedInput-root': {
//         height: '36px', // Set a fixed height to reduce it
//         padding: '0px', // Reduce padding to shrink height
//       },
//       '& .MuiInputLabel-root': {
//         top: '-6px', // Adjust label position
//         fontSize: '14px', // Slightly smaller label font
//       }
//     }}
//     InputProps={{
//       startAdornment: (
//         <SearchIcon
//           style={{
//             cursor: "pointer",
//             marginLeft: "10px",
//             marginRight: "5px",
//           }}
//         />
//       ),
//     }}
//   />
//               <Button
//   onClick={() => setModalOpen(true)}
//   sx={{
//     backgroundColor: "rgb(85, 85, 85)",
//     color: "white",
//     fontWeight: "bold",
//     marginRight: "10px",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     "&:hover": {
//       fontWeight: "bolder", // Make text even bolder on hover
//       backgroundColor: "rgb(85, 85, 85)", // Maintain background color on hover
//     },
//   }}
// >
//   <ImportExportIcon />
//   Column Visibility
// </Button>
         
// <Button variant="contained" color="error" onClick={handleExport}>
//             Export
//           </Button>
//         </div>
       
//      <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         marginBottom: "10px",
//       }}
//     >
//     <div
//   style={{
//     width: "250px",
//     position: "relative",
//     zIndex: "10",
//     border: "1px solid #000", // Add a black border
    
//   }}
// >
//   <Select
//     options={options}
//     value={options.find((option) => option.value === selectedDevice) || null}
//     onChange={handleChange}
//     placeholder="Select Device"
//     isClearable
//     styles={{
//       control: (provided) => ({
//         ...provided,
//         border: "none", // Remove react-select's default border if necessary
//         boxShadow: "none", // Remove default focus outline
//       }),
//       dropdownIndicator: (provided) => ({
//         ...provided,
//         color: "#000", // Set the dropdown arrow to black
//       }),
//       clearIndicator: (provided) => ({
//         ...provided,
//         color: "#000", // Set the clear icon to black
//       }),
//     }}
//   />
// </div>

      

//       <div style={{ marginRight: "10px", padding: "5px" }}>
//         <label htmlFor="start-date">Start Date & Time:</label>
//         <input
//           id="start-date"
//           type="datetime-local"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           style={{ marginRight: "10px", padding: "5px" }}
//         />
        
//         <label htmlFor="end-date">End Date & Time:</label>
//         <input
//           id="end-date"
//           type="datetime-local"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           style={{ padding: "5px" }}
//         />
//       </div>

//       <button
//         onClick={handleShowClick}
//         style={{
//           padding: "5px 10px",
//         }}
//       >
//         Show
//       </button>

//       {/* {apiUrl && (
//         <div style={{ marginTop: '10px' }}>
//           <label htmlFor="api-url">Generated API URL:</label>
//           <textarea
//             id="api-url"
//             rows="3"
//             value={apiUrl}
//             readOnly
//             style={{ width: '100%', padding: '5px' }}
//           ></textarea>
//         </div>
//       )} */}
//     </div>

       

//         {loading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <CircularProgress />
//           </div>
//         ) : (
//           <>
//             <TableContainer
//               component={Paper}
//               sx={{
//                 maxHeight: 520,
//                 border: "1.5px solid black",
//                 borderRadius: "7px",
//               }}
//             >
            

//  <Table
//       stickyHeader
//       aria-label="sticky table"
//       style={{ border: "1px solid black" }}
//     >
//       <TableHead>
//         <TableRow
//           style={{
//             borderBottom: "1px solid black",
//             borderTop: "1px solid black",
//           }}
//         >
//           <TableCell
//             padding="checkbox"
//             style={{
//               borderRight: "1px solid #e0e0e0",
//               borderBottom: "2px solid black",
//             }}
//           >
//             <Switch
//               checked={selectAll}
//               onChange={handleSelectAll}
//               color="primary"
//             />
//           </TableCell>
//           {COLUMNS()
//             .filter((col) => columnVisibility[col.accessor])
//             .map((column) => (
//               <TableCell
//                 key={column.accessor}
//                 align={column.align || 'left'}
//                 style={{
//                   minWidth: column.minWidth || '100px',
//                   cursor: "pointer",
//                   borderRight: "1px solid #e0e0e0",
//                   borderBottom: "2px solid black",
//                   padding: "4px 4px",
//                   textAlign: "center",
//                   fontWeight: "bold",
//                 }}
//                 onClick={() => requestSort(column.accessor)}
//               >
//                 {column.Header}
//                 {sortConfig.key === column.accessor ? (
//                   sortConfig.direction === "ascending" ? (
//                     <ArrowUpwardIcon fontSize="small" />
//                   ) : (
//                     <ArrowDownwardIcon fontSize="small" />
//                   )
//                 ) : null}
//               </TableCell>
//             ))}
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {sortedData.length === 0 ? (
//           <TableRow>
//             <TableCell
//               colSpan={COLUMNS().filter((col) => columnVisibility[col.accessor]).length}
//               style={{
//                 textAlign: 'center',
//                 padding: '16px',
//                 fontSize: '16px',
//                 color: '#757575',
//               }}
//             >
//               <h4>No Data Available</h4>
//             </TableCell>
//           </TableRow>
//         ) : (
//           sortedData
//             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             .map((row, index) => (
//               <TableRow
//                 hover
//                 role="checkbox"
//                 tabIndex={-1}
//                 key={row.deviceId + index} // Ensure uniqueness for the key
//                 onClick={() =>
//                   handleRowSelect(page * rowsPerPage + index)
//                 }
//                 selected={row.isSelected}
//                 style={{
//                   backgroundColor:
//                     index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                   borderBottom: "none",
//                 }}
//               >
//                 <TableCell
//                   padding="checkbox"
//                   style={{ borderRight: "1px solid #e0e0e0" }}
//                 >
//                   <Switch checked={row.isSelected} color="primary" />
//                 </TableCell>
             
//                   {COLUMNS()
//   .filter((col) => columnVisibility[col.accessor])
//   .map((column) => {
//     // Ensure column.accessor is a string before calling split
//     const accessor = typeof column.accessor === 'string' ? column.accessor : '';
//     const value = accessor.split('.').reduce((acc, part) => acc && acc[part], row);

//     return (
//       <TableCell
//         key={accessor}
//         align={column.align || 'left'}
//         style={{
//           borderRight: "1px solid #e0e0e0",
//           paddingTop: "4px",
//           paddingBottom: "4px",
//           borderBottom: "none",
//           backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//           fontSize: "smaller",
//         }}
//       >
//         {column.Cell ? column.Cell({ value }) : value}
//       </TableCell>
//     );
//   })}

//               </TableRow>
//             ))
//         )}
//       </TableBody>
//     </Table>
//             </TableContainer>
//             <StyledTablePagination>
//   <TablePagination
//     rowsPerPageOptions={[{ label: "All", value: -1 }, 10, 25, 100, 1000]}
//     component="div"
//     count={sortedData.length}
//     rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
//     page={page}
//     onPageChange={(event, newPage) => {
//       console.log("Page changed:", newPage);
//       handleChangePage(event, newPage);
//     }}
//     onRowsPerPageChange={(event) => {
//       console.log("Rows per page changed:", event.target.value);
//       handleChangeRowsPerPage(event);
//     }}
//   />
// </StyledTablePagination>
//             {/* //</></div> */}
//           </>
//         )}
//      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//           <Box sx={style}>
//             {/* <h2></h2> */}
//             <Box
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: '20px',
//       }}
//     >
//       <h2 style={{ flexGrow: 1 }}>Column Visibility</h2>
//       <IconButton onClick={handleModalClose}>
//         <CloseIcon />
//       </IconButton>
//     </Box>
//             {COLUMNS().map((col) => (
//               <div key={col.accessor}>
//                 <Switch
//                   checked={columnVisibility[col.accessor]}
//                   onChange={() => handleColumnVisibilityChange(col.accessor)}
//                   color="primary"
//                 />
//                 {col.Header}
//               </div>
              
//             ))}
//           </Box>
//         </Modal>
//         <Modal open={editModalOpen} onClose={handleModalClose}>
//           <Box sx={style}>
//             {/* <h2>Edit Row</h2> */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "20px",
//               }}
//             >
//               <h2 style={{ flexGrow: 1 }}>Edit Row</h2>
//               <IconButton onClick={handleModalClose}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//             {COLUMNS()
//               .slice(0, -1)
//               .map((col) => (
//                 <TextField
//                   key={col.accessor}
//                   label={col.Header}
//                   variant="outlined"
//                   name={col.accessor}
//                   value={formData[col.accessor] || ""}
//                   onChange={handleInputChange}
//                   sx={{ marginBottom: "10px" }}
//                   fullWidth
//                 />
//               ))}
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleEditSubmit}
//             >
//               Submit
//             </Button>
//           </Box>
//         </Modal>
//         <Modal open={addModalOpen} onClose={handleModalClose}>
//           <Box sx={style}>
//             {/* <h2>Add Row</h2> */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "20px",
//               }}
//             >
//               <h2 style={{ flexGrow: 1 }}>Add Row</h2>
//               <IconButton onClick={handleModalClose}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//             {COLUMNS()
//               .slice(0, -1)
//               .map((col) => (
//                 <TextField
//                   key={col.accessor}
//                   label={col.Header}
//                   variant="outlined"
//                   name={col.accessor}
//                   value={formData[col.accessor] || ""}
//                   onChange={handleInputChange}
//                   sx={{ marginBottom: "10px" }}
//                   fullWidth
//                 />
//               ))}
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleAddSubmit}
//             >
//               Submit
//             </Button>
//           </Box>
//         </Modal>
//         <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
//           <Box sx={style}>
//             <h2>Import Data</h2>
//             <input type="file" onChange={handleFileUpload} />
//             {importData.length > 0 && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() =>
//                   setFilteredRows([
//                     ...filteredRows,
//                     ...importData.map((row) => ({ ...row, isSelected: false })),
//                   ])
//                 }
//                 sx={{ marginTop: "10px" }}
//               >
//                 Import
//               </Button>
//             )}
//           </Box>
//         </Modal>
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3000}
//           onClose={handleSnackbarClose}
//         >
//           <Alert onClose={handleSnackbarClose} severity="warning">
//             Please select a row to edit!
//           </Alert>
//         </Snackbar>
//       </div>
//     </>
//   );
// };


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
import ExcelJS from "exceljs";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { TotalResponsesContext } from "../../../../TotalResponsesContext";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { saveAs } from 'file-saver'; // Save file to the user's machine
import Export from "./ExportTrip"
// import * as XLSX from 'xlsx'; // To process and convert the excel file to JSON
//import { TextField } from '@mui/material';
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Select from "react-select";
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

export const Trips = () => {
  const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterText, setFilterText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
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

  
 


  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

 
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage); // Set to all rows if -1
    setPage(0); // Reset to the first page
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
  };

 
  const filterData = (text) => {
    let dataToFilter = originalRows;
  
    // Apply date filter
    if (startDate && endDate) {
      dataToFilter = dataToFilter.filter((row) => {
        const rowDate = new Date(row.dateOfBirth); // Adjust based on your date field
        return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
      });
    }
  
    // Apply text filter
    if (text === "") {
      setFilteredRows(dataToFilter); // Reset to full filtered data
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
      
      setFilteredRows(filteredData); // Update filtered rows
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
        return row._id; // Ensure id exists and is not undefined
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
        "https://schoolmanagement-4-pzsf.onrender.com/school/delete";
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMDdmMGRkYmVjNmM3YmMzZDUzZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MjMxMTU1MjJ9.4DgAJH_zmaoanOy4gHB87elbUMod8PunDL2qzpfPXj0"; // Replace with actual token

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

  // const handleExport = () => {
  //   const dataToExport = filteredRows.map((row) => {
  //     const { isSelected, ...rowData } = row;
  //     return rowData;
  //   });
  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   XLSX.writeFile(workbook, "Trips.xlsx");
  // };
//from backened
 // deviceId	deviceName	startTime	endTime	startLatitude	startLongitude	endLatitude
 // 	endLongitude	startSpeed	endSpeed	address	course	altitude	accuracy	valid	protocol	
 // totalDistance	motion	blocked	ignition	batteryLevel	odometer	engineStatus	charge	alarm1Status
 // 	alarm2Status	geofences	distance1
//table order
console.log("filteredRows in TRIPS", filteredRows);

const handleExport = async () => {

    // Define fields to exclude and the desired header names
    const excludedFields = ["isSelected",];
    const headerOverrides = {
      deviceName:"DEVICE NAME",
      startTime:"START TIME",
      startLatitude:"START LATITUDE",
      startLongitude:"START LONGITUDE",
      endTime:"END TIME",
      endLatitude:"END LATITUDE",
      endLongitude:"END LONGITUDE",
      distance1:"DISTANCE"
    };

   // Define the desired order of fields
   const fieldOrder = [
    "deviceName",
    "startTime",
    "startLatitude",
    "startLongitude",
    "endTime",
    "endLatitude",
    "endLongitude",
    "distance1",
  ];

  // Filter, map, and reorder data
  const dataToExport = filteredRows.map((row) => {
    const filteredRow = {};
    for (const field of fieldOrder) {
      // if (!excludedFields.includes(field) && row[field] !== undefined) {
      //   filteredRow[headerOverrides[field] || field.toUpperCase()] = row[field];
      // }
      if (field === "distance1") {
        filteredRow[headerOverrides[field] || field.toUpperCase()] = `${(row[field] / 1000).toFixed(2)} km`;
      } else {
        filteredRow[headerOverrides[field] || field.toUpperCase()] = row[field];
      }
    }
    return filteredRow;
  });

    // Create a workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add headers to the worksheet
    const headers = Object.keys(dataToExport[0] || {}).map((key) => ({
      header: key,
      key,
      width: Math.max(
        key.length + 5, // Header length with padding
        ...dataToExport.map((row) => String(row[key] || "").length + 5) // Max data length with padding
      ),
    }));
    worksheet.columns = headers;

    // Add data rows
    dataToExport.forEach((row, index) => {
      const addedRow = worksheet.addRow(row);

      // Apply alternate row styling
      if (index % 2 === 1) {
        addedRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F9F9F9" }, // Light gray background for alternate rows
        };
      }
      addedRow.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    });


    // Style the headers
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Bold and white font
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" }, // Blue background for headers
      };
      cell.alignment = { vertical: "middle", horizontal: "center" }; // Center alignment

    });
    //BORDERS FOR ALL COLUMNS
    const totalRows = worksheet.rowCount;
    const totalCols = headers.length;

    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Trips.xlsx";
    link.click();
  };
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
        setImportData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
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
    setFormData({});
    setModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 


const handleEditSubmit = async () => {
  const apiUrl = `https://rocketsalestracker.com/api/server`; // Ensure this is correct
  const username = "test";
  const password = "123456";
  const token = btoa(`${username}:${password}`);

  // Ensure formData contains the full structure with nested attributes
  const updatedData = {
    ...formData, // formData should have the same structure as the object you are retrieving
    isSelected: false,
    attributes: {
      ...formData.attributes,
      speedUnit: "kmh", // Ensure this is updated correctly
    }
  };

  try {
    console.log("Sending request to:", apiUrl);
    console.log("Request payload:", JSON.stringify(updatedData, null, 2));

    const response = await fetch(apiUrl, {
      method: "PUT", // PUT method to update the resource
      headers: {
        "Authorization": `Basic ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData), // Convert updatedData to JSON
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorResult = await response.json();
      console.error("Error response:", errorResult);
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResult.message}`);
    }

    const result = await response.json();
    console.log("Update successful:", result);
    alert("Updated successfully");

    // Update filteredRows in state
    const updatedRows = filteredRows.map((row) =>
      row.id === selectedRow.id
        ? { ...row, ...updatedData, isSelected: false } // Ensure the updated data includes nested fields
        : row
    );
    setFilteredRows(updatedRows);

    handleModalClose();
    fetchData(); // Refetch data to ensure the UI is up-to-date
  } catch (error) {
    console.error("Error updating row:", error.message, error.stack);
    alert("Error updating data");
  }
};

 
  const handleAddSubmit = async () => {
    try {
      const newRow = {
        ...formData,
        id: filteredRows.length + 1,
        isSelected: false,
      };

      // POST request to the server
      const response = await fetch(
        "https://schoolmanagement-4-pzsf.onrender.com/parent/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRow),
        }
      );
      alert('record created successfully');
    
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

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
      alert('unable to create record');
      // Handle the error appropriately (e.g., show a notification to the user)
    }
  };


  const [devices, setDevices] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/devices', {
          headers: {
            'Authorization': 'Basic ' + btoa('schoolmaster:123456'), // Replace with your username and password
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDevices(data); // Adjust according to the actual response format
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;
  const [groups, setGroups] = useState([]);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/groups', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa('schoolmaster:123456') // Replace with actual credentials
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setGroups(data); // Assuming the API returns { groups: [...] }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGroups();
  }, []);

  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  
  const handleShowClick = () => {
    const formattedStartDate = formatToUTC(startDate);
    const formattedEndDate = formatToUTC(endDate);

    if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
      alert('Please fill all fields');
      return;
    }

    // Construct the API URL
    const url = `https://rocketsalestracker.com/api/reports/route?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&deviceId=${encodeURIComponent(selectedDevice)}`;
    
    setApiUrl(url); // Update the state with the generated URL
    fetchData(url); // Call fetchData with the generated URL
  };
  const formatToUTC = (localDateTime) => {
    if (!localDateTime) return '';
    const localDate = new Date(localDateTime);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  };
  
  
// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);
//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});
//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON
//       // Process the JSON response
//       console.log('Processed JSON Data:', jsonResponse);

//       // Example: Set filtered rows and total responses from JSON data
//       setFilteredRows(jsonResponse.map(data => ({
//         deviceId: data.deviceId || 'N/A',
//         deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//         eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//         latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
//         longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
//         speed : data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',

//         address: data.address || 'Show Address',
//         course: data.course > 0 ? '↑' : '↓',
//         altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
//         accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
//         valid: data.valid ? 'Yes' : 'No',
//         protocol: data.protocol || 'N/A',
//         deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
//         serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
//         fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//         geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//         satellites: data.attributes?.sat || 'N/A',
//         RSSI: data.attributes?.rssi || 'N/A',
//         odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
//         batteryLevel: data.attributes?.batteryLevel || 'N/A',
//         ignition: data.attributes?.ignition ? 'Yes' : 'No',
//         charge: data.attributes?.charge ? 'Yes' : 'No',
//         archive: data.attributes?.archive ? 'Yes' : 'No',
//         distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//         totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//         motion: data.attributes?.motion ? 'Yes' : 'No',
//         blocked: data.attributes?.blocked ? 'Yes' : 'No',
//         alarm1Status: data.attributes?.alarm1Status || 'N/A',
//         otherStatus: data.attributes?.otherStatus || 'N/A',
//         alarm2Status: data.attributes?.alarm2Status || 'N/A',
//         engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//         adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
        
//       })));

//       setTotalResponses(jsonResponse.length);

//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'report.xlsx'); // Save the file to the user's system

//       // Process the file to extract data
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const reportWorkbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = reportWorkbook.SheetNames[0];
//         const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
//         // Convert worksheet data to JSON
//         const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

//         console.log('Extracted JSON Data from Excel:', jsonData);

//         // Process the data
//         const processedEvents = jsonData.map(data => ({
//           deviceId: data.deviceId,
//           deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//           eventTime: new Date(data.fixTime).toLocaleString(),
//           latitude: `${data.latitude.toFixed(6)}°`,
//           longitude: `${data.longitude.toFixed(6)}°`,
//           speed: `${data.speed.toFixed(2)} mph`,
//           address: data.address || 'Show Address',
//           course: data.course > 0 ? '↑' : '↓',
//           altitude: `${data.altitude.toFixed(2)} m`,
//           accuracy: `${data.accuracy.toFixed(2)}`,
//           valid: data.valid ? 'Yes' : 'No',
//           protocol: data.protocol,
//           deviceTime: new Date(data.deviceTime).toLocaleString(),
//           serverTime: new Date(data.serverTime).toLocaleString(),
//           geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//           satellites: data.attributes.sat || '',
//           RSSI: data.attributes.rssi || '',
//           odometer: `${(data.attributes.odometer || 0).toFixed(2)} mi`,
//           batteryLevel: data.attributes.batteryLevel || '',
//           ignition: data.attributes.ignition ? 'Yes' : 'No',
//           charge: data.attributes.charge ? 'Yes' : 'No',
//           archive: data.attributes.archive ? 'Yes' : 'No',
//           distance: `${(data.attributes.distance || 0).toFixed(2)} mi`,
//           totalDistance: `${(data.attributes.totalDistance || 0).toFixed(2)} mi`,
//           motion: data.attributes.motion ? 'Yes' : 'No',
//           blocked: data.attributes.blocked ? 'Yes' : 'No',
//           alarm1Status: data.attributes.alarm1Status || '',
//           otherStatus: data.attributes.otherStatus || '',
//           alarm2Status: data.attributes.alarm2Status || '',
//           engineStatus: data.attributes.engineStatus ? 'On' : 'Off',
//           adc1: data.attributes.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : ''
//         }));

//         console.log('Processed Events:', processedEvents);

        
//         setFilteredRows(
//           processedEvents.map((row) => ({ ...row, isSelected: false }))
//         );
//         setOriginalRows(processedEvents.map((row) => ({ ...row, isSelected: false })));
        
//         setTotalResponses(processedEvents.length);

      
//         const outputWorksheet = XLSX.utils.json_to_sheet(processedEvents);
//         const outputWorkbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Processed Report');

//         XLSX.writeFile(outputWorkbook, 'processed_report.xlsx');
//       };

//       reader.readAsArrayBuffer(blob); // Read the Blob as an ArrayBuffer
//     } else {
//       throw new Error('Unexpected content type: ' + response.headers['content-type']);
//     }
//   } catch (error) {
//     console.error('Error fetching the report:', error);
//     alert("please select device and date");
//   } finally {
//     setLoading(false);
//   }
// };

// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON

//       // Process the JSON response
//       console.log('Processed JSON Data:', jsonResponse);

//       // Example: Set filtered rows and total responses from JSON data
//       setFilteredRows(jsonResponse.map(data => ({
//         deviceId: data.deviceId || 'N/A',
//         deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//         eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//         latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
//         longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
//         speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
//         address: data.address || 'Show Address',
//         course: data.course > 0 ? '↑' : '↓',
//         altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
//         accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
//         valid: data.valid ? 'Yes' : 'No',
//         protocol: data.protocol || 'N/A',
//         deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
//         serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
//         fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//         geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//         satellites: data.attributes?.sat || 'N/A',
//         RSSI: data.attributes?.rssi || 'N/A',
//         odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
//         batteryLevel: data.attributes?.batteryLevel || 'N/A',
//         ignition: data.attributes?.ignition ? 'Yes' : 'No',
//         charge: data.attributes?.charge ? 'Yes' : 'No',
//         archive: data.attributes?.archive ? 'Yes' : 'No',
//         distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//         totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//         motion: data.attributes?.motion ? 'Yes' : 'No',
//         blocked: data.attributes?.blocked ? 'Yes' : 'No',
//         alarm1Status: data.attributes?.alarm1Status || 'N/A',
//         otherStatus: data.attributes?.otherStatus || 'N/A',
//         alarm2Status: data.attributes?.alarm2Status || 'N/A',
//         engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//         adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
//       })));

//       setTotalResponses(jsonResponse.length);

//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'report.xlsx'); // Save the file to the user's system

//       // Process the file to extract data
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const reportWorkbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = reportWorkbook.SheetNames[0];
//         const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
//         // Convert worksheet data to JSON
//         const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

//         console.log('Extracted JSON Data from Excel:', jsonData);

//         // Process the data
//         const processedEvents = jsonData.map(data => ({
//           deviceId: data.deviceId,
//           deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//           eventTime: new Date(data.fixTime).toLocaleString(),
//           latitude: `${data.latitude.toFixed(6)}°`,
//           longitude: `${data.longitude.toFixed(6)}°`,
//           speed: `${data.speed.toFixed(2)} mph`,
//           address: data.address || 'Show Address',
//           course: data.course > 0 ? '↑' : '↓',
//           altitude: `${data.altitude.toFixed(2)} m`,
//           accuracy: `${data.accuracy.toFixed(2)}`,
//           valid: data.valid ? 'Yes' : 'No',
//           protocol: data.protocol,
//           deviceTime: new Date(data.deviceTime).toLocaleString(),
//           serverTime: new Date(data.serverTime).toLocaleString(),
//           geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//           satellites: data.attributes.sat || '',
//           RSSI: data.attributes.rssi || '',
//           odometer: `${(data.attributes.odometer || 0).toFixed(2)} mi`,
//           batteryLevel: data.attributes.batteryLevel || '',
//           ignition: data.attributes.ignition ? 'Yes' : 'No',
//           charge: data.attributes.charge ? 'Yes' : 'No',
//           archive: data.attributes.archive ? 'Yes' : 'No',
//           distance: `${(data.attributes.distance || 0).toFixed(2)} mi`,
//           totalDistance: `${(data.attributes.totalDistance || 0).toFixed(2)} mi`,
//           motion: data.attributes.motion ? 'Yes' : 'No',
//           blocked: data.attributes.blocked ? 'Yes' : 'No',
//           alarm1Status: data.attributes.alarm1Status || '',
//           otherStatus: data.attributes.otherStatus || '',
//           alarm2Status: data.attributes.alarm2Status || '',
//           engineStatus: data.attributes.engineStatus ? 'On' : 'Off',
//           adc1: data.attributes.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : ''
//         }));

//         console.log('Processed Events:', processedEvents);

//         setFilteredRows(
//           processedEvents.map((row) => ({ ...row, isSelected: false }))
//         );
//         setOriginalRows(processedEvents.map((row) => ({ ...row, isSelected: false })));
        
//         setTotalResponses(processedEvents.length);

//         // Optionally export the processed data back to an Excel file
//         const outputWorksheet = XLSX.utils.json_to_sheet(processedEvents);
//         const outputWorkbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Processed Report');

//         // Trigger file download
//         XLSX.writeFile(outputWorkbook, 'processed_report.xlsx');
//       };

//       reader.readAsArrayBuffer(blob); // Read the Blob as an ArrayBuffer
//     } else {
//       throw new Error('Unexpected content type: ' + response.headers['content-type']);
//     }
//   } catch (error) {
//     console.error('Error fetching the report:', error);
//     alert("please select device and date");
//   } finally {
//     setLoading(false);
//   }
// };
// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);
//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Variable to track if we have encountered ignition = true
//     let ignitionFound = false;
//     const processedData = [];

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON
//       console.log('Processed JSON Data:', jsonResponse);

//       // Loop through the JSON data
//       for (let data of jsonResponse) {
//         // Check if ignition is true for this record
//         if (data.attributes?.ignition === true) {
//           ignitionFound = true; // Start processing once ignition is true
//         }

//         // Skip records where speed < 1 or distance < 1
//         if (data.speed < 1 || data.attributes?.distance < 1) {
//           continue;
//         }

//         // Start storing data once ignition is found
//         if (ignitionFound) {
//           processedData.push({
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//             eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//             latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
//             longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
//             speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
//             address: data.address || 'Show Address',
//             course: data.course > 0 ? '↑' : '↓',
//             altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
//             accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
//             valid: data.valid ? 'Yes' : 'No',
//             protocol: data.protocol || 'N/A',
//             deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
//             serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
//             fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//             geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//             satellites: data.attributes?.sat || 'N/A',
//             RSSI: data.attributes?.rssi || 'N/A',
//             odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
//             batteryLevel: data.attributes?.batteryLevel || 'N/A',
//             ignition: data.attributes?.ignition ? 'Yes' : 'No',
//             charge: data.attributes?.charge ? 'Yes' : 'No',
//             archive: data.attributes?.archive ? 'Yes' : 'No',
//             distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//             totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//             motion: data.attributes?.motion ? 'Yes' : 'No',
//             blocked: data.attributes?.blocked ? 'Yes' : 'No',
//             alarm1Status: data.attributes?.alarm1Status || 'N/A',
//             otherStatus: data.attributes?.otherStatus || 'N/A',
//             alarm2Status: data.attributes?.alarm2Status || 'N/A',
//             engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
//           });
//         }
//       }

//       setFilteredRows(processedData);
//       setTotalResponses(processedData.length);

//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'report.xlsx'); // Save the file to the user's system

//       // Process the file to extract data
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const reportWorkbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = reportWorkbook.SheetNames[0];
//         const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
//         // Convert worksheet data to JSON
//         const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

//         console.log('Extracted JSON Data from Excel:', jsonData);

//         // Loop through the Excel data
//         for (let data of jsonData) {
//           // Check if ignition is true for this record
//           if (data.attributes?.ignition === true) {
//             ignitionFound = true; // Start processing once ignition is true
//           }

//           // Skip records where speed < 1 or distance < 1
//           if (data.speed < 1 || data.attributes?.distance < 1) {
//             continue;
//           }

//           // Start storing data once ignition is found
//           if (ignitionFound) {
//             processedData.push({
//               deviceId: data.deviceId,
//               deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//               eventTime: new Date(data.fixTime).toLocaleString(),
//               latitude: `${data.latitude.toFixed(6)}°`,
//               longitude: `${data.longitude.toFixed(6)}°`,
//               speed: `${data.speed.toFixed(2)} mph`,
//               address: data.address || 'Show Address',
//               course: data.course > 0 ? '↑' : '↓',
//               altitude: `${data.altitude.toFixed(2)} m`,
//               accuracy: `${data.accuracy.toFixed(2)}`,
//               valid: data.valid ? 'Yes' : 'No',
//               protocol: data.protocol,
//               deviceTime: new Date(data.deviceTime).toLocaleString(),
//               serverTime: new Date(data.serverTime).toLocaleString(),
//               geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//               satellites: data.attributes.sat || '',
//               RSSI: data.attributes.rssi || '',
//               odometer: `${(data.attributes.odometer || 0).toFixed(2)} mi`,
//               batteryLevel: data.attributes.batteryLevel || '',
//               ignition: data.attributes.ignition ? 'Yes' : 'No',
//               charge: data.attributes.charge ? 'Yes' : 'No',
//               archive: data.attributes.archive ? 'Yes' : 'No',
//               distance: `${(data.attributes.distance || 0).toFixed(2)} mi`,
//               totalDistance: `${(data.attributes.totalDistance || 0).toFixed(2)} mi`,
//               motion: data.attributes.motion ? 'Yes' : 'No',
//               blocked: data.attributes.blocked ? 'Yes' : 'No',
//               alarm1Status: data.attributes.alarm1Status || '',
//               otherStatus: data.attributes.otherStatus || '',
//               alarm2Status: data.attributes.alarm2Status || '',
//               engineStatus: data.attributes.engineStatus ? 'On' : 'Off',
//               adc1: data.attributes.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : ''
//             });
//           }
//         }

//         console.log('Processed Events:', processedData);

//         setFilteredRows(
//           processedData.map((row) => ({ ...row, isSelected: false }))
//         );
//         setOriginalRows(processedData.map((row) => ({ ...row, isSelected: false })));

//         setTotalResponses(processedData.length);

//         const outputWorksheet = XLSX.utils.json_to_sheet(processedData);
//         const outputWorkbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Processed Report');

//         XLSX.writeFile(outputWorkbook, 'processed_report.xlsx');
//       };

//       reader.readAsArrayBuffer(blob); // Read the Blob as an ArrayBuffer
//     } else {
//       throw new Error('Unexpected content type: ' + response.headers['content-type']);
//     }
//   } catch (error) {
//     console.error('Error fetching the report:', error);
//     alert("please select device and date");
//   } finally {
//     setLoading(false);
//   }
// };
// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);
//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Variable to track if we have encountered ignition = true
//     let ignitionFound = false;
//     let lastIgnitionFalse = false;  // Track if the last record had ignition = false
//     const processedData = [];

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON
//       console.log('Processed JSON Data:', jsonResponse);

//       // Loop through the JSON data
//       for (let data of jsonResponse) {
//         // Check if ignition is true for this record
//         if (data.attributes?.ignition === true) {
//           ignitionFound = true; // Start processing once ignition is true
//           lastIgnitionFalse = false; // Reset the "last ignition false" flag
//         }

//         // Skip records where speed < 1 or distance < 1
//         if (data.speed < 1 || data.attributes?.distance < 1) {
//           continue;
//         }

//         // If ignition is false and the last record also had ignition false, skip this one
//         if (data.attributes?.ignition === false && lastIgnitionFalse) {
//           continue;
//         }

//         // Update the lastIgnitionFalse flag if current record has ignition = false
//         if (data.attributes?.ignition === false) {
//           lastIgnitionFalse = true;
//         }

//         // Start storing data once ignition is found, and skip consecutive ignition false records
//         if (ignitionFound) {
//           processedData.push({
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//             eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//             latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
//             longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
//             speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
//             address: data.address || 'Show Address',
//             course: data.course > 0 ? '↑' : '↓',
//             altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
//             accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
//             valid: data.valid ? 'Yes' : 'No',
//             protocol: data.protocol || 'N/A',
//             deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
//             serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
//             fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//             geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//             satellites: data.attributes?.sat || 'N/A',
//             RSSI: data.attributes?.rssi || 'N/A',
//             odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
//             batteryLevel: data.attributes?.batteryLevel || 'N/A',
//             ignition: data.attributes?.ignition ? 'Yes' : 'No',
//             charge: data.attributes?.charge ? 'Yes' : 'No',
//             archive: data.attributes?.archive ? 'Yes' : 'No',
//             distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//             totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//             motion: data.attributes?.motion ? 'Yes' : 'No',
//             blocked: data.attributes?.blocked ? 'Yes' : 'No',
//             alarm1Status: data.attributes?.alarm1Status || 'N/A',
//             otherStatus: data.attributes?.otherStatus || 'N/A',
//             alarm2Status: data.attributes?.alarm2Status || 'N/A',
//             engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
//           });
//         }
//       }
// console.log("my dataaaaa:",processedData);
//       setFilteredRows(processedData);
//       setTotalResponses(processedData.length);

//       } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'report.xlsx'); // Save the file to the user's system

//       // Process the file to extract data
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const reportWorkbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = reportWorkbook.SheetNames[0];
//         const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
//         // Convert worksheet data to JSON
//         const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

//         console.log('Extracted JSON Data from Excel:', jsonData);

//         // Loop through the Excel data
//         for (let data of jsonData) {
//           // Check if ignition is true for this record
//           if (data.attributes?.ignition === true) {
//             ignitionFound = true; // Start processing once ignition is true
//             lastIgnitionFalse = false; // Reset the "last ignition false" flag
//           }

//           // Skip records where speed < 1 or distance < 1
//           if (data.speed < 1 || data.attributes?.distance < 1) {
//             continue;
//           }

//           // If ignition is false and the last record also had ignition false, skip this one
//           if (data.attributes?.ignition === false && lastIgnitionFalse) {
//             continue;
//           }

//           // Update the lastIgnitionFalse flag if current record has ignition = false
//           if (data.attributes?.ignition === false) {
//             lastIgnitionFalse = true;
//           }

//           // Start storing data once ignition is found, and skip consecutive ignition false records
//           if (ignitionFound) {
//             processedData.push({
//               deviceId: data.deviceId,
//               deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//               eventTime: new Date(data.fixTime).toLocaleString(),
//               latitude: `${data.latitude.toFixed(6)}°`,
//               longitude: `${data.longitude.toFixed(6)}°`,
//               speed: `${data.speed.toFixed(2)} mph`,
//               address: data.address || 'Show Address',
//               course: data.course > 0 ? '↑' : '↓',
//               altitude: `${data.altitude.toFixed(2)} m`,
//               accuracy: `${data.accuracy.toFixed(2)}`,
//               valid: data.valid ? 'Yes' : 'No',
//               protocol: data.protocol,
//               deviceTime: new Date(data.deviceTime).toLocaleString(),
//               serverTime: new Date(data.serverTime).toLocaleString(),
//               geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//               satellites: data.attributes.sat || '',
//               RSSI: data.attributes.rssi || '',
//               odometer: `${(data.attributes.odometer || 0).toFixed(2)} mi`,
//               batteryLevel: data.attributes.batteryLevel || '',
//               ignition: data.attributes.ignition ? 'Yes' : 'No',
//               charge: data.attributes.charge ? 'Yes' : 'No',
//               archive: data.attributes.archive ? 'Yes' : 'No',
//               //distance: `${(data.attributes.distance || 0).toFixed(2
//               distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//               totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//               // distance: `${(data.attributes.distance || 0).toFixed(2)} mi`:'N/A',
//               // totalDistance: `${(data.attributes.totalDistance || 0).toFixed(2)} mi`,
//               motion: data.attributes?.motion ? 'Yes' : 'No',
//               blocked: data.attributes?.blocked ? 'Yes' : 'No',
//               alarm1Status: data.attributes?.alarm1Status || 'N/A',
//               otherStatus: data.attributes?.otherStatus || 'N/A',
//               alarm2Status: data.attributes?.alarm2Status || 'N/A',
//               engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//               adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
//               });
//             }
//           }
//           console.log("my dataaaaa:",processedData);
//           // After processing all records, update the filtered rows
//           setFilteredRows(processedData);
//           setTotalResponses(processedData.length);
//         };
  
//         reader.readAsArrayBuffer(response.data);  // Read Excel data as ArrayBuffer
//       }
  
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);  // Always stop loading after the operation
//     }
//   };
// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);
//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Variable to track if we have encountered ignition = true
//     let ignitionFound = false;
//     let currentGroup = [];  // To store the current group of data
//     let lastValidRecord = {};  // Store the last valid (ignition = true) record
//     const processedData = [];

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON
//       console.log('Processed JSON Data:', jsonResponse);

//       // Loop through the JSON data
//       for (let data of jsonResponse) {
//         // Check if ignition is true for this record
//         if (data.attributes?.ignition === true) {
//           ignitionFound = true; // Start processing once ignition is true
//           currentGroup = []; // Start a new group
//           lastValidRecord = { ...data }; // Store the current valid record for later use
//         }

//         // Skip records where speed < 1 or distance < 1
//         if (data.speed < 1 || data.attributes?.distance < 1) {
//           continue;
//         }

//         // If ignition is false and there was no previous ignition, continue to next
//         if (data.attributes?.ignition === false && !ignitionFound) {
//           continue;
//         }

//         // If ignition is true, add the record to the current group
//         if (ignitionFound) {
//           currentGroup.push({
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
//             eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//             latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
//             longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
//             speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
//             address: data.address || 'Show Address',
//             course: data.course > 0 ? '↑' : '↓',
//             altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
//             accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
//             valid: data.valid ? 'Yes' : 'No',
//             protocol: data.protocol || 'N/A',
//             deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
//             serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
//             fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//             geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//             satellites: data.attributes?.sat || 'N/A',
//             RSSI: data.attributes?.rssi || 'N/A',
//             odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
//             batteryLevel: data.attributes?.batteryLevel || 'N/A',
//             ignition: data.attributes?.ignition ? 'Yes' : 'No',
//             charge: data.attributes?.charge ? 'Yes' : 'No',
//             archive: data.attributes?.archive ? 'Yes' : 'No',
//             distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//             totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//             motion: data.attributes?.motion ? 'Yes' : 'No',
//             blocked: data.attributes?.blocked ? 'Yes' : 'No',
//             alarm1Status: data.attributes?.alarm1Status || 'N/A',
//             otherStatus: data.attributes?.otherStatus || 'N/A',
//             alarm2Status: data.attributes?.alarm2Status || 'N/A',
//             engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
//           });
//         }

//         // If ignition is false, add the false record with all parameters to close the group
//         if (data.attributes?.ignition === false && ignitionFound) {
//           currentGroup.push({
//             deviceId: lastValidRecord.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[lastValidRecord.deviceId] || 'Unknown Device',
//             eventTime: lastValidRecord.fixTime ? new Date(lastValidRecord.fixTime).toLocaleString() : 'N/A',
//             latitude: lastValidRecord.latitude ? `${lastValidRecord.latitude.toFixed(6)}°` : 'N/A',
//             longitude: lastValidRecord.longitude ? `${lastValidRecord.longitude.toFixed(6)}°` : 'N/A',
//             speed: '0 mph',
//             address: lastValidRecord.address || 'Show Address',
//             course: lastValidRecord.course > 0 ? '↑' : '↓',
//             altitude: lastValidRecord.altitude ? `${lastValidRecord.altitude.toFixed(2)} m` : 'N/A',
//             accuracy: lastValidRecord.accuracy ? `${lastValidRecord.accuracy.toFixed(2)}` : 'N/A',
//             valid: lastValidRecord.valid ? 'Yes' : 'No',
//             protocol: lastValidRecord.protocol || 'N/A',
//             deviceTime: lastValidRecord.deviceTime ? new Date(lastValidRecord.deviceTime).toLocaleString() : 'N/A',
//             serverTime: lastValidRecord.serverTime ? new Date(lastValidRecord.serverTime).toLocaleString() : 'N/A',
//             fixTime: lastValidRecord.fixTime ? new Date(lastValidRecord.fixTime).toLocaleString() : 'N/A',
//             geofences: lastValidRecord.geofenceIds ? lastValidRecord.geofenceIds.join(', ') : 'None',
//             satellites: lastValidRecord.attributes?.sat || 'N/A',
//             RSSI: lastValidRecord.attributes?.rssi || 'N/A',
//             odometer: lastValidRecord.attributes?.odometer ? `${lastValidRecord.attributes.odometer.toFixed(2)} mi` : 'N/A',
//             batteryLevel: lastValidRecord.attributes?.batteryLevel || 'N/A',
//             ignition: 'No',
//             charge: lastValidRecord.attributes?.charge ? 'Yes' : 'No',
//             archive: lastValidRecord.attributes?.archive ? 'Yes' : 'No',
//             distance: lastValidRecord.attributes?.distance ? `${lastValidRecord.attributes.distance.toFixed(2)} mi` : 'N/A',
//             totalDistance: lastValidRecord.attributes?.totalDistance ? `${lastValidRecord.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//             motion: lastValidRecord.attributes?.motion ? 'Yes' : 'No',
//             blocked: lastValidRecord.attributes?.blocked ? 'Yes' : 'No',
//             alarm1Status: lastValidRecord.attributes?.alarm1Status || 'N/A',
//             otherStatus: lastValidRecord.attributes?.otherStatus || 'N/A',
//             alarm2Status: lastValidRecord.attributes?.alarm2Status || 'N/A',
//             engineStatus: 'Off',
//             adc1: lastValidRecord.attributes?.adc1 ? `${lastValidRecord.attributes.adc1.toFixed(2)} V` : 'N/A'
//           });

//           // Push the current group to processedData
//           processedData.push(currentGroup);
//           currentGroup = []; // Reset the group
//           ignitionFound = false; // Reset ignitionFound flag
//         }
//       }

//       // If there is any remaining group (i.e., the data ends with ignition true), push it
//       if (currentGroup.length > 0) {
//         currentGroup.push({
//           deviceId: lastValidRecord.deviceId || 'N/A',
//           deviceName: deviceIdToNameMap[lastValidRecord.deviceId] || 'Unknown Device',
//           eventTime: lastValidRecord.fixTime ? new Date(lastValidRecord.fixTime).toLocaleString() : 'N/A',
//           latitude: lastValidRecord.latitude ? `${lastValidRecord.latitude.toFixed(6)}°` : 'N/A',
//           longitude: lastValidRecord.longitude ? `${lastValidRecord.longitude.toFixed(6)}°` : 'N/A',
//           speed: '0 mph',
//           address: lastValidRecord.address || 'Show Address',
//           course: lastValidRecord.course > 0 ? '↑' : '↓',
//           altitude: lastValidRecord.altitude ? `${lastValidRecord.altitude.toFixed(2)} m` : 'N/A',
//           accuracy: lastValidRecord.accuracy ? `${lastValidRecord.accuracy.toFixed(2)}` : 'N/A',
//           valid: lastValidRecord.valid ? 'Yes' : 'No',
//           protocol: lastValidRecord.protocol || 'N/A',
//           deviceTime: lastValidRecord.deviceTime ? new Date(lastValidRecord.deviceTime).toLocaleString() : 'N/A',
//           serverTime: lastValidRecord.serverTime ? new Date(lastValidRecord.serverTime).toLocaleString() : 'N/A',
//           fixTime: lastValidRecord.fixTime ? new Date(lastValidRecord.fixTime).toLocaleString() : 'N/A',
//           geofences: lastValidRecord.geofenceIds ? lastValidRecord.geofenceIds.join(', ') : 'None',
//           satellites: lastValidRecord.attributes?.sat || 'N/A',
//           RSSI: lastValidRecord.attributes?.rssi || 'N/A',
//           odometer: lastValidRecord.attributes?.odometer ? `${lastValidRecord.attributes.odometer.toFixed(2)} mi` : 'N/A',
//           batteryLevel: lastValidRecord.attributes?.batteryLevel || 'N/A',
//           ignition: 'No',
//           charge: lastValidRecord.attributes?.charge ? 'Yes' : 'No',
//           archive: lastValidRecord.attributes?.archive ? 'Yes' : 'No',
//           distance: lastValidRecord.attributes?.distance ? `${lastValidRecord.attributes.distance.toFixed(2)} mi` : 'N/A',
//           totalDistance: lastValidRecord.attributes?.totalDistance ? `${lastValidRecord.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//           motion: lastValidRecord.attributes?.motion ? 'Yes' : 'No',
//           blocked: lastValidRecord.attributes?.blocked ? 'Yes' : 'No',
//           alarm1Status: lastValidRecord.attributes?.alarm1Status || 'N/A',
//           otherStatus: lastValidRecord.attributes?.otherStatus || 'N/A',
//           alarm2Status: lastValidRecord.attributes?.alarm2Status || 'N/A',
//           engineStatus: 'Off',
//           adc1: lastValidRecord.attributes?.adc1 ? `${lastValidRecord.attributes.adc1.toFixed(2)} V` : 'N/A'
//         });
//         processedData.push(currentGroup);
//       }

//       console.log("Grouped Data:", processedData);
//       // After processing all records, update the filtered rows
//       setFilteredRows(processedData);
//       setTotalResponses(processedData.length);
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false);  // Always stop loading after the operation
//   }
// };
// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);
//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Variable to track if we have encountered ignition = true
//     let ignitionFound = false;
//     let currentGroup = [];  // To store the current group of data
//     let lastValidRecord = {};  // Store the last valid (ignition = true) record
//     const processedData = [];

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON
//       console.log('Processed JSON Data:', jsonResponse);

//       // Loop through the JSON data
//       for (let data of jsonResponse) {
//         // Check if ignition is true for this record
//         if (data.attributes?.ignition === true) {
//           ignitionFound = true; // Start processing once ignition is true
//           currentGroup = []; // Start a new group
//           lastValidRecord = { ...data }; // Store the current valid record for later use
//         }

//         // Skip records where speed < 1 or distance < 1
//         if (data.speed < 1 || data.attributes?.distance < 1) {
//           continue;
//         }

//         // If ignition is false and there was no previous ignition, continue to next
//         if (data.attributes?.ignition === false && !ignitionFound) {
//           continue;
//         }

//         // If ignition is true, add the record to the current group
//         if (ignitionFound) {
//           currentGroup.push(data);
//         }

//         // If ignition is false, add the false record with all parameters to close the group
//         if (data.attributes?.ignition === false && ignitionFound) {
//           // Calculate sum distance and average speed for the group
//           const sumDistance = currentGroup.reduce((sum, record) => sum + (record.attributes?.distance || 0), 0);
//           const avgSpeed = currentGroup.reduce((sum, record) => sum + (record.speed || 0), 0) / currentGroup.length;

//           // Extract start and end latitude/longitude
//           const startLatitude = currentGroup[0].latitude || 'N/A';
//           const startLongitude = currentGroup[0].longitude || 'N/A';
//           const endLatitude = currentGroup[currentGroup.length - 1].latitude || 'N/A';
//           const endLongitude = currentGroup[currentGroup.length - 1].longitude || 'N/A';

//           // Extract start and end serverTime
//           const startTime = currentGroup[0].serverTime ? new Date(currentGroup[0].serverTime).toLocaleString() : 'N/A';
//           const endTime = currentGroup[currentGroup.length - 1].serverTime ? new Date(currentGroup[currentGroup.length - 1].serverTime).toLocaleString() : 'N/A';

//           // Create an aggregated object for the group
//           processedData.push({
//             deviceId: lastValidRecord.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[lastValidRecord.deviceId] || 'Unknown Device',
//             startLatitude: startLatitude,
//             startLongitude: startLongitude,
//             endLatitude: endLatitude,
//             endLongitude: endLongitude,
//             sumDistance: `${sumDistance.toFixed(2)} mi`,
//             avgSpeed: `${avgSpeed.toFixed(2)} mph`,
//             startTime: startTime,
//             endTime: endTime,
//             ignition: 'No', // Ignition is false here to close the group
//             charge: lastValidRecord.attributes?.charge ? 'Yes' : 'No',
//             archive: lastValidRecord.attributes?.archive ? 'Yes' : 'No',
//             totalDistance: `${lastValidRecord.attributes?.totalDistance.toFixed(2)} mi` || 'N/A',
//             motion: lastValidRecord.attributes?.motion ? 'Yes' : 'No',
//             blocked: lastValidRecord.attributes?.blocked ? 'Yes' : 'No',
//             alarm1Status: lastValidRecord.attributes?.alarm1Status || 'N/A',
//             otherStatus: lastValidRecord.attributes?.otherStatus || 'N/A',
//             alarm2Status: lastValidRecord.attributes?.alarm2Status || 'N/A',
//             engineStatus: 'Off',
//             adc1: lastValidRecord.attributes?.adc1 ? `${lastValidRecord.attributes.adc1.toFixed(2)} V` : 'N/A'
//           });

//           currentGroup = []; // Reset the group after pushing the aggregated record
//           ignitionFound = false; // Reset ignitionFound flag
//         }
//       }

//       // If there is any remaining group (i.e., the data ends with ignition true), process it
//       if (currentGroup.length > 0) {
//         // Calculate sum distance and average speed for the remaining group
//         const sumDistance = currentGroup.reduce((sum, record) => sum + (record.attributes?.distance || 0), 0);
//         const avgSpeed = currentGroup.reduce((sum, record) => sum + (record.speed || 0), 0) / currentGroup.length;

//         // Extract start and end latitude/longitude
//         const startLatitude = currentGroup[0].latitude || 'N/A';
//         const startLongitude = currentGroup[0].longitude || 'N/A';
//         const endLatitude = currentGroup[currentGroup.length - 1].latitude || 'N/A';
//         const endLongitude = currentGroup[currentGroup.length - 1].longitude || 'N/A';

//         // Extract start and end serverTime
//         const startTime = currentGroup[0].serverTime ? new Date(currentGroup[0].serverTime).toLocaleString() : 'N/A';
//         const endTime = currentGroup[currentGroup.length - 1].serverTime ? new Date(currentGroup[currentGroup.length - 1].serverTime).toLocaleString() : 'N/A';

//         // Create an aggregated object for the remaining group
//         processedData.push({
//           deviceId: lastValidRecord.deviceId || 'N/A',
//           deviceName: deviceIdToNameMap[lastValidRecord.deviceId] || 'Unknown Device',
//           startLatitude: startLatitude,
//           startLongitude: startLongitude,
//           endLatitude: endLatitude,
//           endLongitude: endLongitude,
//           sumDistance: `${sumDistance.toFixed(2)} mi`,
//           avgSpeed: `${avgSpeed.toFixed(2)} mph`,
//           startTime: startTime,
//           endTime: endTime,
//           ignition: 'No',
//           charge: lastValidRecord.attributes?.charge ? 'Yes' : 'No',
//           archive: lastValidRecord.attributes?.archive ? 'Yes' : 'No',
//           totalDistance: `${lastValidRecord.attributes?.totalDistance.toFixed(2)} mi` || 'N/A',
//           motion: lastValidRecord.attributes?.motion ? 'Yes' : 'No',
//           blocked: lastValidRecord.attributes?.blocked ? 'Yes' : 'No',
//           alarm1Status: lastValidRecord.attributes?.alarm1Status || 'N/A',
//           otherStatus: lastValidRecord.attributes?.otherStatus || 'N/A',
//           alarm2Status: lastValidRecord.attributes?.alarm2Status || 'N/A',
//           engineStatus: 'Off',
//           adc1: lastValidRecord.attributes?.adc1 ? `${lastValidRecord.attributes.adc1.toFixed(2)} V` : 'N/A'
//         });
//       }

//       console.log("Aggregated Data:", processedData);
//       // After processing all records, update the filtered rows
//       setFilteredRows(processedData);
//       setTotalResponses(processedData.length);
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false);  // Always stop loading after the operation
//   }
// };
// const fetchData = async (url) => {
//   console.log('Fetching report...');
//   // setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//       responseType: 'blob', // Downloading as binary data
//     });

//     // Log the content type of the response
//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON

//       // Process the JSON response
//       console.log('Processed JSON Data:', jsonResponse);

//       // Filter the JSON data (skip until ignition=true, and filter speed and distance)
//       let ignitionStarted = false;
//       let filteredJsonData = [];
//       let group = [];
//       let groupedData = [];
//       let previousSpeed = null; // Track the previous speed
//       let skipNext = false; // Flag to skip the next record

//       jsonResponse.forEach((data, index) => {
//         if (!ignitionStarted && data.attributes?.ignition === true) {
//           ignitionStarted = true;
//           group.push(data); // Start the first group with ignition = true
//           previousSpeed = data.speed; // Initialize previous speed
//         } else if (ignitionStarted) {
//           // Skip records where speed < 1 or distance < 1
//           if (data.speed < 1 || data.attributes?.distance < 1) {
//             return; // Skip the record if speed or distance is less than 1
//           }

//           if (data.attributes?.distance >= 1) {
            
//             group.push(data);
//             previousSpeed = data.speed; // Update previous speed
//           }
//           if (data.attributes?.ignition === false) {
//             // End the current group when ignition is false
//             groupedData.push(group);
//             group = []; // Reset group for the next segment
//             ignitionStarted = false; // Stop grouping until ignition = true
//           }
//         }
//       });

//       // If the last group was still open, add it
//       if (group.length > 0) {
//         groupedData.push(group);
//       }

//       console.log('Grouped Data:', groupedData);

//       // Process the grouped data for display
//       const processedData = groupedData.map((group, index) => {
//         return group.map((data) => ({
//           deviceId: data.deviceId || 'N/A',
//           deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
//           eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//           latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
//           longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
//           speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
//           address: data.address || 'Show Address',
//           course: data.course > 0 ? '↑' : '↓',
//           altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
//           accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
//           valid: data.valid ? 'Yes' : 'No',
//           protocol: data.protocol || 'N/A',
//           deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
//           serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
//           fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
//           geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
//           satellites: data.attributes?.sat || 'N/A',
//           RSSI: data.attributes?.rssi || 'N/A',
//           odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
//           batteryLevel: data.attributes?.batteryLevel || 'N/A',
//           ignition: data.attributes?.ignition ? 'Yes' : 'No',
//           charge: data.attributes?.charge ? 'Yes' : 'No',
//           archive: data.attributes?.archive ? 'Yes' : 'No',
//           distance: data.attributes?.distance || 'N/A',

//           // distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
//           totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//           motion: data.attributes?.motion ? 'Yes' : 'No',
//           blocked: data.attributes?.blocked ? 'Yes' : 'No',
//           alarm1Status: data.attributes?.alarm1Status || 'N/A',
//           otherStatus: data.attributes?.otherStatus || 'N/A',
//           alarm2Status: data.attributes?.alarm2Status || 'N/A',
//           engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//           adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A'
//         }));
//       });

//       // Flatten the grouped data and set it for display
//       setFilteredRows(processedData.flat());
//       setTotalResponses(filteredJsonData.length);

//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'report.xlsx'); // Save the file to the user's system

//       // Process the file to extract data
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const reportWorkbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = reportWorkbook.SheetNames[0];
//         const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
//         // Convert worksheet data to JSON
//         const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

//         console.log('Extracted JSON Data from Excel:', jsonData);

//         // Apply the same grouping logic to Excel data
//         let ignitionStarted = false;
//         let filteredJsonData = [];
//         let group = [];
//         let groupedData = [];
//         let previousSpeed = null; // Track the previous speed
//         let skipNext = false; // Flag to skip the next record

//         jsonData.forEach((data, index) => {
//           if (!ignitionStarted && data.attributes?.ignition === true) {
//             ignitionStarted = true;
//             group.push(data); // Start the first group with ignition = true
//             previousSpeed = data.speed; // Initialize previous speed
//           } else if (ignitionStarted) {
//             // Skip records where speed < 1 or distance < 1
//             if (data.speed < 1 || data.attributes?.distance < 1) {
//               return; // Skip the record if speed or distance is less than 1
//             }

//             if (data.attributes?.distance >= 1) {
//               // Skip if current speed is the same as the previous speed
//               // if (data.speed === previousSpeed) {
//               //   // Skip this record and the next one
//               //   skipNext = true;
//               //   return; // Skip the current record
//               // }

//               // // If the previous record was skipped, we should skip the current one too
//               // if (skipNext) {
//               //   skipNext = false; // Reset skip flag
//               //   return; // Skip this record
//               // }

//               // Add the current record to the group
//               group.push(data);
//               previousSpeed = data.speed; // Update previous speed
//             }
//           }
//         });

//         // If the last group was still open, add it
//         if (group.length > 0) {
//           groupedData.push(group);
//         }

//         console.log('Grouped Data from Excel:', groupedData);

//         // Process the grouped data for display
//         const processedEvents = groupedData.map((group, index) => {
//           return group.map(data => ({
//             deviceId: data.deviceId,
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
//             eventTime: new Date(data.fixTime).toLocaleString(),
//             latitude: `${data.latitude.toFixed(6)}°`,
//             longitude: `${data.longitude.toFixed(6)}°`,
//             speed: `${data.speed.toFixed(2)} mph`,
//             address: data.address,
//             course: data.course > 0 ? '↑' : '↓',
//             altitude: `${data.altitude.toFixed(2)} m`,
//             accuracy: `${data.accuracy.toFixed(2)}`,
//             valid: data.valid ? 'Yes' : 'No'
//           }));
//         });

//          setFilteredRows(processedEvents.flat());
//       };

//       reader.readAsArrayBuffer(blob); // Read the blob data
//     }

//   } catch (error) {
//     console.error('Error fetching data:', error);
//     setLoading(false);
//   }
// };
const fetchData = async (url) => {
  console.log('Fetching report...');
   setLoading(true);

  try {
    const username = "schoolmaster";
    const password = "123456";
    const token = btoa(`${username}:${password}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
      responseType: 'blob', // Downloading as binary data
    });

    // Log the content type of the response
    console.log('Content-Type:', response.headers['content-type']);

    const deviceIdToNameMap = devices.reduce((acc, device) => {
      acc[device.id] = device.name; // Use device.id and device.name as key-value pair
      return acc;
    }, {});

    // Handle JSON response
    if (response.headers['content-type'] === 'application/json') {
      const text = await response.data.text(); // Convert Blob to text
      console.log('JSON Response:', text); // Log JSON response
      const jsonResponse = JSON.parse(text); // Parse JSON

      // Process the JSON response
      console.log('Processed JSON Data:', jsonResponse);

      let ignitionStarted = false;
      let group = [];
      let groupedData = [];

      jsonResponse.forEach((data) => {
        if (!ignitionStarted && data.attributes?.ignition === true) {
          // Start a new group when ignition is true
          ignitionStarted = true;
          group.push(data); // Add first record to the group
        } else if (ignitionStarted) {
          // Keep adding records to the group while ignition is true
          if (data.attributes?.ignition === false) {
            // End current group when ignition is false
            groupedData.push(group);
            group = []; // Reset the group for the next segment
            ignitionStarted = false; // Stop grouping until ignition is true
          } else {
            // If ignition is still true, keep adding data to the current group
            group.push(data);
          }
        }
      });

      // If the last group was still open, push it to the groupedData
      if (group.length > 0) {
        groupedData.push(group);
      }

      console.log('Grouped Data:', groupedData);

      // Process the grouped data for display
      // const processedData = groupedData.map((group) => {
      //   // Take the first and last object from the group
      //   const startData = group[0]; // First data object in the group
      //   const endData = group[group.length - 1]; // Last data object in the group

      //   // Map the processed data for this group into a single row
      //   return {
      //     deviceId: startData.deviceId || 'N/A',
      //     deviceName: deviceIdToNameMap[startData.deviceId] || 'Unknown Device',
      //     startTime: startData.serverTime ? new Date(startData.serverTime).toLocaleString() : 'N/A',
      //     endTime: endData.serverTime ? new Date(endData.serverTime).toLocaleString() : 'N/A',

      //     // Latitude and Longitude from first and last objects in the group
      //     startLatitude: startData.latitude?.toFixed(6) || 'N/A',
      //     startLongitude: startData.longitude?.toFixed(6) || 'N/A',
      //     endLatitude: endData.latitude?.toFixed(6) || 'N/A',
      //     endLongitude: endData.longitude?.toFixed(6) || 'N/A',

      //     startSpeed: startData.speed ? `${startData.speed.toFixed(2)} mph` : 'N/A',
      //     endSpeed: endData.speed ? `${endData.speed.toFixed(2)} mph` : 'N/A',
      //     address: endData.address || 'Show Address',
      //     course: endData.course > 0 ? '↑' : '↓',
      //     altitude: `${endData.altitude?.toFixed(2)} m` || 'N/A',
      //     accuracy: `${endData.accuracy?.toFixed(2)}` || 'N/A',
      //     valid: endData.valid ? 'Yes' : 'No',
      //     protocol: endData.protocol || 'N/A',
      //     totalDistance: endData.attributes?.totalDistance ? `${endData.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
      //     motion: endData.attributes?.motion ? 'Yes' : 'No',
      //     blocked: endData.attributes?.blocked ? 'Yes' : 'No',
      //     ignition: endData.attributes?.ignition ? 'Yes' : 'No',
      //     batteryLevel: endData.attributes?.batteryLevel || 'N/A',
      //     odometer: endData.attributes?.odometer ? `${endData.attributes.odometer.toFixed(2)} mi` : 'N/A',
      //     engineStatus: endData.attributes?.engineStatus ? 'On' : 'Off',
      //     charge: endData.attributes?.charge ? 'Yes' : 'No',
      //     alarm1Status: endData.attributes?.alarm1Status || 'N/A',
      //     alarm2Status: endData.attributes?.alarm2Status || 'N/A',
      //     geofences: endData.geofenceIds ? endData.geofenceIds.join(', ') : 'None',
      //   };
      // });

      // // Flatten the grouped data and set it for display
      // setFilteredRows(processedData);
      const processedData = groupedData.map((group) => {
        // Calculate the total distance for the current group
        const totalDistanceInGroup = group.reduce((sum, data) => {
          return sum + (data.attributes?.distance || 0);
        }, 0);
      
        // Take the first and last object from the group
        const startData = group[0]; // First data object in the group
        const endData = group[group.length - 1]; // Last data object in the group
      
        // Map the processed data for this group into a single row
        return {
          deviceId: startData.deviceId || 'N/A',
          deviceName: deviceIdToNameMap[startData.deviceId] || 'Unknown Device',
          startTime: startData.serverTime ? new Date(startData.serverTime).toLocaleString() : 'N/A',
          endTime: endData.serverTime ? new Date(endData.serverTime).toLocaleString() : 'N/A',
      
          // Latitude and Longitude from first and last objects in the group
          startLatitude: startData.latitude?.toFixed(6) || 'N/A',
          startLongitude: startData.longitude?.toFixed(6) || 'N/A',
          endLatitude: endData.latitude?.toFixed(6) || 'N/A',
          endLongitude: endData.longitude?.toFixed(6) || 'N/A',
      
          startSpeed: startData.speed ? `${startData.speed.toFixed(2)} mph` : 'N/A',
          endSpeed: endData.speed ? `${endData.speed.toFixed(2)} mph` : 'N/A',
          address: endData.address || 'Show Address',
          course: endData.course > 0 ? '↑' : '↓',
          altitude: `${endData.altitude?.toFixed(2)} m` || 'N/A',
          accuracy: `${endData.accuracy?.toFixed(2)}` || 'N/A',
          valid: endData.valid ? 'Yes' : 'No',
          protocol: endData.protocol || 'N/A',
          totalDistance: endData.attributes?.totalDistance ? `${endData.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
          motion: endData.attributes?.motion ? 'Yes' : 'No',
          blocked: endData.attributes?.blocked ? 'Yes' : 'No',
          ignition: endData.attributes?.ignition ? 'Yes' : 'No',
          batteryLevel: endData.attributes?.batteryLevel || 'N/A',
          odometer: endData.attributes?.odometer ? `${endData.attributes.odometer.toFixed(2)} mi` : 'N/A',
          engineStatus: endData.attributes?.engineStatus ? 'On' : 'Off',
          charge: endData.attributes?.charge ? 'Yes' : 'No',
          alarm1Status: endData.attributes?.alarm1Status || 'N/A',
          alarm2Status: endData.attributes?.alarm2Status || 'N/A',
          geofences: endData.geofenceIds ? endData.geofenceIds.join(', ') : 'None',
      
          // Add the total distance for the group
          distance1: totalDistanceInGroup
        };
      });
      
      // Flatten the grouped data and set it for display
      setFilteredRows(processedData);
      
      setTotalResponses(jsonResponse.length);

    } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Handle Excel response
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'report.xlsx'); // Save the file to the user's system

      // Process the file to extract data
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const reportWorkbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = reportWorkbook.SheetNames[0];
        const reportWorksheet = reportWorkbook.Sheets[firstSheetName];
        
        // Convert worksheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(reportWorksheet);

        console.log('Extracted JSON Data from Excel:', jsonData);

        // Apply the same grouping logic to Excel data
        let ignitionStarted = false;
        let group = [];
        let groupedData = [];

        jsonData.forEach((data) => {
          if (!ignitionStarted && data.attributes?.ignition === true) {
            // Start a new group when ignition is true
            ignitionStarted = true;
            group.push(data); // Add first record to the group
          } else if (ignitionStarted) {
            // Keep adding records to the group while ignition is true
            if (data.attributes?.ignition === false) {
              // End current group when ignition is false
              groupedData.push(group);
              group = []; // Reset the group for the next segment
              ignitionStarted = false; // Stop grouping until ignition is true
            } else {
              // If ignition is still true, keep adding data to the current group
              group.push(data);
            }
          }
        });

        // If the last group was still open, push it to the groupedData
        if (group.length > 0) {
          groupedData.push(group);
        }

        console.log('Grouped Data from Excel:', groupedData);

        // Process the grouped data for display
        const processedEvents = groupedData.map((group) => {
          // Take the first and last object from the group
          const startData = group[0]; // First data object in the group
          const endData = group[group.length - 1]; // Last data object in the group

          // Map the processed data for this group into a single row
          return {
            deviceId: startData.deviceId,
            deviceName: deviceIdToNameMap[startData.deviceId] || 'Unknown Device',
            startTime: new Date(startData.serverTime).toLocaleString(),
            endTime: new Date(endData.serverTime).toLocaleString(),

            // Latitude and Longitude from first and last objects in the group
            startLatitude: startData.latitude?.toFixed(6) || 'N/A',
            startLongitude: startData.longitude?.toFixed(6) || 'N/A',
            endLatitude: endData.latitude?.toFixed(6) || 'N/A',
            endLongitude: endData.longitude?.toFixed(6) || 'N/A',

            startSpeed: `${startData.speed?.toFixed(2)} mph` || 'N/A',
            endSpeed: `${endData.speed?.toFixed(2)} mph` || 'N/A',
            address: endData.address,
            course: endData.course > 0 ? '↑' : '↓',
            altitude: `${endData.altitude?.toFixed(2)} m`,
            accuracy: `${endData.accuracy?.toFixed(2)}`,
            valid: endData.valid ? 'Yes' : 'No',
            totalDistance: endData.attributes?.totalDistance ? `${endData.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
            motion: endData.attributes?.motion ? 'Yes' : 'No',
            blocked: endData.attributes?.blocked ? 'Yes' : 'No',
            ignition: endData.attributes?.ignition ? 'Yes' : 'No',
            batteryLevel: endData.attributes?.batteryLevel || 'N/A',
            engineStatus: endData.attributes?.engineStatus ? 'On' : 'Off',
            
          };
        });
console.log("mygroupp",group);
        setFilteredRows(processedEvents);
      };

      reader.readAsArrayBuffer(blob); // Read the blob data
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    setLoading(false);
  }
  setLoading(false);
};






const options = devices.map((device) => ({
  value: device.id,
  label: device.name,
}));

const handleChange = (selectedOption) => {
  setSelectedDevice(selectedOption ? selectedOption.value : null);
};
const [searchText, setSearchText] = useState("");
const filteredDevices = Array.isArray(devices)
  ? devices.filter((device) =>
      device.name.toLowerCase().includes(searchText.toLowerCase())
    )
  : [];

const groupRowsByIgnition = (rows) => {
  let groupedRows = [];
  let currentGroup = [];

  rows.forEach((row, index) => {
    if (currentGroup.length === 0) {
      // Start the first group with the first row
      currentGroup.push(row);
    } else {
      // Check if we need to add to the current group or create a new one
      const lastRow = currentGroup[currentGroup.length - 1];
      const isSameIgnition = row.ignition === lastRow.ignition;

      if (isSameIgnition) {
        // Continue adding rows with the same ignition to the current group
        currentGroup.push(row);
      } else {
        // When ignition changes, push the current group and start a new one
        if (currentGroup.length > 1) { // Skip the group if it contains only one object
          groupedRows.push(currentGroup);
        }
        currentGroup = [row];
      }
    }

    // If it's the last row, push the current group (after checking its length)
    if (index === rows.length - 1 && currentGroup.length > 1) {
      groupedRows.push(currentGroup);
    }
  });

  // Create a new array with objects containing starttime, endtime, and summed distance
  const result = groupedRows.map(group => {
    if (group.length > 1) {
      const startObj = group[0];  // First object in the group
      const endObj = group[group.length - 1];  // Last object in the group

      // Log to debug and check the structure of each object in the group
      console.log('mineGroup:', group);
      
      // Sum all distances from first object to the last object in the group
      const totalDistance = group.reduce((sum, obj) => {
        // Check if the object has the expected structure
        if (obj  && obj.distance !== undefined) {
          const distance = obj.distance; // Access the distance
          console.log(`Summing distance: ${distance} from object with id: ${obj.id}`);
          return sum + distance;  // Sum the distances from each object
        } else {
          console.log('Invalid object structure or missing distance for object with id:', obj.id);
          return sum;  // If no valid distance, don't add anything
        }
      }, 0);
      // Create a new object for the group with the required details
      return {
        deviceName: startObj.deviceName || 'Unknown',  // From the first object
        startTime: startObj.serverTime,  // From the first object
        startLatitude: startObj.latitude,  // From the first object
        startLongitude: startObj.longitude,  // From the first object
        endTime: endObj.serverTime,  // From the last object
        endLatitude: endObj.latitude,  // From the last object
        endLongitude: endObj.longitude,  // From the last object
        totalDistance,  // Sum of all distances in the group
      };
    }
    return null;  // Skip groups with only one object
  }).filter(item => item !== null);  // Remove null values (groups with only one object)

  return groupedRows;
};

// Example usage with some test data


// Run the function
const groupedData = groupRowsByIgnition(sortedData);
console.log("Grouped Data11:", groupedData);

// Log the final result
// console.log(groupedRows);
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Trips 
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
    sx={{
      marginRight: "10px",
      width: "200px", // Smaller width
      '& .MuiOutlinedInput-root': {
        height: '36px', // Set a fixed height to reduce it
        padding: '0px', // Reduce padding to shrink height
      },
      '& .MuiInputLabel-root': {
        top: '-6px', // Adjust label position
        fontSize: '14px', // Slightly smaller label font
      }
    }}
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
    "&:hover": {
      fontWeight: "bolder", // Make text even bolder on hover
      backgroundColor: "rgb(85, 85, 85)", // Maintain background color on hover
    },
  }}
>
  <ImportExportIcon />
  Column Visibility
</Button>
         
         
         
         
{/* <Button variant="contained" color="error" onClick={handleExport}>
            Export
          </Button> */}
          <Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"TRIPS REPORT"} pdfFilename={"TripsReport.pdf"} excelFilename={"TripsReport.xlsx"}/>

        </div>
       
     <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <div
  style={{
    width: "250px",
    position: "relative",
    zIndex: "10",
    border: "1px solid #000", // Add a black border
    
  }}
>
  <Select
    options={options}
    value={options.find((option) => option.value === selectedDevice) || null}
    onChange={handleChange}
    placeholder="Select Device"
    isClearable
    styles={{
      control: (provided) => ({
        ...provided,
        border: "none", // Remove react-select's default border if necessary
        boxShadow: "none", // Remove default focus outline
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#000", // Set the dropdown arrow to black
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: "#000", // Set the clear icon to black
      }),
    }}
  />
</div>

      {/* <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      >
        <option value="">Select Group</option>
        {groups.map(group => (
          <option key={group.id} value={group.id}>{group.name}</option>
        ))}
      </select> */}

      <div style={{ marginRight: "10px", padding: "5px" }}>
        <label htmlFor="start-date">Start Date & Time:</label>
        <input
          id="start-date"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        
        <label htmlFor="end-date">End Date & Time:</label>
        <input
          id="end-date"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: "5px" }}
        />
      </div>

      <button
        onClick={handleShowClick}
        style={{
          padding: "5px 10px",
        }}
      >
        Show
      </button>

      {/* {apiUrl && (
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="api-url">Generated API URL:</label>
          <textarea
            id="api-url"
            rows="3"
            value={apiUrl}
            readOnly
            style={{ width: '100%', padding: '5px' }}
          ></textarea>
        </div>
      )} */}
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
                maxHeight: 500,
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
      {COLUMNS()
        .filter((col) => columnVisibility[col.accessor])
        .map((column) => (
          <TableCell
            key={column.accessor}
            align={column.align || 'left'}
            style={{
              minWidth: column.minWidth || '100px',
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
    {groupedData.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={COLUMNS().filter((col) => columnVisibility[col.accessor]).length}
          style={{
            textAlign: 'center',
            padding: '16px',
            fontSize: '16px',
            color: '#757575',
          }}
        >
          <h4>No Data Available</h4>
        </TableCell>
      </TableRow>
    ) : (
      groupedData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((group, groupIndex) =>
          group.map((row, index) => (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={row.deviceName + index + groupIndex} // Ensure uniqueness for the key
              onClick={() => handleRowSelect(page * rowsPerPage + index)}
              selected={row.isSelected}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                borderBottom: "none",
              }}
            >
              <TableCell
                padding="checkbox"
                style={{ borderRight: "1px solid #e0e0e0" }}
              >
                <Switch checked={row.isSelected} color="primary" />
              </TableCell>

              {/* Render the new properties of groupedData */}
              {COLUMNS()
                .filter((col) => columnVisibility[col.accessor])
                .map((column) => {
                  const value = row[column.accessor];  // Access directly since your data is flat
                  return (
                    <TableCell
                      key={column.accessor}
                      align={column.align || 'left'}
                      style={{
                        borderRight: "1px solid #e0e0e0",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        borderBottom: "none",
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                        fontSize: "smaller",
                      }}
                    >
                      {column.Cell ? column.Cell({ value }) : value}
                    </TableCell>
                  );
                })}
            </TableRow>
          ))
        )
    )}
  </TableBody>
</Table>

            </TableContainer>
            <StyledTablePagination>
  <TablePagination
    rowsPerPageOptions={[{ label: "All", value: -1 }, 10, 25, 100, 1000]}
    component="div"
    count={sortedData.length}
    rowsPerPage={rowsPerPage === sortedData.length ? -1 : rowsPerPage}
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
            {/* //</></div> */}
          </>
        )}
              <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={style}>
            {/* <h2></h2> */}
            <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h2 style={{ flexGrow: 1 }}>Column Visibility</h2>
      <IconButton onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Box>
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
          <Box sx={style}>
            {/* <h2>Edit Row</h2> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ flexGrow: 1 }}>Edit Row</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS()
              .slice(0, -1)
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
              <h2 style={{ flexGrow: 1 }}>Add Row</h2>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {COLUMNS()
              .slice(0, -1)
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>
        <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
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


