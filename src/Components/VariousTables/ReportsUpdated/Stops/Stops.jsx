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

// export const Stops = () => {
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
//     XLSX.writeFile(workbook, "Stops.xlsx");
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
//     const formattedStartDate = formatToUTC(startDate);
//     const formattedEndDate = formatToUTC(endDate);

//     if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
//       alert('Please fill all fields');
//       return;
//     }

//     // Construct the API URL
//     const url = `

// https://rocketsalestracker.com/api/reports/stops?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}`;
    
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

//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       const jsonResponse = JSON.parse(text); // Parse JSON

//       const processedData = jsonResponse.map(data => ({
//         deviceId: data.deviceId || 'N/A',
//         deviceName: data.deviceName || 'N/A',
//         distance: data.distance !== undefined ? `${data.distance.toFixed(2)} mi` : 'N/A',
//         averageSpeed: data.averageSpeed !== undefined ? `${data.averageSpeed.toFixed(2)} mph` : 'N/A',
//         maxSpeed: data.maxSpeed !== undefined ? `${data.maxSpeed.toFixed(2)} mph` : 'N/A',
//         spentFuel: data.spentFuel !== undefined ? `${data.spentFuel.toFixed(2)} L` : 'N/A',
//         startOdometer: data.startOdometer ? `${data.startOdometer.toFixed(2)} mi` : 'N/A',
//         endOdometer: data.endOdometer ? `${data.endOdometer.toFixed(2)} mi` : 'N/A',
//         startTime: data.startTime ? new Date(data.startTime).toLocaleString() : 'N/A',
//         endTime: data.endTime ? new Date(data.endTime).toLocaleString() : 'N/A',
//         latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',  // Include latitude
//         longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',  // Include longitude
//         address: data.address || 'N/A',  // Include address field
//         duration: data.duration ? `${(data.duration / 1000 / 60).toFixed(2)} min` : 'N/A',
        
//         engineHours: data.engineHours !== undefined ? data.engineHours : 'N/A',
//         positionId: data.positionId || 'N/A'  // Include positionId
//       }));

//       console.log('Processed Data:', processedData);

//       setFilteredRows(processedData);
//       setTotalResponses(processedData.length);

//     } else if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Handle Excel file as you did before
//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, 'Stops.xlsx');

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });

//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         const processedDataFromExcel = jsonData.map(data => ({
//           deviceId: data.deviceId || 'N/A',
//           deviceName: data.deviceName || 'N/A',
//           distance: data.distance !== undefined ? `${data.distance.toFixed(2)} mi` : 'N/A',
//           averageSpeed: data.averageSpeed||'N/A',
//           // averageSpeed: data.averageSpeed !== undefined ? `${data.averageSpeed.toFixed(2)} mph` : 'N/A',
//           maxSpeed: data.maxSpeed||'N/A',
//           spentFuel: data.spentFuel !== undefined ? `${data.spentFuel.toFixed(2)} L` : 'N/A',
//           startOdometer: data.startOdometer ? `${data.startOdometer.toFixed(2)} mi` : 'N/A',
//           endOdometer: data.endOdometer ? `${data.endOdometer.toFixed(2)} mi` : 'N/A',
//           startTime: data.startTime ? new Date(data.startTime).toLocaleString() : 'N/A',
//           endTime: data.endTime ? new Date(data.endTime).toLocaleString() : 'N/A',
//           latitude: data.latitude || 'N/A',
//           longitude: data.longitude||'N/A',
//           address: data.address || 'N/A',
//           duration: data.duration ? `${(data.duration / 1000 / 60).toFixed(2)} min` : 'N/A',
//           engineHours: data.engineHours !== undefined ? data.engineHours : 'N/A',
//           positionId: data.positionId || 'N/A'
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
//        Stops 
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
//         </div>
       
//         <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         marginBottom: "10px",
//       }}
//     >
//       <div
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

//       {/* <select
//         value={selectedGroup}
//         onChange={(e) => setSelectedGroup(e.target.value)}
//         style={{ marginRight: "10px", padding: "5px" }}
//       >
//         <option value="">Select Group</option>
//         {groups.map(group => (
//           <option key={group.id} value={group.id}>{group.name}</option>
//         ))}
//       </select> */}

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
            
//               {/* <Table
//   stickyHeader
//   aria-label="sticky table"
//   style={{ border: "1px solid black" }}
// >
//   <TableHead>
//     <TableRow
//       style={{
//         borderBottom: "1px solid black",
//         borderTop: "1px solid black",
//       }}
//     >
//       <TableCell
//         padding="checkbox"
//         style={{
//           borderRight: "1px solid #e0e0e0",
//           borderBottom: "2px solid black",
//         }}
//       >
//         <Switch
//           checked={selectAll}
//           onChange={handleSelectAll}
//           color="primary"
//         />
//       </TableCell>
//       {COLUMNS()
//         .filter((col) => columnVisibility[col.accessor])
//         .map((column) => (
//           <TableCell
//             key={column.accessor}
//             align={column.align}
//             style={{
//               minWidth: column.minWidth,
//               cursor: "pointer",
//               borderRight: "1px solid #e0e0e0",
//               borderBottom: "2px solid black",
//               padding: "4px 4px",
//               textAlign: "center",
//               fontWeight: "bold",
//             }}
//             onClick={() => requestSort(column.accessor)}
//           >
//             {column.Header}
//             {sortConfig.key === column.accessor ? (
//               sortConfig.direction === "ascending" ? (
//                 <ArrowUpwardIcon fontSize="small" />
//               ) : (
//                 <ArrowDownwardIcon fontSize="small" />
//               )
//             ) : null}
//           </TableCell>
//         ))}
//     </TableRow>
//   </TableHead>
//   <TableBody>
//     {sortedData.length === 0 ? (
//       <TableRow>
//         <TableCell
//           colSpan={COLUMNS().filter((col) => columnVisibility[col.accessor]).length}
//           style={{
//             textAlign: 'center',
//             padding: '16px',
//             fontSize: '16px',
//             color: '#757575',
//           }}
//         >
//           <h4>No Data Available</h4>
//         </TableCell>
//       </TableRow>
//     ) : (
//       sortedData
//         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//         .map((row, index) => (
//           <TableRow
//             hover
//             role="checkbox"
//             tabIndex={-1}
//             key={row.id}
//             onClick={() =>
//               handleRowSelect(page * rowsPerPage + index)
//             }
//             selected={row.isSelected}
//             style={{
//               backgroundColor:
//                 index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//               borderBottom: "none",
//             }}
//           >
//             <TableCell
//               padding="checkbox"
//               style={{ borderRight: "1px solid #e0e0e0" }}
//             >
//               <Switch checked={row.isSelected} color="primary" />
//             </TableCell>
//             {COLUMNS()
//               .filter((col) => columnVisibility[col.accessor])
//               .map((column) => {
//                 // Debug output
//                 // console.log(`Row data: ${JSON.stringify(row)}, Column accessor: ${column.accessor}`);

//                 // Access the correct value from the row
//                 const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);

//                 return (
//                   <TableCell
//                     key={column.accessor}
//                     align={column.align}
//                     style={{
//                       borderRight: "1px solid #e0e0e0",
//                       paddingTop: "4px",
//                       paddingBottom: "4px",
//                       borderBottom: "none",
//                       backgroundColor:
//                         index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
//                       fontSize: "smaller",
//                     }}
//                   >
//                     {column.Cell ? column.Cell({ value }) : value}
//                   </TableCell>
//                 );
//               })}
//           </TableRow>
//         ))
//     )}
//   </TableBody>
// </Table> */}
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
//          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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


// // const handleShowClick = () => {
// //   const formattedStartDate = formatToUTC(startDate);
// //   const formattedEndDate = formatToUTC(endDate);

// //   if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
// //     alert('Please fill all fields');
// //     return;
// //   }

// //   // Construct the API URL
// //   const url = `https://rocketsalestracker.com/api/reports/events?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&type=${encodeURIComponent(selectedNotification)}`;
  
// //   setApiUrl(url); // Update the state with the generated URL
// //   fetchData(url); // Call fetchData with the generated URL
// // };
// // const formatToUTC = (localDateTime) => {
// //   if (!localDateTime) return '';
// //   const localDate = new Date(localDateTime);
// //   const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
// //   return utcDate.toISOString();
// // };


// {/* <select
// value={selectedNotification}
// onChange={(e) => setSelectedNotification(e.target.value)}
// style={{ marginRight: '10px', padding: '5px' }}
// >
// <option value="">Select Notification Type</option>
// {notificationTypes.map((notification) => (
//   <option key={notification.type} value={notification.type}>
//     {notification.type}
//   </option>
// ))}
// </select> */}



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
import Export from "../../Export";
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

export const Stops = () => {
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
    // Apply text-based filtering
    if (text === "") {
      // If no text is provided, reset to original rows
      setFilteredRows(originalRows.map(row => ({ ...row, isSelected: false })));
    } else {
      // Filter based on text
      const filteredData = originalRows
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
    const url = `

https://rocketsalestracker.com/api/reports/route?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}`;
    
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
  
  //     let isIgnitionOffFound = false; // Flag to track when ignition "Off" is encountered
  //     let currentGroup = []; // To store events for the current group
  //     let groupedEvents = []; // To store all grouped events
  
  //     // Handle JSON response
  //     if (response.headers['content-type'] === 'application/json') {
  //       const text = await response.data.text(); // Convert Blob to text
  //       console.log('JSON Response:', text); // Log JSON response
  //       const jsonResponse = JSON.parse(text); // Parse JSON
  
  //       console.log('Processed JSON Data:', jsonResponse);
  
  //       // Process the JSON response
  //       const processedEvents = jsonResponse.map((data) => {
  //         if (data.attributes?.ignition === false && !isIgnitionOffFound) {
  //           // If ignition "Off" is found, start grouping from here
  //           isIgnitionOffFound = true;
  //           currentGroup = [ // Start a new group with ignition "Off"
  //             {
  //               deviceId: data.deviceId || 'N/A',
  //               deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
  //               eventTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
  //               latitude: data.latitude ? `${data.latitude.toFixed(6)}°` : 'N/A',
  //               longitude: data.longitude ? `${data.longitude.toFixed(6)}°` : 'N/A',
  //               speed: data.speed ? `${data.speed.toFixed(2)} mph` : 'N/A',
  //               address: data.address || 'Show Address',
  //               course: data.course > 0 ? '↑' : '↓',
  //               altitude: data.altitude ? `${data.altitude.toFixed(2)} m` : 'N/A',
  //               accuracy: data.accuracy ? `${data.accuracy.toFixed(2)}` : 'N/A',
  //               valid: data.valid ? 'Yes' : 'No',
  //               protocol: data.protocol || 'N/A',
  //               deviceTime: data.deviceTime ? new Date(data.deviceTime).toLocaleString() : 'N/A',
  //               serverTime: data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A',
  //               fixTime: data.fixTime ? new Date(data.fixTime).toLocaleString() : 'N/A',
  //               geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
  //               satellites: data.attributes?.sat || 'N/A',
  //               RSSI: data.attributes?.rssi || 'N/A',
  //               odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
  //               batteryLevel: data.attributes?.batteryLevel || 'N/A',
  //               ignition: data.attributes?.ignition ? 'Yes' : 'No',
  //               charge: data.attributes?.charge ? 'Yes' : 'No',
  //               archive: data.attributes?.archive ? 'Yes' : 'No',
  //               distance: data.attributes?.distance ? `${data.attributes.distance.toFixed(2)} mi` : 'N/A',
  //               totalDistance: data.attributes?.totalDistance ? `${data.attributes.totalDistance.toFixed(2)} mi` : 'N/A',
  //               motion: data.attributes?.motion ? 'Yes' : 'No',
  //               blocked: data.attributes?.blocked ? 'Yes' : 'No',
  //               alarm1Status: data.attributes?.alarm1Status || 'N/A',
  //               otherStatus: data.attributes?.otherStatus || 'N/A',
  //               alarm2Status: data.attributes?.alarm2Status || 'N/A',
  //               engineStatus: data.attributes?.engineStatus ? 'On' : 'Off',
  //               adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
  //             }
  //           ];
  //           return null; // Skip this record because we already started the group
  //         }
  
  //         if (isIgnitionOffFound) {
  //           // Add the event to the current group if ignition is "Off"
  //           currentGroup.push({
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
  //             adc1: data.attributes?.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : 'N/A',
  //           });
  
  //           // Check if ignition is "On", if so, finalize the current group
  //           if (data.attributes?.ignition === true) {
  //             groupedEvents.push(currentGroup); // Add the group to the list
  //             currentGroup = []; // Start a new group
  //             isIgnitionOffFound = false; // Reset the flag
  //           }
  //         }
  
  //         return null; // Skip records until ignition "off" is encountered
  //       }).filter(Boolean); // Remove null entries from the array
  
  //       // If the last group was not added (e.g., no "On" found after the last "Off"), add it
  //       if (currentGroup.length > 0) {
  //         groupedEvents.push(currentGroup);
  //       }
  // console.log("muy",groupedEvents)
  //       // Set the grouped events
  //       setFilteredRows(groupedEvents);
  //       setOriginalRows(groupedEvents.flat()); // If you want to store all records in a flat array too
  //       setTotalResponses(groupedEvents.length);
  
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
  
  //         let isIgnitionOffFound = false; // Reset for Excel file
  //         let currentGroup = [];
  //         let groupedEvents = [];
  
  //         // Process the data
  //         const processedEvents = jsonData.map(data => {
  //           if (data.attributes?.ignition === false && !isIgnitionOffFound) {
  //             // Skip until we find ignition off
  //             isIgnitionOffFound = true;
  //             currentGroup = [
  //               {
  //                 deviceId: data.deviceId,
  //                 deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
  //                 eventTime: new Date(data.fixTime).toLocaleString(),
  //                 latitude: `${data.latitude.toFixed(6)}°`,
  //                 longitude: `${data.longitude.toFixed(6)}°`,
  //                 speed: `${data.speed.toFixed(2)} mph`,
  //                 address: data.address || 'Show Address',
  //                 course: data.course > 0 ? '↑' : '↓',
  //                 altitude: `${data.altitude.toFixed(2)} m`,
  //                 accuracy: `${data.accuracy.toFixed(2)}`,
  //                 valid: data.valid ? 'Yes' : 'No',
  //                 protocol: data.protocol,
  //                 deviceTime: new Date(data.deviceTime).toLocaleString(),
  //                 serverTime: new Date(data.serverTime).toLocaleString(),
  //                 geofences: data.geofenceIds ? data.geofenceIds.join(', ') : 'None',
  //                 satellites: data.attributes.sat || '',
  //                 RSSI: data.attributes.rssi || '',
  //                 odometer: `${(data.attributes.odometer || 0).toFixed(2)} mi`,
  //                 batteryLevel: data.attributes.batteryLevel || '',
  //                 ignition: data.attributes.ignition ? 'Yes' : 'No',
  //                 charge: data.attributes.charge ? 'Yes' : 'No',
  //                 archive: data.attributes.archive ? 'Yes' : 'No',
  //                 distance: `${(data.attributes.distance || 0).toFixed(2)} mi`,
  //                 totalDistance: `${(data.attributes.totalDistance || 0).toFixed(2)} mi`,
  //                 motion: data.attributes.motion ? 'Yes' : 'No',
  //                 blocked: data.attributes.blocked ? 'Yes' : 'No',
  //                 alarm1Status: data.attributes.alarm1Status || '',
  //                 otherStatus: data.attributes.otherStatus || '',
  //                 alarm2Status: data.attributes.alarm2Status || '',
  //                 engineStatus: data.attributes.engineStatus ? 'On' : 'Off',
  //                 adc1: data.attributes.adc1 ? `${data.attributes.adc1.toFixed(2)} V` : ''
  //               }
  //             ];
  //             return null; // Skip this record because we already started the group
  //           }
  
  //           if (isIgnitionOffFound) {
  //             // Add the event to the current group if ignition is "Off"
  //             currentGroup.push({
  //               deviceId: data.deviceId,
  //               deviceName: deviceIdToNameMap[data.deviceId] || 'Unknown Device',
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
  
  //             // Check if ignition is "On", if so, finalize the current group
  //             if (data.attributes?.ignition === true) {
  //               groupedEvents.push(currentGroup); // Add the group to the list
  //               currentGroup = []; // Start a new group
  //               isIgnitionOffFound = false; // Reset the flag
  //             }
  //           }
  
  //           return null; // Skip records until ignition "off" is encountered
  //         }).filter(Boolean); // Remove null entries from the array
  
  //         // If the last group was not added (e.g., no "On" found after the last "Off"), add it
  //         if (currentGroup.length > 0) {
  //           groupedEvents.push(currentGroup);
  //         }
  
  //         console.log('Processed Events:', groupedEvents);
  //         setFilteredRows(groupedEvents);
  //         setOriginalRows(groupedEvents.flat()); // If you want to store all records in a flat array too
  //         setTotalResponses(groupedEvents.length);
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
  
  // const processGroupedEvents = (groupedEvents) => {
  //   const processedGroupedEvents = groupedEvents.map(group => {
  //     if (group.length === 0) return null; // Skip empty groups
      
  //     // Get the first and last object in the group
  //     const startEvent = group[0];
  //     const endEvent = group[group.length - 1];
      
  //     // Extract the necessary data from the start and end events
  //     const startLatitude = startEvent.latitude || 'N/A';
  //     const startLongitude = startEvent.longitude || 'N/A';
  //     const endLatitude = endEvent.latitude || 'N/A';
  //     const endLongitude = endEvent.longitude || 'N/A';
      
  //     const startOdometer = startEvent.odometer || 'N/A';
  //     const endOdometer = endEvent.odometer || 'N/A';
      
  //     // const startTime = new Date(startEvent.serverTime);
  //     // const endTime = new Date(endEvent.serverTime);
  //     const startTime = startEvent.serverTime||"invalid date";
  //     const endTime = endEvent.serverTime||"invalid date";
  //     // Calculate stop duration in minutes
  //     const stopDuration = Math.abs((endTime - startTime) / 60000); // Convert milliseconds to minutes
      
  //     // Extract the device name from the first event in the group
  //     const deviceName = startEvent.deviceName || 'Unknown Device';
  
  //     // Create the new object for the group with device name included
  //     const groupSummary = {
  //       deviceName,
  //       startLatitude,
  //       startLongitude,
  //       endLatitude,
  //       endLongitude,
  //       startOdometer,
  //       endOdometer,
  //       startTime: startTime.toLocaleString(),
  //       endTime: endTime.toLocaleString(),
  //       stopDuration: stopDuration, // Rounded to 2 decimal places
  //     };
      
  //     return groupSummary;
  //   }).filter(Boolean); // Remove any null values from the array
    
  //   return processedGroupedEvents;
  // };
  // Function to parse the date in the format "26/11/2024, 4:01:25 pm"
const parseDate = (dateString) => {
  const [datePart, timePart] = dateString.split(', ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [time, ampm] = timePart.split(' ');
  const [hour, minute, second] = time.split(':').map(Number);

  // Convert hour to 24-hour format
  let hours = hour;
  if (ampm === 'pm' && hours < 12) hours += 12; // Convert PM to 24-hour format
  if (ampm === 'am' && hours === 12) hours = 0; // Convert 12 AM to 00 hours

  return new Date(year, month - 1, day, hours, minute, second);
};

const processGroupedEvents = (groupedEvents) => {
  const processedGroupedEvents = groupedEvents.map(group => {
    if (group.length === 0) return null; // Skip empty groups
    
    // Get the first and last object in the group
    const startEvent = group[0];
    const endEvent = group[group.length - 1];
    
    // Extract the necessary data from the start and end events
    const startLatitude = startEvent.latitude || 'N/A';
    const startLongitude = startEvent.longitude || 'N/A';
    const endLatitude = endEvent.latitude || 'N/A';
    const endLongitude = endEvent.longitude || 'N/A';
    
    const startOdometer = startEvent.odometer || 'N/A';
    const endOdometer = endEvent.odometer || 'N/A';
    
    // Manually parse the server times
    const startTime = parseDate(startEvent.serverTime);
    const endTime = parseDate(endEvent.serverTime);
    
    // Check for valid Date objects
    if (isNaN(startTime) || isNaN(endTime)) {
      console.error('Invalid start or end time:', startEvent.serverTime, endEvent.serverTime);
      return null;
    }
    
    // Calculate stop duration in minutes (convert milliseconds to minutes)
    const stopDuration = Math.abs((endTime - startTime) / 60000); // Difference in minutes
    
    // Extract the device name from the first event in the group
    const deviceName = startEvent.deviceName || 'Unknown Device';
  
    // Create the new object for the group with device name included
    const groupSummary = {
      deviceName,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      startOdometer,
      endOdometer,
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      stopDuration: stopDuration.toFixed(2), // Rounded to 2 decimal places
    };
    
    return groupSummary;
  }).filter(Boolean); // Remove any null values from the array
  
  return processedGroupedEvents;
};

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
        acc[device.id] = device.name;
        return acc;
      }, {});
    
      let isIgnitionOffFound = false;
      let currentGroup = [];
      let groupedEvents = [];
    
      // Handle JSON response
      if (response.headers['content-type'] === 'application/json') {
        const text = await response.data.text(); // Convert Blob to text
        console.log('JSON Response:', text); // Log JSON response
        const jsonResponse = JSON.parse(text); // Parse JSON
    
        console.log('Processed JSON Data:', jsonResponse);
    
        const processedEvents = jsonResponse.map((data) => {
          if (data.attributes?.ignition === false && !isIgnitionOffFound) {
            isIgnitionOffFound = true;
            currentGroup = [
              {
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
                odometer: data.attributes?.odometer|| 'N/A',
                // odometer: data.attributes?.odometer ? `${data.attributes.odometer.toFixed(2)} mi` : 'N/A',
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
              }
            ];
            return null;
          }
    
          if (isIgnitionOffFound) {
            currentGroup.push({
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
              odometer: data.attributes?.odometer|| 'N/A',
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
            });
    
            if (data.attributes?.ignition === true) {
              groupedEvents.push(currentGroup);
              currentGroup = [];
              isIgnitionOffFound = false;
            }
          }
    
          return null;
        }).filter(Boolean); 
    
        if (currentGroup.length > 0) {
          groupedEvents.push(currentGroup);
        }
    
        // Process each group and create a summary object
        const finalProcessedEvents = processGroupedEvents(groupedEvents);
        console.log('Final Processed Events:', finalProcessedEvents);
    
        // Update the state with the processed data
        console.log('groupedEvents:',groupedEvents)
        setFilteredRows(finalProcessedEvents);
        setOriginalRows(groupedEvents.flat()); 
        setTotalResponses(finalProcessedEvents.length);
      } else {
        throw new Error('Unexpected content type: ' + response.headers['content-type']);
      }
    } catch (error) {
      console.error('Error fetching the report:', error);
      alert("Please select device and date");
    } finally {
      setLoading(false);
    }
  };
  
const options = devices.map((device) => ({
  value: device.id,
  label: device.name,
}));

const handleChange = (selectedOption) => {
  setSelectedDevice(selectedOption ? selectedOption.value : null);
};

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Stops 
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
         
<Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"STOPS REPORT"} pdfFilename={"StopsReport.pdf"} excelFilename={"StopsReport.xlsx"}/>

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
                maxHeight: 520,
                border: "1.5px solid black",
                borderRadius: "7px",
              }}
            >
            
              {/* <Table
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
            key={row.id}
            onClick={() =>
              handleRowSelect(page * rowsPerPage + index)
            }
            selected={row.isSelected}
            style={{
              backgroundColor:
                index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
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
                // Debug output
                // console.log(`Row data: ${JSON.stringify(row)}, Column accessor: ${column.accessor}`);

                // Access the correct value from the row
                const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);

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
                      fontSize: "smaller",
                    }}
                  >
                    {column.Cell ? column.Cell({ value }) : value}
                  </TableCell>
                );
              })}
          </TableRow>
        ))
    )}
  </TableBody>
</Table> */}
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
                onClick={() =>
                  handleRowSelect(page * rowsPerPage + index)
                }
                selected={row.isSelected}
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                  borderBottom: "none",
                }}
              >
                <TableCell
                  padding="checkbox"
                  style={{ borderRight: "1px solid #e0e0e0" }}
                >
                  <Switch checked={row.isSelected} color="primary" />
                </TableCell>
                {/* {COLUMNS()
                  .filter((col) => columnVisibility[col.accessor])
                  .map((column) => {
                    const value = column.accessor.split('.').reduce((acc, part) => acc && acc[part], row);

                    return (
                      <TableCell
                        key={column.accessor}
                        align={column.align || 'left'}
                        style={{
                          borderRight: "1px solid #e0e0e0",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          borderBottom: "none",
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
                          fontSize: "smaller",
                        }}
                      >
                        {column.Cell ? column.Cell({ value }) : value}
                      </TableCell>
                    );
                  })} */}
                  {COLUMNS()
  .filter((col) => columnVisibility[col.accessor])
  .map((column) => {
    // Ensure column.accessor is a string before calling split
    const accessor = typeof column.accessor === 'string' ? column.accessor : '';
    const value = accessor.split('.').reduce((acc, part) => acc && acc[part], row);

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
        {column.Cell ? column.Cell({ value }) : value}
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


// const handleShowClick = () => {
//   const formattedStartDate = formatToUTC(startDate);
//   const formattedEndDate = formatToUTC(endDate);

//   if (!formattedStartDate || !formattedEndDate || !selectedDevice) {
//     alert('Please fill all fields');
//     return;
//   }

//   // Construct the API URL
//   const url = `https://rocketsalestracker.com/api/reports/events?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&type=${encodeURIComponent(selectedNotification)}`;
  
//   setApiUrl(url); // Update the state with the generated URL
//   fetchData(url); // Call fetchData with the generated URL
// };
// const formatToUTC = (localDateTime) => {
//   if (!localDateTime) return '';
//   const localDate = new Date(localDateTime);
//   const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//   return utcDate.toISOString();
// };


{/* <select
value={selectedNotification}
onChange={(e) => setSelectedNotification(e.target.value)}
style={{ marginRight: '10px', padding: '5px' }}
>
<option value="">Select Notification Type</option>
{notificationTypes.map((notification) => (
  <option key={notification.type} value={notification.type}>
    {notification.type}
  </option>
))}
</select> */}