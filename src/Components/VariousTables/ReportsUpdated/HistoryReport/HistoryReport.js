import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CFormLabel,
  CFormSelect,
  CSpinner,
} from "@coreui/react";

// import { fetchDevices } from '../../../features/deviceSlice.js'
import { fetchDevices } from "../../../features/deviceSlice";

// import Loader from '../../../Loader/Loader.jsx'
import "./remove-gutter.css";
import HistoryMap from "./HistoryMap";
import "./HistoryReport.css";
import Select from "react-select";
import axios from "axios";
import { TotalResponsesContext } from "../../../../TotalResponsesContext";

export const HistoryReport = (historyDeviceId) => {
  const { deviceId: urlDeviceId, category, name } = useParams(); // Retrieve params from URL
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");
  const [deviceId, setDeviceId] = useState(
    historyDeviceId.historyDeviceId || ""
  );
  const [fetch, setFetch] = useState(false);
  const [historyOn, setHistoryOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const [filteredRows, setFilteredRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const { setTotalResponses } = useContext(TotalResponsesContext); // Get the context value
  const [devices, setDevices] = useState([]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-CA"); // This formats as YYYY-MM-DD
  };

  const validateDateRange = (fromDate, toDate) => {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const today = new Date();
    const diffInDays = (toDateObj - fromDateObj) / (1000 * 60 * 60 * 24);

    if (toDateObj > today) {
      alert("You cannot select a future date.");
      return false;
    }

    if (diffInDays > 7) {
      alert("You cannot select a date range exceeding 7 days.");
      return false;
    }

    return true;
  };
  console.log("😂deviceId", deviceId);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromDateTime === "" || toDateTime === "" || deviceId === "") {
      alert("Please fill all fields");
    } else if (validateDateRange(fromDateTime, toDateTime)) {
      setHistoryOn(true);
      setFetch(true);
    }
  };

  const dispatch = useDispatch();

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Months are 0-indexed
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fetchData = async (startDate = "", endDate = "") => {
    setLoading(true);
    try {
      let response;
      if (role == 1) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_SUPER_ADMIN_API}/read-devices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 2) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_SCHOOL_API}/read-devices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 3) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `${process.env.REACT_APP_BRANCH_API}/read-devices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (role == 4) {
        const token = localStorage.getItem("token");
        response = await axios.get(
          `http://63.142.251.13:4000/branchgroupuser/getdevicebranchgroupuser`,
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
                  Array.isArray(branch.devices) && branch.devices.length > 0
                    ? branch.devices.map((device) => ({
                        ...device,
                        schoolName: school.schoolName,
                        branchName: branch.branchName,
                      }))
                    : []
                )
              )
            : role == 4
            ? response.data.data.flatMap((school) =>
                school.branches.flatMap((branch) =>
                  Array.isArray(branch.devices) && branch.devices.length > 0
                    ? branch.devices.map((device) => ({
                        ...device,
                        branchName: branch.branchName,
                        schoolName: school.schoolName,
                      }))
                    : []
                )
              )
            : role == 2
            ? response.data.branches.flatMap((branch) =>
                Array.isArray(branch.devices) && branch.devices.length > 0
                  ? branch.devices.map((device) => ({
                      ...device,
                      branchName: branch.branchName,
                    }))
                  : []
              )
            : role == 3
            ? response.data.devices.map((device) => ({
                ...device,
                schoolName: response.data.schoolName,
                branchName: response.data.branchName,
              }))
            : [];

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
        setDevices(filteredData);
      } else {
        console.error("Expected an array but got:", response.data.children);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // dispatch(fetchDevices());
    fetchData();
  }, [dispatch]);

  // const handleDeviceChange = (event) => {
  //   setDeviceId(event.target.value);
  // };

  const handleDeviceChange = (selectedOption) => {
    setDeviceId(selectedOption.value);
  };

  const options = devices.map((device) => ({
    value: device.deviceId,
    label: device.deviceName,
  }));

  return (
    <>
      <CRow
        className="justify-content-center gutter-0"
        style={{ overflow: "hidden" }}
      >
        <CCol xs={12} className="px-4">
          <CCard className="p-0 mb-4 shadow-sm">
            <CCardBody>
              <HistoryMap
                fromDateTime={fromDateTime}
                toDateTime={toDateTime}
                deviceId={deviceId}
                fetch={fetch}
                setFetch={setFetch}
                historyOn={historyOn}
                setHistoryOn={setHistoryOn}
                category={category}
                name={name}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {!historyOn && (
        <CRow className="pt-3 gutter-0">
          <CCol xs={12} md={12} className="px-4">
            <CCard className="mb-4 p-0 shadow-lg rounded">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>History Report</strong>
              </CCardHeader>
              <CCardBody>
                <CForm
                  style={{ display: "flex", gap: "4rem" }}
                  onSubmit={handleSubmit}
                >
                  <div>
                    <CFormLabel htmlFor="fromDateTime">
                      From Date-Time
                    </CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      id="fromDateTime"
                      value={fromDateTime}
                      onChange={(e) => setFromDateTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <CFormLabel htmlFor="toDateTime">To Date-Time</CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      id="toDateTime"
                      value={toDateTime}
                      onChange={(e) => setToDateTime(e.target.value)}
                    />
                  </div>
                  <Select
                    id="device-select"
                    options={options}
                    value={options.find((option) => option.value === deviceId)}
                    onChange={handleDeviceChange}
                    isLoading={loading}
                    isSearchable={true}
                    placeholder="Select a Device"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "3rem",
                        width: "12rem",
                        marginTop: "1rem",
                      }),
                    }}
                  />

                  <CButton
                    color="primary"
                    type="submit"
                    style={{ height: "3rem", width: "8rem", marginTop: "1rem" }}
                  >
                    Show
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  );
};
