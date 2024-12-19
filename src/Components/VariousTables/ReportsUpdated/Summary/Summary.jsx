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
// import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
// import Select from "react-select";
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

// export const Summary = () => {
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
//         "https://schoolmanagement-4-pzsf.onrender.com/school/delete";
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
//     XLSX.writeFile(workbook, "Summary.xlsx");
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
//   const apiUrl = `https://rocketsalestracker.com/api/server`; // Ensure this is correct
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
//         "https://schoolmanagement-4-pzsf.onrender.com/parent/register",
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
//   // if (loading) return <p>Loading...</p>;
//   // if (error) return <p>Error: {error}</p>;
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

//   // const [startDate, setStartDate] = useState('');
//   // const [endDate, setEndDate] = useState('');
//   const [selectedDevice, setSelectedDevice] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState('');
//   const [apiUrl, setApiUrl] = useState('');

//   const handleShowClick = () => {
//   const formattedStartDate = formatToUTC(startDate);
//   const formattedEndDate = formatToUTC(endDate);

//   if (!formattedStartDate || !formattedEndDate || !selectedDevice || !selectedNotification) {
//     alert('Please fill all fields');
//     return;
//   }

//   // Construct the API URL
//   const url = `
// https://rocketsalestracker.com/api/reports/summary?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&daily=${encodeURIComponent(daily)}&deviceId=${encodeURIComponent(selectedDevice)}&groupId=${encodeURIComponent(selectedGroup)}`;
  
//   setApiUrl(url); // Update the state with the generated URL
//   fetchData(url); // Call fetchData with the generated URL
// };
// const formatToUTC = (localDateTime) => {
//   if (!localDateTime) return '';
//   const localDate = new Date(localDateTime);
//   const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//   return utcDate.toISOString();
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

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON

//       // Process the JSON data for events
//       const processedEvents = jsonResponse.map(event => ({
//         id: event.id || 'N/A',
//         deviceId: event.deviceId || 'N/A',
//         deviceName: event.deviceName || 'N/A',
//         distance: event.distance || 0,
//         averageSpeed: event.averageSpeed || 0,
//         maxSpeed: event.maxSpeed || 0,
//         spentFuel: event.spentFuel || 0,
//         startOdometer: event.startOdometer || 0,
//         endOdometer: event.endOdometer || 0,
//         startTime: event.startTime ? new Date(event.startTime).toLocaleString() : 'N/A', // Format the date
//         endTime: event.endTime ? new Date(event.endTime).toLocaleString() : 'N/A', // Format the date
//         engineHours: event.engineHours || 0,
//         type: event.type || 'Unknown', // Process the 'type' field
//         eventTime: event.eventTime ? new Date(event.eventTime).toLocaleString() : 'N/A', // Format the date
//         geofenceId: event.geofenceId || 'None',
//         maintenanceId: event.maintenanceId || 'None',
//         positionId: event.positionId || 'None',
//         attributes: event.attributes || {},
//       }));
      

//       console.log('Processed Event Data:', processedEvents);

//       // Set the filtered rows and the total responses
//       setFilteredRows(processedEvents);
//       setTotalResponses(processedEvents.length);

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
//         const processedEvents = jsonData.map(event => ({
//           id: event.id,
//           deviceId: event.deviceId || 'N/A',
//           eventType: event.type || 'Unknown',
//           eventTime: event.eventTime ? new Date(event.eventTime).toLocaleString() : 'N/A',
//           geofenceId: event.geofenceId || 'None',
//           maintenanceId: event.maintenanceId || 'None',
//           positionId: event.positionId || 'None',
//           attributes: event.attributes || {},
//         }));

//         console.log('Processed Events:', processedEvents);

//         setFilteredRows(processedEvents);
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
//     alert('Failed to download or process report.');
//   } finally {
//     setLoading(false);
//   }
// };

//  const [selectedNotification, setSelectedNotification] = useState('');
//   const [daily, setDaily] = useState(false);

//   const notificationTypes = [
//     { type: 'Summary' },
//     { type: 'Daily Summary' }
//   ];

//   const handleNotificationChange = (e) => {
//     const selectedType = e.target.value;
//     setSelectedNotification(selectedType);

//     // Set daily to true if 'Daily Summary', else set to false
//     setDaily(selectedType === 'Daily Summary');
//   };
//   const options = devices.map((device) => ({
//     value: device.id,
//     label: device.name,
//   }));
  
//   const handleChange = (selectedOption) => {
//     setSelectedDevice(selectedOption ? selectedOption.value : null);
//   };
//   const groupOptions = groups.map((group) => ({
//     value: group.id,
//     label: group.name,
//   }));
  
//   // Handle change for groups
//   const handleGroupChange = (selectedOption) => {
//     setSelectedGroup(selectedOption ? selectedOption.value : null);
//   };
//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//        Summary 
//       </h1>
//       <div>
//       <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
//        <TextField
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
//              <Button
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
//           <div
//   style={{
//     width: "250px",
//     position: "relative",
//     zIndex: "10",
//     border: "1px solid #000", // Add a black border
//     marginLeft:"8px"
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
// <div style={{
   
//     marginLeft:"8px"
//   }}>
//       <select
//         value={selectedNotification}
//         onChange={handleNotificationChange}
//         style={{ marginRight: '10px',paddingTopTop:'7px',paddingBottom:'7px', padding: '5px' }}
//       >
//         <option value="">Select Notification Type</option>
//         {notificationTypes.map((notification) => (
//           <option key={notification.type} value={notification.type}>
//             {notification.type}
//           </option>
//         ))}
//       </select>


//     </div>
//         </div>
       
//      <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         marginBottom: "10px",
//       }}
//     >
     
     


// <div
//       style={{
//         width: "250px",
//         position: "relative",
//         zIndex: "10",
//         border: "1px solid #000",
//         // borderRadius: "4px", // Optional rounded corners
//       }}
//     >
//       <Select
//         options={groupOptions}
//         value={groupOptions.find((option) => option.value === selectedGroup) || null}
//         onChange={handleGroupChange}
//         placeholder="Select Group"
//         isClearable
//         styles={{
//           control: (provided) => ({
//             ...provided,
//             border: "none", // Remove react-select's default border
//             boxShadow: "none", // Remove focus outline
//           }),
//           dropdownIndicator: (provided) => ({
//             ...provided,
//             color: "#000", // Black dropdown arrow
//           }),
//           clearIndicator: (provided) => ({
//             ...provided,
//             color: "#000", // Black clear icon
//           }),
//         }}
//       />
//     </div>

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
//                 maxHeight: 500,
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
//                 {/* {COLUMNS()
//                   .filter((col) => columnVisibility[col.accessor])
//                   .map((column) => {
//                     const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);

//                     return (
//                       <TableCell
//                         key={column.accessor}
//                         align={column.align || 'left'}
//                         style={{
//                           borderRight: "1px solid #e0e0e0",
//                           paddingTop: "4px",
//                           paddingBottom: "4px",
//                           borderBottom: "none",
//                           backgroundColor:
//                             index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                           fontSize: "smaller",
//                         }}
//                       >
//                         {column.Cell ? column.Cell({ value }) : value}
//                       </TableCell>
//                     );
//                   })} */}
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
//             <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
// import * as XLSX from 'xlsx'; // To process and convert the excel file to JSON
//import { TextField } from '@mui/material';
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Select from "react-select";
import Export from "../../Export"
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

export const Summary = () => {
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
  //   XLSX.writeFile(workbook, "Summary.xlsx");
  // };
  console.log("filteredRows in SUMMARY", filteredRows);

   const handleExport = async () => {
  
      // Define fields to exclude and the desired header names
      const excludedFields = ["isSelected", ];

      //backened
      // deviceName	startTime	startLatitude	startLongitude	startOdometer	endTime	endLatitude
      // 	endLongitude	endOdometer	distance1	events
      //for table
      //Device Name	Start Time	Latitude	Longitude	Start Odometer	End Time	
      // End Latitude	End Longitude	End Odometer	Distance (km)

      const headerOverrides = {
        deviceName: "DEVICE NAME",
        startTime:"START TIME",
        startLatitude:"START LATITUDE",
        startLongitude:"START LONGITUDE",
        startOdometer:"START ODOMETER",
        endTime:"END TIME",
        	endLatitude:"END LATITUDE",
        	endLongitude:"END LONGITUDE",
        	endOdometer:"END ODOMETER",
          distance1:"DISTANCE"
      };
  
     // Define the desired order of fields
     const fieldOrder = [
      "deviceName",
      "startTime",
      "startLatitude",
      "startLongitude",
      "startOdometer",
      "endTime",
      "endLatitude",
    	"endLongitude",
      "endOdometer",
      "distance1",
    ];
  
    // Filter, map, and reorder data
    const dataToExport = filteredRows.map((row) => {
      const filteredRow = {};
      for (const field of fieldOrder) {
        if (!excludedFields.includes(field) && row[field] !== undefined) {
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
      link.download = "Summary.xlsx";
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

//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name;
//       return acc;
//     }, {});

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text();
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text);

//       console.log('Processed JSON Data:', jsonResponse);

//       let startStoring = false;
//       const filteredData = jsonResponse.filter((data) => {
//         if (data.attributes?.ignition) {
//           startStoring = true; // Start storing records from this point onward
//         }
//         return startStoring;
//       });

//       const processedData = filteredData.map(data => ({
//         deviceId: data.deviceId || 'N/A',
//         deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
//         odometer: data.attributes?.odometer|| 'N/A',
//         // odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
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
//         adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
//       }));
      
      

//       console.log('Filtered and Processed Data:', processedData);

//       // Grouping the data by serverTime date
//       const groupedDataMap = processedData.reduce((acc, record) => {
//         const dateKey = record.serverTime.split(',')[0]; // Extract the date part
//         if (!acc[dateKey]) {
//           acc[dateKey] = []; // Initialize an array for this date
//         }
//         acc[dateKey].push(record);
//         return acc;
//       }, {});

//       // Convert the map to an array of arrays
//       const groupedData = Object.values(groupedDataMap);

//       console.log('Grouped Data:', groupedData);

//       setFilteredRows(groupedData); // Update the state with grouped data
//       setTotalResponses(groupedData.length); // Number of groups
//     } else {
//       throw new Error('Unexpected content type: ' + response.headers['content-type']);
//     }
//   } catch (error) {
//     console.error('Error fetching the report:', error);
//     alert("Please select device and date");
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

//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Mapping device IDs to names
//       return acc;
//     }, {});

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text); // Parse JSON response

//       console.log('Processed JSON Data:', jsonResponse);

//       let startStoring = false;
//       const filteredData = jsonResponse.filter((data) => {
//         if (data.attributes?.ignition) {
//           startStoring = true; // Start storing records from this point onward
//         }
//         return startStoring;
//       });

//       const processedData = filteredData.map(data => ({
//         deviceId: data.deviceId || 'N/A',
//         deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
//         odometer: data.attributes?.odometer || 'N/A',
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
//         adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
//       }));

//       console.log('Filtered and Processed Data:', processedData);

//       // Grouping the data by serverTime date
//       const groupedDataMap = processedData.reduce((acc, record) => {
//         const dateKey = record.serverTime.split(',')[0]; // Extract the date part
//         if (!acc[dateKey]) {
//           acc[dateKey] = []; // Initialize an array for this date
//         }
//         acc[dateKey].push(record);
//         return acc;
//       }, {});

//       // Convert the map to an array of arrays
//       const groupedData = Object.values(groupedDataMap);

//       console.log('Grouped Data:', groupedData);

//       setFilteredRows(groupedData); // Update the state with grouped data
//       setTotalResponses(groupedData.length); // Number of groups
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

//         // Grouping the processed events by serverTime date
//         const groupedEventsMap = processedEvents.reduce((acc, record) => {
//           const dateKey = record.serverTime.split(',')[0]; // Extract the date part
//           if (!acc[dateKey]) {
//             acc[dateKey] = []; // Initialize an array for this date
//           }
//           acc[dateKey].push(record);
//           return acc;
//         }, {});

//         // Convert the map to an array of arrays
//         const groupedEvents = Object.values(groupedEventsMap);

//         console.log('Grouped Events:', groupedEvents);

//         setFilteredRows(groupedEvents); // Update the state with grouped data
//         setOriginalRows(groupedEvents); // Optionally store the original rows as well
//         setTotalResponses(groupedEvents.length); // Number of groups

//         // Optionally export the processed data back to an Excel file
//         const outputWorksheet = XLSX.utils.json_to_sheet(processedEvents);
//         const outputWorkbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Processed Report');

//         // Trigger file download
//         XLSX.writeFile(outputWorkbook, 'processed_report.xlsx');
//       };

//       reader.readAsArrayBuffer(blob); // Read the Blob as an ArrayBuffer for XLSX parsing
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false); // Stop the loading indicator
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

//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Mapping device IDs to names
//       return acc;
//     }, {});

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text); // Parse JSON response

//       console.log('Processed JSON Data:', jsonResponse);

//       let startStoring = false;
//       let currentDateGroup = [];

//       // Grouping the data by serverTime date and applying ignition filtering logic
//       const groupedDataMap = jsonResponse.reduce((acc, data) => {
//         const dateKey = new Date(data.serverTime).toLocaleDateString(); // Extract the date part

//         if (!acc[dateKey]) {
//           acc[dateKey] = []; // Initialize an array for this date
//         }

//         // Only start storing records once ignition is true
//         if (data.attributes?.ignition && !startStoring) {
//           startStoring = true; // Start storing from the first ignition = true
//         }

//         // Store the record if ignition is true or after ignition is true
//         if (startStoring) {
//           const processedRecord = {
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
//             odometer: data.attributes?.odometer || 'N/A',
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
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
//           };

//           acc[dateKey].push(processedRecord);
//         }

//         // Stop storing records once we encounter the last ignition = true
//         if (data.attributes?.ignition && startStoring) {
//           startStoring = false; // Stop storing after the last ignition = true
//         }

//         return acc;
//       }, {});

//       // Convert the map to an array of arrays
//       const groupedData = Object.values(groupedDataMap);

//       console.log('Grouped Data:', groupedData);

//       setFilteredRows(groupedData); // Update the state with grouped data
//       setTotalResponses(groupedData.length); // Number of groups
//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response (similar to the original code)
//       // The code for processing Excel files remains the same, you can add similar logic for ignition filtering here as well
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false); // Stop the loading indicator
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

//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Mapping device IDs to names
//       return acc;
//     }, {});

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text); // Parse JSON response

//       console.log('Processed JSON Data:', jsonResponse);

//       let startStoring = false;

//       // Grouping the data by serverTime date and applying ignition filtering logic
//       const groupedDataMap = jsonResponse.reduce((acc, data) => {
//         const dateKey = new Date(data.serverTime).toLocaleDateString(); // Extract the date part

//         if (!acc[dateKey]) {
//           acc[dateKey] = []; // Initialize an array for this date
//         }

//         // Only start storing records once ignition is true
//         if (data.attributes?.ignition && !startStoring) {
//           startStoring = true; // Start storing from the first ignition = true
//         }

//         // Store the record if ignition is true or after ignition is true
//         if (startStoring) {
//           const processedRecord = {
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
//             odometer: data.attributes?.odometer || 'N/A',
//             batteryLevel: data.attributes?.batteryLevel || 'N/A',
//             ignition: data.attributes?.ignition ? 'Yes' : 'No',
//             charge: data.attributes?.charge ? 'Yes' : 'No',
//             archive: data.attributes?.archive ? 'Yes' : 'No',
//             distance: data.attributes?.distance || 'N/A',
//             totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
//             motion: data.attributes?.motion ? 'Yes' : 'No',
//             blocked: data.attributes?.blocked ? 'Yes' : 'No',
//             alarm1Status: data.attributes?.alarm1Status || 'N/A',
//             otherStatus: data.attributes?.otherStatus || 'N/A',
//             alarm2Status: data.attributes?.alarm2Status || 'N/A',
//             engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
//           };

//           acc[dateKey].push(processedRecord);
//         }

//         // Stop storing records once we encounter the last ignition = true
//         if (data.attributes?.ignition && startStoring) {
//           startStoring = false; // Stop storing after the last ignition = true
//         }

//         return acc;
//       }, {});
//       console.log("groupedDataMap",groupedDataMap);
//       // Now process each group and create a single object for each date group
//       const summarizedData = Object.values(groupedDataMap).map(group => {
//         const startObject = group[0]; // First object in the group
//         const endObject = group[group.length - 1]; // Last object in the group

//         const summary = {
//           startLatitude: startObject.latitude,
//           startLongitude: startObject.longitude,
//           endLatitude: endObject.latitude,
//           endLongitude: endObject.longitude,
//           startOdometer: startObject.odometer,
//           endOdometer: endObject.odometer,
//           startTime: startObject.serverTime,
//           endTime: endObject.serverTime,
//           events: group, // Include all events in the group
//         };

//         return summary;
//       });

//       console.log('Summarized Data:', summarizedData);

//       setFilteredRows(summarizedData); // Update the state with summarized data
//       setTotalResponses(summarizedData.length); // Number of summarized groups
//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response (similar to the original code)
//       // The code for processing Excel files remains the same, you can add similar logic for ignition filtering here as well
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false); // Stop the loading indicator
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

//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Mapping device IDs to names
//       return acc;
//     }, {});

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text); // Parse JSON response

//       console.log('Processed JSON Data:', jsonResponse);

//       let startStoring = false;

//       // Grouping the data by serverTime date and applying ignition filtering logic
//       const groupedDataMap = jsonResponse.reduce((acc, data) => {
//         const dateKey = new Date(data.serverTime).toLocaleDateString(); // Extract the date part

//         if (!acc[dateKey]) {
//           acc[dateKey] = []; // Initialize an array for this date
//         }

//         // Only start storing records once ignition is true
//         if (data.attributes?.ignition && !startStoring) {
//           startStoring = true; // Start storing from the first ignition = true
//         }

//         // Store the record if ignition is true or after ignition is true
//         if (startStoring) {
//           const processedRecord = {
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
//             odometer: data.attributes?.odometer || 'N/A',
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
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
//           };

//           acc[dateKey].push(processedRecord);
//         }

//         // Stop storing records once we encounter the last ignition = true
//         if (data.attributes?.ignition && startStoring) {
//           startStoring = false; // Stop storing after the last ignition = true
//         }

//         return acc;
//       }, {});

//       // Now process each group and create a single object for each date group
//       const summarizedData = Object.values(groupedDataMap).map(group => {
//         const startObject = group[0]; // First object in the group
//         const endObject = group[group.length - 1]; // Last object in the group

//         // Initialize variables for summary data
//         let distance1 = 0; // To sum the distances
//         let totalDistance = 0; // To calculate total distance from ignition records

//         // Loop through the group and sum the distances for records with ignition "Yes"
//         for (let i = 0; i < group.length; i++) {
//           const current = group[i];

//           // Only sum distances if ignition is "Yes"
//           if (current.ignition === 'Yes') {
//             totalDistance += parseFloat(current.distance.replace(' mi', '')) || 0;
//           }
//         }

//         // Create the summarized object
//         const summary = {
//           deviceName: startObject.deviceName, // Add deviceName from the first object
//           startLatitude: startObject.latitude,
//           startLongitude: startObject.longitude,
//           endLatitude: endObject.latitude,
//           endLongitude: endObject.longitude,
//           startOdometer: startObject.odometer,
//           endOdometer: endObject.odometer,
//           startTime: startObject.serverTime,
//           endTime: endObject.serverTime,
//           distance1: totalDistance ? `${totalDistance.toFixed(2)} ` : 'N/A', // Total distance for ignition "Yes"
//           events: group, // Include all events in the group
//         };

//         return summary;
//       });

//       console.log('Summarized Data:', summarizedData);

//       setFilteredRows(summarizedData); // Update the state with summarized data
//       setTotalResponses(summarizedData.length); // Number of summarized groups
//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response (similar to the original code)
//       // The code for processing Excel files remains the same, you can add similar logic for ignition filtering here as well
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false); // Stop the loading indicator
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

//     console.log('Content-Type:', response.headers['content-type']);

//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name; // Mapping device IDs to names
//       return acc;
//     }, {});

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text);
//       const jsonResponse = JSON.parse(text); // Parse JSON response

//       console.log('Processed JSON Data:', jsonResponse);

//       let startStoring = false;

//       // Grouping the data by serverTime date and applying ignition filtering logic
//       const groupedDataMap = jsonResponse.reduce((acc, data) => {
//         const dateKey = new Date(data.serverTime).toLocaleDateString(); // Extract the date part

//         if (!acc[dateKey]) {
//           acc[dateKey] = []; // Initialize an array for this date
//         }

//         // Only start storing records once ignition is true
//         if (data.attributes?.ignition && !startStoring) {
//           startStoring = true; // Start storing from the first ignition = true
//         }

//         // Store the record if ignition is true or after ignition is true
//         if (startStoring) {
//           const processedRecord = {
//             deviceId: data.deviceId || 'N/A',
//             deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
//             odometer: data.attributes?.odometer || 'N/A',
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
//             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
//           };

//           acc[dateKey].push(processedRecord);
//         }

//         // Stop storing records once we encounter the last ignition = true
//         if (data.attributes?.ignition && startStoring) {
//           startStoring = false; // Stop storing after the last ignition = true
//         }

//         return acc;
//       }, {});


//       console.log("groupedDataMap",groupedDataMap);
//       // Now process each group and create a single object for each date group
//       const summarizedData = Object.values(groupedDataMap).map(group => {
//         const startObject = group[0]; // First object in the group
//         const endObject = group[group.length - 1]; // Last object in the group

//         // Initialize variables for summary data
//         let totalDistance = 0; // To calculate total distance from ignition records

//         // Loop through the group and sum the distances for records with ignition "Yes"
//         for (let i = 0; i < group.length; i++) {
//           const current = group[i];

//           // Only sum distances if ignition is "Yes"
//           if (current.ignition === 'Yes') {
//             totalDistance += parseFloat(current.distance.replace(' mi', '')) || 0;
//           }
//         }

//         // Convert the totalDistance to kilometers (divide by 1000)
//         const distance1 = totalDistance ? (totalDistance / 1000).toFixed(2) : 'N/A'; // Convert miles to kilometers

//         // Create the summarized object
//         const summary = {
//           deviceName: startObject.deviceName ||endObject.deviceName || 'N/A', // Add deviceName from the first object
//           startTime: startObject.serverTime,
//           startLatitude: startObject.latitude,
//           startLongitude: startObject.longitude,
//           startOdometer: startObject.odometer,
//           endTime: endObject.serverTime,
//           endLatitude: endObject.latitude,
//           endLongitude: endObject.longitude,
          
//           endOdometer: endObject.odometer,
        
         
//           distance1: distance1 ? `${distance1} km` : 'N/A', // Total distance in kilometers
//           events: group, // Include all events in the group
//         };

//         return summary;
//       });

//       console.log('Summarized Data:', summarizedData);

//       setFilteredRows(summarizedData); // Update the state with summarized data
//       setTotalResponses(summarizedData.length); // Number of summarized groups
//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel response (similar to the original code)
//       // The code for processing Excel files remains the same, you can add similar logic for ignition filtering here as well
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     setLoading(false); // Stop the loading indicator
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

    console.log('Content-Type:', response.headers['content-type']);

    const deviceIdToNameMap = devices.reduce((acc, device) => {
      acc[device.id] = device.name; // Mapping device IDs to names
      return acc;
    }, {});

    if (response.headers['content-type'] === 'application/json') {
      const text = await response.data.text(); // Convert Blob to text
      console.log('JSON Response:', text);
      const jsonResponse = JSON.parse(text); // Parse JSON response

      console.log('Processed JSON Data:', jsonResponse);

      let startStoring = false;

      // Grouping the data by serverTime date and applying ignition filtering logic
      const groupedDataMap = jsonResponse.reduce((acc, data) => {
        const dateKey = new Date(data.serverTime).toLocaleDateString(); // Extract the date part

        if (!acc[dateKey]) {
          acc[dateKey] = []; // Initialize an array for this date
        }

        // Only start storing records once ignition is true
        if (data.attributes?.ignition && !startStoring) {
          startStoring = true; // Start storing from the first ignition = true
        }

        // Store the record if ignition is true or after ignition is true
        if (startStoring) {
          const processedRecord = {
            deviceId: data.deviceId || 'N/A',
            deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
            eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
            latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
            longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
            speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
            address: data.address || 'Show Address',
            course: data.course > 0 ? '↑' : '↓',
            altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
            accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
            valid: data.valid ? 'Yes' : 'No',
            protocol: data.protocol || 'N/A',
            deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
            serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
            fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
            geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
            satellites: data.attributes?.sat || 'N/A',
            RSSI: data.attributes?.rssi || 'N/A',
            odometer: data.attributes?.odometer || 'N/A',
            batteryLevel: data.attributes?.batteryLevel || 'N/A',
            ignition: data.attributes?.ignition ? 'Yes' : 'No',
            charge: data.attributes?.charge ? 'Yes' : 'No',
            archive: data.attributes?.archive ? 'Yes' : 'No',
            distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
            totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
            motion: data.attributes?.motion ? 'Yes' : 'No',
            blocked: data.attributes?.blocked ? 'Yes' : 'No',
            alarm1Status: data.attributes?.alarm1Status || 'N/A',
            otherStatus: data.attributes?.otherStatus || 'N/A',
            alarm2Status: data.attributes?.alarm2Status || 'N/A',
            engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
            adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
          };

          acc[dateKey].push(processedRecord);
        }

        // Stop storing records once we encounter the last ignition = true
        if (data.attributes?.ignition && startStoring) {
          startStoring = false; // Stop storing after the last ignition = true
        }

        return acc;
      }, {});

      console.log("groupedDataMap", groupedDataMap);

      // Now process each group and create a single object for each date group
      const summarizedData = Object.values(groupedDataMap)
        .filter(group => group.length > 0) // Exclude empty groups
        .map(group => {
          const startObject = group[0]; // First object in the group
          const endObject = group[group.length - 1]; // Last object in the group

          // Initialize variables for summary data
          let totalDistance = 0; // To calculate total distance from ignition records

          // Loop through the group and sum the distances for records with ignition "Yes"
          for (let i = 0; i < group.length; i++) {
            const current = group[i];

            // Only sum distances if ignition is "Yes"
            if (current.ignition === 'Yes') {
              totalDistance += parseFloat(current.distance.replace(' mi', '')) || 0;
            }
          }

          // Convert the totalDistance to kilometers (divide by 1000)
          const distance1 = totalDistance ? (totalDistance / 1000).toFixed(2) : 'N/A'; // Convert miles to kilometers

          // Create the summarized object
          const summary = {
            deviceName: startObject.deviceName || endObject.deviceName || 'N/A', // Add deviceName from the first object
            startTime: startObject.serverTime,
            startLatitude: startObject.latitude,
            startLongitude: startObject.longitude,
            startOdometer: startObject.odometer,
            endTime: endObject.serverTime,
            endLatitude: endObject.latitude,
            endLongitude: endObject.longitude,
            endOdometer: endObject.odometer,
            distance1: distance1 ? `${distance1} km` : 'N/A', // Total distance in kilometers
            events: group, // Include all events in the group
          };

          return summary;
        });

      console.log('Summarized Data:', summarizedData);

      setFilteredRows(summarizedData); // Update the state with summarized data
      setTotalResponses(summarizedData.length); // Number of summarized groups
    } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Handle Excel response (similar to the original code)
      // The code for processing Excel files remains the same, you can add similar logic for ignition filtering here as well
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false); // Stop the loading indicator
  }
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

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
      Summary 
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
         
         
         
         
<Button variant="contained" color="error" onClick={handleExport}>
            Export
          </Button>
<Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"SUMMARY REPORT"} pdfFilename={"SummaryReport.pdf"} excelFilename={"SummaryReport.xlsx"}/>

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
  {sortedData.length === 0 ? (
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
    sortedData
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, index) => (
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          key={row.deviceId + index} // Ensure uniqueness for the key
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

          {COLUMNS()
            .filter((col) => columnVisibility[col.accessor])
            .map((column) => {
              const accessor = typeof column.accessor === 'string' ? column.accessor : '';
              let value = accessor.split('.').reduce((acc, part) => acc && acc[part], row);

              // Safely handle undefined values for columns that require toFixed
              if (value !== undefined && value !== null && !isNaN(value)) {
                value = value.toFixed(2); // Ensure toFixed() is only called on valid numbers
              }

              return (
                <TableCell
                  key={accessor}
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
                  {column.Cell ? column.Cell({ value }) : value || 'N/A'}
                </TableCell>
              );
            })}
        </TableRow>
      ))
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


