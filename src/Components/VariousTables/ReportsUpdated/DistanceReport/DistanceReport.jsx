// import React, { useState, useEffect, useContext, Component,useRef  } from "react";
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
// import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
// import Select from "react-select";
// //import { TextField } from '@mui/material';

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

// export const DistanceReport = () => {
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

 

//   const handleChangeRowsPerPage = (event) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage === -1 ? sortedData.length : newRowsPerPage); // Set to all rows if -1
//     setPage(0); // Reset to the first page
//   };
  
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
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

 

//   const handleExport = () => {
//     const dataToExport = filteredRows.map((row) => {
//       const { isSelected, ...rowData } = row;
//       return rowData;
//     });
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "DistanceReport.xlsx");
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

  

//   const handleModalClose = () => {
//     setEditModalOpen(false);
//     setAddModalOpen(false);
//     setModalOpen(false);
//     setFormData({});
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

 




 
  


 
//   const [error, setError] = useState(null);

// const [devices, setDevices] = useState([]); // Ensure devices is initialized as an empty array

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const response = await fetch('https://rocketsalestracker.com/api/devices', {
//           headers: {
//             'Authorization': 'Basic ' + btoa('schoolmaster:123456'),
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
  
//         const data = await response.json();
  
//         // Ensure that data is an array before setting it
//         if (Array.isArray(data)) {
//           setDevices(data);
//         } else {
//           console.error('Fetched data is not an array:', data);
//         }
//       } catch (err) {
//         console.error('Error fetching devices:', err);
//       }
//     };
  
//     fetchDevices();
//   }, []); // Make sure this runs only once on component mount
  
  
//   // Transform devices into options for React-Select
//   const options = devices.map((device) => ({
//     value: device.id,
//     label: device.name,
//   }));

//   const handleChange = (selectedOption) => {
//     setSelectedDevice(selectedOption ? selectedOption.value : null);
//   };

//   const [groups, setGroups] = useState([]);
  
//  // Convert groups into options for react-select
//  const groupOptions = groups.map((group) => ({
//   value: group.id,
//   label: group.name,
// }));

// // Handle change for groups
// const handleGroupChange = (selectedOption) => {
//   setSelectedGroup(selectedOption ? selectedOption.value : null);
// };
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

//     if (!formattedStartDate || !formattedEndDate || !selectedDevice || !selectedGroup) {
//       alert('Please fill all fields');
//       return;
//     }

//     // Construct the API URL
//     const url = `https://rocketsalestracker.com/api/reports/combined?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&deviceId=${encodeURIComponent(selectedDevice)}&groupId=${encodeURIComponent(selectedGroup)}`;
    
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
//   setLoading(true);

//   try {
//     const username = "schoolmaster";
//     const password = "123456";
//     const token = btoa(`${username}:${password}`);

//     // Make the GET request to fetch the data
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${token}`,
//       },
//     });

//     const responseData = response.data;

//     console.log("Fetched data:", responseData);

//     // Create a deviceId to deviceName map from the devices array
//     const deviceIdToNameMap = devices.reduce((acc, device) => {
//       acc[device.id] = device.name;
//       return acc;
//     }, {});

//     // Check if the data is an array and process only positions data
//     if (Array.isArray(responseData) && responseData.length > 0) {
//       const processedData = responseData.map((item) => {
//         const deviceName = deviceIdToNameMap[item.deviceId];

//         const processedPositions = Array.isArray(item.positions)
//           ? item.positions.map((position) => {
//               const positionDate = position.serverTime
//                 ? new Date(position.serverTime).toISOString().split("T")[0] // Extract date part
//                 : "N/A";

//               return {
//                 id: position.id,
//                 deviceId: item.deviceId,
//                 deviceName: deviceName,
//                 date: positionDate,
//                 serverTime: position.serverTime
//                   ? new Date(position.serverTime).toLocaleString()
//                   : "N/A",
//                 deviceTime: position.deviceTime
//                   ? new Date(position.deviceTime).toLocaleString()
//                   : "N/A",
//                 fixTime: position.fixTime
//                   ? new Date(position.fixTime).toLocaleString()
//                   : "N/A",
//                 latitude: position.latitude,
//                 longitude: position.longitude,
//                 distance: position.attributes?.distance || "N/A",
//                 speed: position.speed ? position.speed.toFixed(2) : "0.00",
//                 valid: position.valid,
//                 attributes: position.attributes,
//               };
//             })
//           : [];

//         return {
//           deviceId: item.deviceId,
//           deviceName: deviceName,
//           processedPositions,
//         };
//       });

//       console.log("Processed Position Data:", processedData);

//       // Group data by device and then by date
//       const groupedByDeviceAndDate = processedData.reduce((acc, device) => {
//         const { deviceId, deviceName, processedPositions } = device;

//         if (!acc[deviceId]) {
//           acc[deviceId] = { deviceName, recordsByDate: {} };
//         }

//         processedPositions.forEach((position) => {
//           const { date } = position;
//           if (!acc[deviceId].recordsByDate[date]) {
//             acc[deviceId].recordsByDate[date] = [];
//           }
//           acc[deviceId].recordsByDate[date].push(position);
//         });

//         return acc;
//       }, {});

//       console.log("Grouped Data by Device and Date:", groupedByDeviceAndDate);

//       // Process date-wise records to find ignition patterns
//       const processedIgnitionData = Object.entries(groupedByDeviceAndDate).map(
//         ([deviceId, { deviceName, recordsByDate }]) => {
//           const updatedRecordsByDate = Object.entries(recordsByDate).map(
//             ([date, positions]) => {
//               const ignitionFilteredPositions = [];
//               let collecting = false;
      
//               positions.forEach((position) => {
//                 const ignition =
//                   position.attributes?.ignition !== undefined
//                     ? position.attributes.ignition
//                     : null;
      
//                 if (ignition === true) {
//                   collecting = true;
//                   ignitionFilteredPositions.push(position);
//                 } else if (collecting && ignition === false) {
//                   ignitionFilteredPositions.push(position);
//                   collecting = false;
//                 } else if (collecting) {
//                   ignitionFilteredPositions.push(position);
//                 }
//               });
      
//               // Calculate the total distance for the current date
//               const totalDistance = ignitionFilteredPositions.reduce(
//                 (sum, pos) => sum + (parseFloat(pos.distance) || 0),
//                 0
//               );
      
//               return {
//                 date,
//                 positions: ignitionFilteredPositions,
//                 distance1: totalDistance, // Store the total distance
//               };
//             }
//           );
      
//           return {
//             deviceId,
//             deviceName,
//             recordsByDate: updatedRecordsByDate,
//           };
//         }
//       );
      
//       console.log("Processed Ignition Data with Total Distance:", processedIgnitionData);
      
//       // Update state with the processed data
//       setFilteredRows(processedIgnitionData);
      

      

//       // Update the total number of positions
//       setTotalResponses(
//         processedIgnitionData.reduce(
//           (total, device) =>
//             total +
//             device.recordsByDate.reduce(
//               (dateTotal, record) => dateTotal + record.positions.length,
//               0
//             ),
//           0
//         )
//       );
//     } else {
//       console.error("Expected an array but got:", responseData);
//       alert("Unexpected data format.");
//     }
//   } catch (error) {
//     console.error("Fetch data error:", error);
//     alert("Please select device, group, and date");
//   } finally {
//     setLoading(false);
//   }
// };
// const [searchText, setSearchText] = useState("");
// const [isOpen, setIsOpen] = useState(false);
// const dropdownRef = useRef();

// const filteredDevices = Array.isArray(devices)
//   ? devices.filter((device) =>
//       device.name.toLowerCase().includes(searchText.toLowerCase())
//     )
//   : [];

// const handleSelect = (deviceId) => {
//   setSelectedDevice(deviceId);
//   setIsOpen(false);
// };

// // Handle outside click to close the dropdown
// const handleClickOutside = (event) => {
//   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//     setIsOpen(false);
//   }
// };

// React.useEffect(() => {
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);


//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "80px" }}>
//        Device Status
//       </h1>
//       <div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             marginBottom: "10px",
//           }}
//         >
//           <TextField
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
//           <Button
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
       
//           <Button variant="contained" color="error" onClick={handleExport}>
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
    
//     <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
//   <div
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
//  <div
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

//         {/* {apiUrl && (
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
//       )}   */}
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
//                 {COLUMNS()
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
//                   })}
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
//        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
import TableFooter from "@mui/material/TableFooter";
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
// import { COLUMNS } from "./columns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
import Export from "./Export";
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
// const COLUMNS = () => [
 
//   {
//     Header: 'device Name',
//     accessor: 'deviceName',
//   },
  
 
// ];

export const DistanceReport = () => {
  const [dateColumn, setDateColumn] = useState(null); // Store the date range column header
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateColumns, setDateColumns] = useState([]); // Store the dynamically generated date columns

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US'); // Formats to MM/DD/YYYY
  // };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based, so we add 1
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`; // Formats as DD/MM/YYYY
  };
  
  const generateDateRange = (start, end) => {
    let startDate = new Date(start);
    let endDate = new Date(end);
    const dateArray = [];

    while (startDate <= endDate) {
      // Push the formatted date (MM-DD-YYYY) into the array
      dateArray.push(formatDate(startDate.toISOString()));
      // Increment the date
      startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray;
  };
  const handleDateChange = () => {
    if (startDate && endDate) {
      const dateRange = generateDateRange(startDate, endDate);
      setDateColumns(dateRange); // Set the dynamic date columns
    }
  };

  useEffect(() => {
    handleDateChange(); // Update columns when dates are selected or changed
  }, [startDate, endDate]);
 
  // const COLUMNS = () => [
  //   { Header: 'Device Name', accessor: 'deviceName' },
  //   ...dateColumns.map((date) => ({
  //     Header: date,
  //     accessor: `date_${date.replace(/\//g, '-')}`, // Ensure valid accessor
  //   })),
  // ];
// const [selectAll, setSelectAll] = useState(false);
  
// Modify COLUMNS() function to match the date format in the processed data
// const COLUMNS = () => {
//   const columns = [
//     {
//       Header: "Device Name",
//       accessor: "deviceName",
//     },
//   ];

//   // Dynamically generate columns for each date in the processed data
//   const dateColumns = [];
//   filteredRows.forEach((row) => {
//     Object.keys(row).forEach((key) => {
//       if (key !== 'deviceName') {
//         dateColumns.push({
//           Header: key, // Use date as header
//           accessor: `date_${key.replace(/\//g, '-')}`, // Date as accessor (e.g., date_02-12-2024)
//         });
//       }
//     });
//   });

//   // Combine the columns
//   return [...columns, ...dateColumns];
// };

const COLUMNS = () => {
  const columns = [
    {
      Header: "Device Name",
      accessor: "deviceName", // Static column for deviceName
    },
  ];

  // Collect all unique dates from the data
  const dateColumns = [];
  filteredRows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "deviceName" && !dateColumns.includes(key)) {
        dateColumns.push(key); // Add the date as a column header if it doesn't already exist
      }
    });
  });
  const toSortableDate = (date) => {
    const [day, month, year] = date.split("/").map(Number);
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  // Sort the dates using the sortable format
  dateColumns.sort((a, b) => {
    return new Date(toSortableDate(a)) - new Date(toSortableDate(b));
  });
  // Create columns for each date
  dateColumns.forEach((date) => {
    columns.push({
      Header: date, // Set the column header to the date
      accessor: `date_${date.replace(/\//g, '-')}`, // Use date as accessor (e.g., date_02-12-2024)
    });
  });

  return columns; // Return the columns array with dynamic date columns
};

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

  if (!formattedStartDate || !formattedEndDate || !selectedDevice || !selectedNotification) {
    alert('Please fill all fields');
    return;
  }

  // Construct the API URL
  const url = `
https://rocketsalestracker.com/api/reports/summary?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&daily=${encodeURIComponent(daily)}&deviceId=${encodeURIComponent(selectedDevice)}&groupId=${encodeURIComponent(selectedGroup)}`;
  
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

//     // Handle JSON response
//     if (response.headers['content-type'] === 'application/json') {
//       const text = await response.data.text(); // Convert Blob to text
//       console.log('JSON Response:', text); // Log JSON response
//       const jsonResponse = JSON.parse(text); // Parse JSON

//       // Process the JSON data for events
//       const processedEvents = jsonResponse.map(event => ({
//         // id: event.id || 'N/A',
//         deviceId: event.deviceId || 'N/A',
//         deviceName: event.deviceName || 'N/A',
//         distance: event.distance < 0 ? 0 : event.distance || 0,
//         // averageSpeed: event.averageSpeed || 0,
//         // maxSpeed: event.maxSpeed || 0,
//         // spentFuel: event.spentFuel || 0,
//         // startOdometer: event.startOdometer || 0,
//         // endOdometer: event.endOdometer || 0,
//         startTime: event.startTime ? new Date(event.startTime).toLocaleString() : 'N/A', // Format the date
//         // endTime: event.endTime ? new Date(event.endTime).toLocaleString() : 'N/A', // Format the date
//         // engineHours: event.engineHours || 0,
//         // type: event.type || 'Unknown', // Process the 'type' field
//         // eventTime: event.eventTime ? new Date(event.eventTime).toLocaleString() : 'N/A', // Format the date
//         // geofenceId: event.geofenceId || 'None',
//         // maintenanceId: event.maintenanceId || 'None',
//         // positionId: event.positionId || 'None',
//         // attributes: event.attributes || {},
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

    // Handle JSON response
    if (response.headers['content-type'] === 'application/json') {
      const text = await response.data.text(); // Convert Blob to text
      console.log('JSON Response:', text); // Log JSON response
      const jsonResponse = JSON.parse(text); // Parse JSON

      // Process the JSON data for events
      const processedEvents = jsonResponse.reduce((acc, event) => {
        const formattedStartDate = event.startTime ? new Date(event.startTime).toLocaleDateString('en-GB') : 'N/A'; // Format date as DD/MM/YYYY
        
        // Find the existing event for the same deviceName
        const existingEvent = acc.find(e => e.deviceName === event.deviceName);

        if (existingEvent) {
          // If deviceName already exists, aggregate the distance by date
          if (existingEvent[formattedStartDate]) {
            existingEvent[formattedStartDate] += event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
          } else {
            existingEvent[formattedStartDate] = event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
          }
        } else {
          // If deviceName is not found, create a new entry with the date and distance
          acc.push({
            deviceName: event.deviceName || 'N/A',
            [formattedStartDate]: event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2)),
          });
        }

        return acc;
      }, []); // Initialize accumulator as an empty array

      console.log('Processed Event Data:', processedEvents);

      // Set the filtered rows and the total responses
      setFilteredRows(processedEvents);
      setTotalResponses(processedEvents.length);

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

        // Process the data
        const processedEvents = jsonData.reduce((acc, event) => {
          const formattedStartDate = event.eventTime ? new Date(event.eventTime).toLocaleDateString('en-GB') : 'N/A'; // Format date as DD/MM/YYYY

          const existingEvent = acc.find(e => e.deviceName === event.deviceName);

          if (existingEvent) {
            // If deviceName already exists, aggregate the distance by date
            if (existingEvent[formattedStartDate]) {
              existingEvent[formattedStartDate] += event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
            } else {
              existingEvent[formattedStartDate] = event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2));
            }
          } else {
            // If deviceName is not found, create a new entry with the date and distance
            acc.push({
              deviceName: event.deviceName || 'N/A',
              [formattedStartDate]: event.distance < 0 ? 0 :  parseFloat((event.distance / 1000).toFixed(2)),
            });
          }

          return acc;
        }, []);

        console.log('Processed Events:', processedEvents);

        setFilteredRows(processedEvents);
        setTotalResponses(processedEvents.length);

        // Optionally export the processed data back to an Excel file
        const outputWorksheet = XLSX.utils.json_to_sheet(processedEvents);
        const outputWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Processed Report');

        // Trigger file download
        XLSX.writeFile(outputWorkbook, 'processed_report.xlsx');
      };

      reader.readAsArrayBuffer(blob); // Read the Blob as an ArrayBuffer
    } else {
      throw new Error('Unexpected content type: ' + response.headers['content-type']);
    }
  } catch (error) {
    console.error('Error fetching the report:', error);
    alert('Failed to download or process report.');
  } finally {
    setLoading(false);
  }
};

 const [selectedNotification, setSelectedNotification] = useState('');
  const [daily, setDaily] = useState(false);

  const notificationTypes = [
    // { type: 'Summary' },
    { type: 'Daily Summary' }
  ];

  const handleNotificationChange = (e) => {
    const selectedType = e.target.value;
    setSelectedNotification(selectedType);

    // Set daily to true if 'Daily Summary', else set to false
    setDaily(selectedType === 'Daily Summary');
  };
  const options = devices.map((device) => ({
    value: device.id,
    label: device.name,
  }));
  
  const handleChange = (selectedOption) => {
    setSelectedDevice(selectedOption ? selectedOption.value : null);
  };
  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));
  
  // Handle change for groups
  const handleGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption ? selectedOption.value : null);
  };
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Distance Report 
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
         

          <Export sortedData={sortedData} columnVisibility={columnVisibility} COLUMNS={COLUMNS} pdfTitle={"DISTANCE REPORT"} pdfFilename={"DistanceReport"} excelFilename={"DistanceReport.xlsx"}/>
          
          <div
  style={{
    width: "250px",
    position: "relative",
    zIndex: "10",
    border: "1px solid #000", // Add a black border
    marginLeft:"8px"
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
<div style={{
   
    marginLeft:"8px"
  }}>
      <select
        value={selectedNotification}
        onChange={handleNotificationChange}
        style={{ marginRight: '10px',paddingTopTop:'7px',paddingBottom:'7px', padding: '5px' }}
      >
        <option value="">Select Notification Type</option>
        {notificationTypes.map((notification) => (
          <option key={notification.type} value={notification.type}>
            {notification.type}
          </option>
        ))}
      </select>


    </div>
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
        border: "1px solid #000",
        // borderRadius: "4px", // Optional rounded corners
      }}
    >
      <Select
        options={groupOptions}
        value={groupOptions.find((option) => option.value === selectedGroup) || null}
        onChange={handleGroupChange}
        placeholder="Select Group"
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            border: "none", // Remove react-select's default border
            boxShadow: "none", // Remove focus outline
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "#000", // Black dropdown arrow
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: "#000", // Black clear icon
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
            {/* <TableContainer
              component={Paper}
              sx={{
                maxHeight: 500,
                border: "1.5px solid black",
                borderRadius: "7px",
              }}
            >
            
             
        

<Table stickyHeader aria-label="sticky table" style={{ border: "1px solid black" }}>
  <TableHead>
    <TableRow style={{ borderBottom: "1px solid black", borderTop: "1px solid black" }}>
     
      <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0", borderBottom: "2px solid black" }}>
        <Switch checked={selectAll} onChange={() => setSelectAll(!selectAll)} color="primary" />
      </TableCell>

    
      {COLUMNS().map((column) => (
        <TableCell
          key={column.accessor}
          align="left"
          style={{
            minWidth: column.minWidth || '100px',
            cursor: "pointer",
            borderRight: "1px solid #e0e0e0",
            borderBottom: "2px solid black",
            padding: "4px 4px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {column.Header}
        </TableCell>
      ))}

      <TableCell
        style={{
          minWidth: 70,
          borderRight: "1px solid #e0e0e0",
          borderBottom: "2px solid black",
          padding: "4px 4px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Total Distance
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {sortedData.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={COLUMNS().length + 1} 
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
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
        // Calculate the total distance for each row by summing the relevant columns
        const totalDistance = Object.keys(row).reduce((sum, key) => {
          // Exclude the 'deviceName' and any non-numeric values (like dates and "-")
          if (key !== 'deviceName' && !key.startsWith('date_')) {
            const columnValue = row[key];
            const numericValue = parseFloat(columnValue);

            if (!isNaN(numericValue)) {
              return sum + numericValue;  // Sum only valid numbers
            }
          }
          return sum;
        }, 0);

        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.deviceId + index}
            selected={selectAll}
            style={{
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
            }}
          >
            
            <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0" }}>
              <Switch checked={selectAll} color="primary" />
            </TableCell>

           
            {COLUMNS().map((column) => {
              const columnValue = row[column.accessor];

              // Handle date columns
              if (column.accessor.startsWith('date_')) {
                const dateKey = column.accessor.replace('date_', '').replace(/-/g, '/');
                const dateValue = row[dateKey] || '0';
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {dateValue !== undefined && dateValue !== null ? dateValue : '-'}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {columnValue}
                  </TableCell>
                );
              }
            })}

          
            <TableCell
              style={{
                minWidth: 70,
                borderRight: "1px solid #e0e0e0",
                paddingTop: "4px",
                paddingBottom: "4px",
                borderBottom: "none",
                textAlign: "center",
                fontSize: "smaller",
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
              }}
            >
              {parseFloat((totalDistance).toFixed(2))}
             
            </TableCell>
          </TableRow>
        );
      })
    )}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell
        colSpan={COLUMNS().length + 1} 
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          borderTop: "2px solid black",
          backgroundColor: "#f5f5f5",
        }}
      >
        Distance1: Add your calculated value here
      </TableCell>
    </TableRow>
  </TableFooter>
</Table>




            </TableContainer> */}
<TableContainer
  component={Paper}
  sx={{
    maxHeight: 500,
    border: "1.5px solid black",
    borderRadius: "7px",
  }}
>
  <Table stickyHeader aria-label="sticky table" style={{ border: "1px solid black" }}>
    <TableHead>
      <TableRow style={{ borderBottom: "1px solid black", borderTop: "1px solid black" }}>
        <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0", borderBottom: "2px solid black" }}>
          <Switch checked={selectAll} onChange={() => setSelectAll(!selectAll)} color="primary" />
        </TableCell>

        {COLUMNS().map((column) => (
          <TableCell
            key={column.accessor}
            align="left"
            style={{
              minWidth: column.minWidth || "100px",
              cursor: "pointer",
              borderRight: "1px solid #e0e0e0",
              borderBottom: "2px solid black",
              padding: "4px 4px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {column.Header}
          </TableCell>
        ))}

        <TableCell
          style={{
            minWidth: 70,
            borderRight: "1px solid #e0e0e0",
            borderBottom: "2px solid black",
            padding: "4px 4px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Total Distance
        </TableCell>
      </TableRow>
    </TableHead>

    {/* <TableBody>
      {sortedData.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={COLUMNS().length + 1}
            style={{
              textAlign: "center",
              padding: "16px",
              fontSize: "16px",
              color: "#757575",
            }}
          >
            <h4>No Data Available</h4>
          </TableCell>
        </TableRow>
      ) : (
        sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
          const totalDistance = Object.keys(row).reduce((sum, key) => {
            if (key !== "deviceName" && !key.startsWith("date_")) {
              const columnValue = row[key];
              const numericValue = parseFloat(columnValue);

              if (!isNaN(numericValue)) {
                return sum + numericValue;
              }
            }
            return sum;
          }, 0);

          return (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={row.deviceId + index}
              selected={selectAll}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
              }}
            >
              <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0" }}>
                <Switch checked={selectAll} color="primary" />
              </TableCell>

              {COLUMNS().map((column) => {
                const columnValue = row[column.accessor];
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {columnValue !== undefined && columnValue !== null ? columnValue : "-"}
                  </TableCell>
                );
              })}

              <TableCell
                style={{
                  minWidth: 70,
                  borderRight: "1px solid #e0e0e0",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  textAlign: "center",
                  fontSize: "smaller",
                }}
              >
                {parseFloat(totalDistance.toFixed(2))}
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody> */}
 <TableBody>
    {sortedData.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={COLUMNS().length + 1} 
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
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
        // Calculate the total distance for each row by summing the relevant columns
        const totalDistance = Object.keys(row).reduce((sum, key) => {
          // Exclude the 'deviceName' and any non-numeric values (like dates and "-")
          if (key !== 'deviceName' && !key.startsWith('date_')) {
            const columnValue = row[key];
            const numericValue = parseFloat(columnValue);

            if (!isNaN(numericValue)) {
              return sum + numericValue;  // Sum only valid numbers
            }
          }
          return sum;
        }, 0);

        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.deviceId + index}
            selected={selectAll}
            style={{
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
            }}
          >
            
            <TableCell padding="checkbox" style={{ borderRight: "1px solid #e0e0e0" }}>
              <Switch checked={selectAll} color="primary" />
            </TableCell>

           
            {COLUMNS().map((column) => {
              const columnValue = row[column.accessor];

              // Handle date columns
              if (column.accessor.startsWith('date_')) {
                const dateKey = column.accessor.replace('date_', '').replace(/-/g, '/');
                const dateValue = row[dateKey] || '0';
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {dateValue !== undefined && dateValue !== null ? dateValue : '-'}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    key={column.accessor}
                    align="left"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      padding: "4px",
                    }}
                  >
                    {columnValue}
                  </TableCell>
                );
              }
            })}

          
            <TableCell
              style={{
                minWidth: 70,
                borderRight: "1px solid #e0e0e0",
                paddingTop: "4px",
                paddingBottom: "4px",
                borderBottom: "none",
                textAlign: "center",
                fontSize: "smaller",
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#eeeeefc2",
              }}
            >
              {parseFloat((totalDistance).toFixed(2))}
             
            </TableCell>
          </TableRow>
        );
      })
    )}
  </TableBody>
  
{/* <TableFooter>
  <TableRow>
   
    <TableCell
      style={{
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
     
      Total
    </TableCell>

   
    {COLUMNS().map((column) => {
      const columnSum = sortedData.reduce((sum, row) => {
        const value = parseFloat(row[column.accessor]);
        
        return !isNaN(value) ? sum + value : sum;
      }, 0);

      return (
        <TableCell
          key={`footer-${column.accessor}`}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
          }}
        >
          {columnSum > 0 ? parseFloat(columnSum.toFixed(2)) : "0"}
        </TableCell>
      );
    })}

   
    <TableCell
      style={{
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      {parseFloat(
        sortedData.reduce((sum, row) => {
          const totalDistance = Object.keys(row).reduce((subtotal, key) => {
            if (key !== "deviceName" ) {
              const value = parseFloat(row[key]);
              return !isNaN(value) ? subtotal + value : subtotal;
            }
            return subtotal;
          }, 0);
          return sum + totalDistance;
        }, 0).toFixed(2)
      )}
    </TableCell>
  </TableRow>
</TableFooter> */}
<TableFooter>
  <TableRow>
    {/* Label for total row */}
    <TableCell
      style={{
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      Total
    </TableCell>

    {/* Dynamically calculate totals for each date column */}
    {COLUMNS().map((column) => {
      if (column.accessor === "deviceName") {
        // Skip the deviceName column
        return <TableCell key={column.accessor}></TableCell>;
      }

      // Calculate the column total by summing up relevant values in `sortedData`
      console.log("sorted date in columntotal calculation",sortedData);

      // const columnTotal = sortedData.reduce((sum, row) => {
        
      //   console.log("row[column.accessor]",row[column.accessor]);
        
      //   const value = parseFloat(row[column.accessor] || 0); // Default to 0 if value is undefined
      //   return sum + (isNaN(value) ? 0 : value);
        
      // }, 0);
     // Dynamically format the column accessor to match the keys in sortedData
const columnTotal = sortedData.reduce((sum, row) => {
  const formattedAccessor = column.accessor.replace("date_", "").replace(/-/g, "/"); // Convert "date_05-12-2024" to "05/12/2024"

  console.log("Row being processed:", row);
  console.log(`Value for column "${formattedAccessor}":`, row[formattedAccessor]);

  // Extract and parse the value for the column
  const value = parseFloat(row[formattedAccessor] || 0); // Default to 0 if the value is missing or undefined
  return sum + (isNaN(value) ? 0 : value); // Add only valid numeric values
}, 0);


      return (
        <TableCell
          key={column.accessor}
          align="center"
          style={{
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
          }}
        >
          {columnTotal.toFixed(2)} 
        </TableCell>
      );
    })}

    {/* Calculate and display grand total */}
    <TableCell
      style={{
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      {sortedData
        .reduce((grandTotal, row) => {
          return Object.keys(row).reduce((sum, key) => {
            if (key !== "deviceName") {
              const value = parseFloat(row[key] || 0);
              return sum + (isNaN(value) ? 0 : value);
            }
            return sum;
          }, grandTotal);
        }, 0)
        .toFixed(2)}
    </TableCell>
  </TableRow>
</TableFooter>



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