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

// export const Combined = () => {
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
//     XLSX.writeFile(workbook, "Combined.xlsx");
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
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Check if the data is an array and process it
//     if (Array.isArray(responseData) && responseData.length > 0) {
//       // const processedData = responseData.map((item) => {
//       //   // Find the deviceName using the deviceId
//       //   const deviceName = deviceIdToNameMap[item.deviceId];

//       //   // Process each device's events
//       //   const processedEvents = (item.events || []).map((event) => ({
//       //     deviceId: item.deviceId,
//       //     deviceName: deviceName, // Add deviceName from mapping
//       //     eventTime: new Date(event.eventTime).toLocaleString(), // Convert event time to local time
//       //     // serverTime: new Date(event.serverTime).toLocaleString(), // Convert event time to local time
//       //     type: event.type.replace(/([A-Z])/g, ' $1').trim(),   // Format type (optional)
//       //   }));
//       //   const processed = (item.positionS || []).map((event) => ({
//       //     serverTime: new Date(event.serverTime).toLocaleString(),
//       //   }));
//       //   return {
//       //     deviceId: item.deviceId,
//       //     deviceName: deviceName, // Add deviceName from mapping
//       //     processedEvents,
//       //     processed
//       //   };
//       // });
//       const processedData = responseData.map((item) => {
//         // Find the deviceName using the deviceId
//         const deviceName = deviceIdToNameMap[item.deviceId];
      
//         // Process each device's events
//         const processedEvents = (item.events || []).map((event) => ({
//           deviceId: item.deviceId,
//           deviceName: deviceName, // Add deviceName from mapping
//           eventTime: new Date(event.eventTime).toLocaleString(), // Convert event time to local time
//           type: event.type.replace(/([A-Z])/g, ' $1').trim(),   // Format type (optional)
//         }));
      
//         // Process positions with serverTime
//         const processedPositions = Array.isArray(item.positions)
//         ? item.positions.map((position) => ({
//             id: position.id,
//             deviceId: item.deviceId,
//             deviceName: deviceName,
//             serverTime: position.serverTime ? new Date(position.serverTime).toLocaleString() : 'N/A',
//             deviceTime: position.deviceTime ? new Date(position.deviceTime).toLocaleString() : 'N/A',
//             fixTime: position.fixTime ? new Date(position.fixTime).toLocaleString() : 'N/A',
//             latitude: position.latitude,
//             longitude: position.longitude,
//             speed: position.speed ? position.speed.toFixed(2) : '0.00',
//             valid: position.valid,
//             attributes: position.attributes,
//           }))
//         : [];
      
//         return {
//           deviceId: item.deviceId,
//           deviceName: deviceName, // Add deviceName from mapping
//           processedEvents,
//           processedPositions,
//         };
//       });
      
//       console.log("Processed Data:", processedData);

//       // Update state with processed events
//       setFilteredRows(
//         processedData.flatMap(({ processedEvents }) =>
//           processedEvents.map((event) => ({
//             ...event,
//             isSelected: false,
//           }))
//         )
//       );

//       // Update the total number of events
//       setTotalResponses(
//         processedData.reduce((total, item) => total + item.processedEvents.length, 0)
//       );
//     } else {
//       console.error("Expected an array but got:", responseData);
//       alert("Unexpected data format.");
//     }
//   } catch (error) {
//     console.error("Fetch data error:", error);
//     alert("please select device,group and date");
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


// //comented for deployment


import React, { useState, useEffect, useContext, Component,useRef  } from "react";
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
import ExcelJS from "exceljs"
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { TotalResponsesContext } from "../../../../TotalResponsesContext";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { StyledTablePagination } from "../../PaginationCssFile/TablePaginationStyles";
import Select from "react-select";
//import { TextField } from '@mui/material';
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

export const Combined = () => {
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

 

  // const handleExport = () => {
  //   const dataToExport = filteredRows.map((row) => {
  //     const { isSelected, ...rowData } = row;
  //     return rowData;
  //   });
  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   XLSX.writeFile(workbook, "Combined.xlsx");
  // };

console.log("filteredDATA IN DEVICE STATUS ",filteredRows)
  const handleExport = async () => {
    console.log("filteredRows in handleexport", filteredRows);

    // Define fields to exclude and the desired header names
    const excludedFields = ["isSelected",];
    //FOR ORDER
    

    const headerOverrides = {
      deviceId:"DEVICE ID",
      	deviceName: "DEVICE NAME",
        	eventTime: "FIX TIME",
          
          	serverTime:"SERVER TIME",
            type:"TYPE"
    };

   // Define the desired order of fields
   const fieldOrder = [
    "deviceId",
    "deviceName",
    "eventTime",
    "serverTime",
    "type"
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
    link.download = "DeviceStatus.xlsx";
    link.click();
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

  

  const handleModalClose = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setModalOpen(false);
    setFormData({});
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

 




 
  


 
  const [error, setError] = useState(null);

const [devices, setDevices] = useState([]); // Ensure devices is initialized as an empty array

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/devices', {
          headers: {
            'Authorization': 'Basic ' + btoa('schoolmaster:123456'),
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        // Ensure that data is an array before setting it
        if (Array.isArray(data)) {
          setDevices(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
      }
    };
  
    fetchDevices();
  }, []); // Make sure this runs only once on component mount
  
  
  // Transform devices into options for React-Select
  const options = devices.map((device) => ({
    value: device.id,
    label: device.name,
  }));

  const handleChange = (selectedOption) => {
    setSelectedDevice(selectedOption ? selectedOption.value : null);
  };

  const [groups, setGroups] = useState([]);
  
 // Convert groups into options for react-select
 const groupOptions = groups.map((group) => ({
  value: group.id,
  label: group.name,
}));

// Handle change for groups
const handleGroupChange = (selectedOption) => {
  setSelectedGroup(selectedOption ? selectedOption.value : null);
};
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

  
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  const handleShowClick = () => {
    const formattedStartDate = formatToUTC(startDate);
    const formattedEndDate = formatToUTC(endDate);

    if (!formattedStartDate || !formattedEndDate || !selectedDevice || !selectedGroup) {
      alert('Please fill all fields');
      return;
    }

    // Construct the API URL
    const url = `https://rocketsalestracker.com/api/reports/combined?from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&deviceId=${encodeURIComponent(selectedDevice)}&groupId=${encodeURIComponent(selectedGroup)}`;
    
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
//       acc[device.id] = device.name; // Use device.id and device.name as key-value pair
//       return acc;
//     }, {});

//     // Check if the data is an array and process it
//     if (Array.isArray(responseData) && responseData.length > 0) {
     
//       const processedData = responseData.map((item) => {
//         // Find the deviceName using the deviceId
//         const deviceName = deviceIdToNameMap[item.deviceId];
      
//         // Process each device's events
//         const processedEvents = (item.events || []).map((event) => ({
//           deviceId: item.deviceId,
//           deviceName: deviceName, // Add deviceName from mapping
//           eventTime: new Date(event.eventTime).toLocaleString(), // Convert event time to local time
//           type: event.type.replace(/([A-Z])/g, ' $1').trim(),   // Format type (optional)
//         }));
      
//         // Process positions with serverTime
//         const processedPositions = Array.isArray(item.positions)
//         ? item.positions.map((position) => ({
//             id: position.id,
//             deviceId: item.deviceId,
//             deviceName: deviceName,
//             serverTime: position.serverTime ? new Date(position.serverTime).toLocaleString() : 'N/A',
//             deviceTime: position.deviceTime ? new Date(position.deviceTime).toLocaleString() : 'N/A',
//             fixTime: position.fixTime ? new Date(position.fixTime).toLocaleString() : 'N/A',
//             latitude: position.latitude,
//             longitude: position.longitude,
//             speed: position.speed ? position.speed.toFixed(2) : '0.00',
//             valid: position.valid,
//             attributes: position.attributes,
//           }))
//         : [];
      
//         return {
//           deviceId: item.deviceId,
//           deviceName: deviceName, // Add deviceName from mapping
//           processedEvents,
//           processedPositions,
//         };
//       });
      
//       console.log("Processed Data:", processedData);

//       // Update state with processed events
//       setFilteredRows(
//         processedData.flatMap(({ processedEvents }) =>
//           processedEvents.map((event) => ({
//             ...event,
//             isSelected: false,
//           }))
//         )
//       );

//       // Update the total number of events
//       setTotalResponses(
//         processedData.reduce((total, item) => total + item.processedEvents.length, 0)
//       );
//     } else {
//       console.error("Expected an array but got:", responseData);
//       alert("Unexpected data format.");
//     }
//   } catch (error) {
//     console.error("Fetch data error:", error);
//     alert("please select device,group and date");
//   } finally {
//     setLoading(false);
//   }
// };

const fetchData = async (url) => {
  setLoading(true);

  try {
    const username = "schoolmaster";
    const password = "123456";
    const token = btoa(`${username}:${password}`);

    // Make the GET request to fetch the data
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    const responseData = response.data;

    console.log("Fetched data:", responseData);

    // Create a deviceId to deviceName map from the devices array
    const deviceIdToNameMap = devices.reduce((acc, device) => {
      acc[device.id] = device.name; // Use device.id and device.name as key-value pair
      return acc;
    }, {});

    // Check if the data is an array and process it
    if (Array.isArray(responseData) && responseData.length > 0) {
      const processedData = responseData.map((item) => {
        // Find the deviceName using the deviceId
        const deviceName = deviceIdToNameMap[item.deviceId];

        // Process positions with serverTime
        const processedPositions = Array.isArray(item.positions)
          ? item.positions.map((position) => ({
              id: position.id,
              deviceId: item.deviceId,
              deviceName: deviceName,
              serverTime: position.serverTime ? new Date(position.serverTime).toLocaleString() : "N/A",
              deviceTime: position.deviceTime ? new Date(position.deviceTime).toLocaleString() : "N/A",
              fixTime: position.fixTime ? new Date(position.fixTime).toLocaleString() : "N/A",
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed ? position.speed.toFixed(2) : "0.00",
              valid: position.valid,
              attributes: position.attributes,
            }))
          : [];

        // Match eventTime in processedEvents with fixTime in processedPositions
        const enrichedEvents = (item.events || []).map((event) => {
          const eventTimeFormatted = new Date(event.eventTime).toLocaleString();
          const matchingPosition = processedPositions.find(
            (position) => position.fixTime === eventTimeFormatted && position.deviceId === item.deviceId
          );

          return {
            deviceId: item.deviceId,
            deviceName: deviceName,
            eventTime: eventTimeFormatted,
            type: event.type.replace(/([A-Z])/g, " $1").trim(), // Format type (optional)
            serverTime: matchingPosition ? matchingPosition.serverTime : "N/A", // Add serverTime if a match is found
          };
        });

        return {
          deviceId: item.deviceId,
          deviceName: deviceName,
          processedEvents: enrichedEvents,
          processedPositions,
        };
      });

      console.log("Processed Data with Enriched Events:", processedData);

      // Update state with processed and enriched events
      setFilteredRows(
        processedData.flatMap(({ processedEvents }) =>
          processedEvents.map((event) => ({
            ...event,
            isSelected: false,
          }))
        )
      );

      // Update the total number of events
      setTotalResponses(
        processedData.reduce((total, item) => total + item.processedEvents.length, 0)
      );
    } else {
      console.error("Expected an array but got:", responseData);
      alert("Unexpected data format.");
    }
  } catch (error) {
    console.error("Fetch data error:", error);
    alert("please select device, group and date");
  } finally {
    setLoading(false);
  }
};

const [searchText, setSearchText] = useState("");
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef();

const filteredDevices = Array.isArray(devices)
  ? devices.filter((device) =>
      device.name.toLowerCase().includes(searchText.toLowerCase())
    )
  : [];

const handleSelect = (deviceId) => {
  setSelectedDevice(deviceId);
  setIsOpen(false);
};

// Handle outside click to close the dropdown
const handleClickOutside = (event) => {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setIsOpen(false);
  }
};

React.useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
       Device Status
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
<Export columnVisibility={columnVisibility} COLUMNS={COLUMNS} filteredRows={filteredRows} pdfTitle={"DEVICE STATUS REPORT"} pdfFilename={"DeviceStatusReport.pdf"} excelFilename={"DeviceStatusReport.xlsx"}/>

        </div>
       
     <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
    
    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
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
      )}   */}
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


//comented for deployment