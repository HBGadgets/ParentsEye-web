import axios from "axios";
import { saveAs } from "file-saver"; // Save file to the user's machine
import * as XLSX from "xlsx";

export const HistoryTripReport = async (
  deviceId,
  fromDateTime,
  toDateTime,
  setFiltereRow,
  setOriginalRow,
  setTotalResponse
) => {
  const fromDate = new Date(`${fromDateTime}`).toISOString();
  const toDate = new Date(`${toDateTime}`).toISOString();
  const token = btoa(`schoolmaster:123456`);

  try {
    const response = await axios.get(
      `${
        process.env.REACT_APP_ROCKETSALES_API
      }/reports/route?from=${encodeURIComponent(
        fromDate
      )}&to=${encodeURIComponent(toDate)}&deviceId=${encodeURIComponent(
        deviceId
      )}`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
        responseType: "blob",
      }
    );

    // Handle JSON response
    if (response.headers["content-type"] === "application/json") {
      const jsonText = await response.data.text();
      console.log("Raw JSON Text:", jsonText); // Debugging
      const jsonResponse = JSON.parse(jsonText);
      console.log("Parsed JSON Response:", jsonResponse);

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

      console.log("Grouped Data:", groupedData);

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
          deviceId: startData.deviceId || "N/A",
          // startTime: startData.serverTime
          //   ? new Date(startData.serverTime).toLocaleString()
          //   : "N/A",
          startTime: startData.serverTime
            ? new Date(startData.serverTime).getTime() // This will convert to a number (timestamp)
            : "N/A",

          // endTime: endData.serverTime
          //   ? new Date(endData.serverTime).toLocaleString()
          //   : "N/A",
          endTime: endData.serverTime
            ? new Date(endData.serverTime).getTime()
            : "N/A",
          // Latitude and Longitude from first and last objects in the group
          startLatitude: startData.latitude?.toFixed(6) || "N/A",
          startLongitude: startData.longitude?.toFixed(6) || "N/A",
          endLatitude: endData.latitude?.toFixed(6) || "N/A",
          endLongitude: endData.longitude?.toFixed(6) || "N/A",

          startSpeed: startData.speed
            ? `${startData.speed.toFixed(2)} mph`
            : "N/A",
          endSpeed: endData.speed ? `${endData.speed.toFixed(2)} mph` : "N/A",
          address: endData.address || "Show Address",
          course: endData.course > 0 ? "↑" : "↓",
          altitude: `${endData.altitude?.toFixed(2)} m` || "N/A",
          accuracy: `${endData.accuracy?.toFixed(2)}` || "N/A",
          valid: endData.valid ? "Yes" : "No",
          protocol: endData.protocol || "N/A",
          totalDistance: endData.attributes?.totalDistance
            ? `${endData.attributes.totalDistance.toFixed(2)} mi`
            : "N/A",
          motion: endData.attributes?.motion ? "Yes" : "No",
          blocked: endData.attributes?.blocked ? "Yes" : "No",
          ignition: endData.attributes?.ignition ? "Yes" : "No",
          batteryLevel: endData.attributes?.batteryLevel || "N/A",
          odometer: endData.attributes?.odometer
            ? `${endData.attributes.odometer.toFixed(2)} mi`
            : "N/A",
          engineStatus: endData.attributes?.engineStatus ? "On" : "Off",
          charge: endData.attributes?.charge ? "Yes" : "No",
          alarm1Status: endData.attributes?.alarm1Status || "N/A",
          alarm2Status: endData.attributes?.alarm2Status || "N/A",
          geofences: endData.geofenceIds
            ? endData.geofenceIds.join(", ")
            : "None",

          // Add the total distance for the group
          distance1: totalDistanceInGroup,
        };
      });

      // Flatten the grouped data and set it for display
      setFiltereRow(processedData);
      setOriginalRow(
        processedData.map((row) => ({ ...row, isSelected: false }))
      );
      setTotalResponse(jsonResponse.length);
    } else if (
      response.headers["content-type"] ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Handle Excel response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Process the file to extract data
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const reportWorkbook = XLSX.read(data, { type: "array" });
        const firstSheetName = reportWorkbook.SheetNames[0];
        const reportWorksheet = reportWorkbook.Sheets[firstSheetName];

        // Convert Excel dates to JS Date objects and numbers
        const jsonData = XLSX.utils.sheet_to_json(reportWorksheet, {
          raw: false,
          dateNF: "yyyy-mm-dd hh:mm:ss",
        });

        // Apply the same grouping logic to Excel data
        let ignitionStarted = false;
        let group = [];
        let groupedData = [];

        jsonData.forEach((data) => {
          // Use top-level fields for Excel data
          const ignition = data.ignition === "Yes"; // Adjust based on actual Excel values

          if (!ignitionStarted && ignition) {
            ignitionStarted = true;
            group.push(data);
          } else if (ignitionStarted) {
            if (!ignition) {
              groupedData.push(group);
              group = [];
              ignitionStarted = false;
            } else {
              group.push(data);
            }
          }
        });

        // If the last group was still open, push it to the groupedData
        if (group.length > 0) {
          groupedData.push(group);
        }

        // Process the grouped data for display
        const processedEvents = groupedData.map((group) => {
          const startData = group[0];
          const endData = group[group.length - 1];

          // Convert Excel serial numbers to Dates if needed
          const startTime =
            startData.serverTime instanceof Date
              ? startData.serverTime
              : new Date(startData.serverTime);
          const endTime =
            endData.serverTime instanceof Date
              ? endData.serverTime
              : new Date(endData.serverTime);

          // Map the processed data for this group into a single row
          return {
            deviceId: startData.deviceId,
            startTime: new Date(startData.serverTime).toLocaleString(),
            endTime: new Date(endData.serverTime).toLocaleString(),

            // Latitude and Longitude from first and last objects in the group
            startLatitude: startData.latitude?.toFixed(6) || "N/A",
            startLongitude: startData.longitude?.toFixed(6) || "N/A",
            endLatitude: endData.latitude?.toFixed(6) || "N/A",
            endLongitude: endData.longitude?.toFixed(6) || "N/A",

            startSpeed: `${startData.speed?.toFixed(2)} mph` || "N/A",
            endSpeed: `${endData.speed?.toFixed(2)} mph` || "N/A",
            address: endData.address,
            course: endData.course > 0 ? "↑" : "↓",
            altitude: `${endData.altitude?.toFixed(2)} m`,
            accuracy: `${endData.accuracy?.toFixed(2)}`,
            valid: endData.valid ? "Yes" : "No",
            totalDistance: endData.attributes?.totalDistance
              ? `${endData.attributes.totalDistance.toFixed(2)} mi`
              : "N/A",
            motion: endData.attributes?.motion ? "Yes" : "No",
            blocked: endData.attributes?.blocked ? "Yes" : "No",
            ignition: endData.attributes?.ignition ? "Yes" : "No",
            batteryLevel: endData.attributes?.batteryLevel || "N/A",
            engineStatus: endData.attributes?.engineStatus ? "On" : "Off",
          };
        });
        setFiltereRow(processedEvents);
        setOriginalRow(
          processedEvents.map((row) => ({ ...row, isSelected: false }))
        );
      };

      reader.readAsArrayBuffer(blob); // Read the blob data
    }
  } catch (error) {
    console.log("Not a JSON response, likely a binary file.");
  }
};
