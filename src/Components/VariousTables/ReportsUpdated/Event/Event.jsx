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

export const Event = () => {
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
  const role = localStorage.getItem("role");
  const username = "schoolmaster";
  const password = "123456";
  const [loadingdevice, setloadingdevice] = useState(true);
  const [loadingnotification, setloadingnotification] = useState(true);

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




  const [devices, setDevices] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {


    const fetchDevices = async (myDevices) => {
      try {
        let response;
        const token = localStorage.getItem('token');

        if (role == 1) {
          response = await axios.get(`${process.env.REACT_APP_SUPER_ADMIN_API}/read-devices`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (role == 2) {
          response = await axios.get(`${process.env.REACT_APP_SCHOOL_API}/read-devices`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (role == 3) {
          response = await axios.get(`${process.env.REACT_APP_BRANCH_API}/read-devices`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (role == 4) {
          response = await axios.get(`${process.env.REACT_APP_USERBRANCH}/getdevicebranchgroupuser`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        if (response?.data) {
          const allData = role == 1
            ? response.data.data.flatMap((school) =>
              school.branches.flatMap((branch) =>
                Array.isArray(branch.devices) ? branch.devices : []
              )
            )
            : role == 2
              ? response.data.branches.flatMap((branch) =>
                Array.isArray(branch.devices) ? branch.devices : []
              )
              : role == 3
                ? response.data.devices
                : role == 4
                  ? response.data.data.flatMap((school) =>
                    school.branches.flatMap((branch) =>
                      Array.isArray(branch.devices) ? branch.devices : []
                    )
                  )
                  : [];

          // Combine the data from myfetchDevices and fetchDevices


          setDevices(allData);
          console.log('Merged Devices:', allData);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
      setloadingdevice(false);
    };


    fetchDevices();

  }, [role]);


  const [selectedDevice, setSelectedDevice] = useState('');

  const [apiUrl, setApiUrl] = useState('');

  const handleShowClick = () => {
    const formattedStartDate = formatToUTC(startDate);
    const formattedEndDate = formatToUTC(endDate);

    if (!formattedStartDate || !formattedEndDate || !selectedDevice || !selectedNotification) {
      alert('Please fill all fields');
      return;
    }

    // Construct the API URL
    const url = `${process.env.REACT_APP_ROCKETSALES_API}/reports/events?deviceId=${encodeURIComponent(selectedDevice)}&from=${encodeURIComponent(formattedStartDate)}&to=${encodeURIComponent(formattedEndDate)}&type=${encodeURIComponent(selectedNotification)}`;

    setApiUrl(url); // Update the state with the generated URL
    fetchData(url); // Call fetchData with the generated URL
  };
  const formatToUTC = (localDateTime) => {
    if (!localDateTime) return '';
    const localDate = new Date(localDateTime);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  };


  const fetchData = async (url) => {
    console.log('Fetching report...');
    setLoading(true);

    try {

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
        acc[device.deviceId] = device.deviceName; // Use device.id and device.name as key-value pair
        return acc;
      }, {});
      // Handle JSON response
      if (response.headers['content-type'] === 'application/json') {
        const text = await response.data.text(); // Convert Blob to text
        console.log('JSON Response:', text); // Log JSON response
        const jsonResponse = JSON.parse(text); // Parse JSON

        // Process the JSON data for events
        const processedEvents = jsonResponse.map(event => ({
          id: event.id,
          deviceName: deviceIdToNameMap[event.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
          deviceId: event.deviceId || 'N/A',
          type: event.type || 'Unknown', // Process the 'type' field
          eventTime: event.eventTime ? new Date(event.eventTime).toLocaleString() : 'N/A', // Format the date
          geofenceId: event.geofenceId || 'None',
          maintenanceId: event.maintenanceId || 'None',
          positionId: event.positionId || 'None',
          attributes: event.attributes || {},
        }));

        console.log('Processed Event Data:', processedEvents);

        // Set the filtered rows and the total responses
        setFilteredRows(processedEvents);
        setOriginalRows(processedEvents.map((row) => ({ ...row, isSelected: false })));
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
          const processedEvents = jsonData.map(event => ({
            id: event.id,
            deviceId: event.deviceId || 'N/A',
            deviceName: deviceIdToNameMap[event.deviceId] || 'Unknown Device', // Fetch device name based on deviceId
            eventType: event.type || 'Unknown',
            eventTime: event.eventTime ? new Date(event.eventTime).toLocaleString() : 'N/A',
            geofenceId: event.geofenceId || 'None',
            maintenanceId: event.maintenanceId || 'None',
            positionId: event.positionId || 'None',
            attributes: event.attributes || {},
          }));

          console.log('Processed Events:', processedEvents);

          setFilteredRows(processedEvents);
          setOriginalRows(processedEvents.map((row) => ({ ...row, isSelected: false })));
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
      // alert("please select device,event and date");
    } finally {
      setLoading(false);
    }
  };
  const [selectedNotification, setSelectedNotification] = useState("allEvents");
  const [notificationTypes, setNotificationTypes] = useState([]);
  // const [selectedNotification, setSelectedNotification] = useState('');
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificationTypes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROCKETSALES_API}/notifications/types`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`), // Replace with actual credentials
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setNotificationTypes(data);
      } catch (error) {
        setError(error.message);
      }
      setloadingnotification(false);
    };

    fetchNotificationTypes();
  }, []);
  const options = devices.map((device) => ({
    value: device.deviceId,
    label: device.deviceName,
  }));

  const handleChange = (selectedOption) => {
    setSelectedDevice(selectedOption ? selectedOption.value : null);
  };
  const notificationOptions = notificationTypes.map((notification) => ({
    value: notification.type,
    label: notification.type,
  }));

  // Handle notification selection change
  const handleNotificationChange = (selectedOption) => {
    setSelectedNotification(selectedOption ? selectedOption.value : null);
  };
  return (
    <div className="mx-3">
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>
        Events
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
            }}
          >
            <ImportExportIcon />
            Column Visibility
          </Button>
          <Export filteredRows={filteredRows} COLUMNS={COLUMNS} columnVisibility={columnVisibility} pdfTitle={"EVENTS REPORT"} pdfFilename={"EventsReport.pdf"} excelFilename={"EventsReport.xlsx"} />

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "10px",
            flexWrap: "wrap", // Responsive for smaller screens
          }}
        >
          {/* Dropdowns Container */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* Device Select Dropdown */}
            <div
              style={{
                minWidth: "250px",
                position: "relative",
                zIndex: "10",
                border: "1px solid #000",
                borderRadius: "4px",
              }}
            >
              <Select
                options={options}
                value={options.find((option) => option.value === selectedDevice) || null}
                onChange={handleChange}
                placeholder={loadingdevice ? "Loading devices..." : "Select Device"}
                isClearable
                isLoading={loadingdevice}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: "#000",
                  }),
                  clearIndicator: (provided) => ({
                    ...provided,
                    color: "#000",
                  }),
                }}
              />
            </div>

            {/* Notification Select Dropdown */}
            <div
              style={{
                minWidth: "250px",
                position: "relative",
                zIndex: "10",
                border: "1px solid #000",
                borderRadius: "4px",
              }}
            >
              <Select
                options={notificationOptions}
                value={notificationOptions.find(
                  (option) => option.value === selectedNotification
                ) || null}
                onChange={handleNotificationChange}
                placeholder={
                  loadingnotification ? "Loading Notification" : "Select Notification type"
                }
                isClearable
                isLoading={loadingnotification}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: "#000",
                  }),
                  clearIndicator: (provided) => ({
                    ...provided,
                    color: "#000",
                  }),
                }}
              />
            </div>
          </div>

          {/* Date Pickers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label htmlFor="start-date">Start Date & Time:</label>
              <input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: "5px",
                  marginLeft: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label htmlFor="end-date">End Date & Time:</label>
              <input
                id="end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: "5px",
                  marginLeft: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Show Button */}
          <button
            onClick={handleShowClick}
            style={{
              padding: "8px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
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
    </div>
  );
};
