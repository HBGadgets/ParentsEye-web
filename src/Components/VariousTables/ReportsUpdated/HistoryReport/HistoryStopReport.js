import axios from "axios";

const parseDate = (dateString) => new Date(dateString);

const processGroupedEvents = (groupedEvents) => {
  return groupedEvents
    .map((group) => {
      if (group.length === 0) return null;

      const startEvent = group[0];
      const endEvent = group[group.length - 1];

      // Convert to numbers and handle potential string values
      const startLatitude = Number(startEvent.latitude);
      const startLongitude = Number(startEvent.longitude);
      const endLatitude = Number(endEvent.latitude);
      const endLongitude = Number(endEvent.longitude);

      const startTime = parseDate(startEvent.serverTime);
      const endTime = parseDate(endEvent.serverTime);

      if (isNaN(startTime) || isNaN(endTime)) {
        console.error("Invalid times:", startEvent, endEvent);
        return null;
      }

      // Validate coordinates
      if (
        isNaN(startLatitude) ||
        isNaN(startLongitude) ||
        isNaN(endLatitude) ||
        isNaN(endLongitude)
      ) {
        console.error("Invalid coordinates in group:", group);
        return null;
      }

      return {
        deviceName: startEvent.deviceName || "Unknown Device",
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
        startOdometer: Number(startEvent.odometer) || 0,
        endOdometer: Number(endEvent.odometer) || 0,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        stopDuration: ((endTime - startTime) / 60000).toFixed(2),
      };
    })
    .filter(Boolean);
};

export const HistoryStopReport = async (
  deviceId,
  fromDateTime,
  toDateTime,
  setFilteredRows,
  setOriginalRows,
  setTotalResponses
) => {
  const fromDate = new Date(`${fromDateTime}`).toISOString();
  const toDate = new Date(`${toDateTime}`).toISOString();
  const token = btoa(`schoolmaster:123456`);

  try {
    const response = await axios.get(
      `${
        process.env.REACT_APP_ROCKETSALES_API
      }/reports/route?deviceId=${encodeURIComponent(
        deviceId
      )}&from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`,
      {
        headers: { Authorization: `Basic ${token}` },
        responseType: "blob",
      }
    );

    let currentGroup = [];
    const groupedEvents = [];

    if (response.headers["content-type"] === "application/json") {
      const text = await response.data.text();
      const jsonResponse = JSON.parse(text);

      jsonResponse.forEach((data) => {
        const event = {
          deviceId: data.deviceId || "N/A",
          latitude: data.latitude, // Keep as number
          longitude: data.longitude, // Keep as number
          serverTime: data.serverTime,
          deviceName: data.device?.name || "N/A",
          odometer: data.attributes?.odometer || 0,
        };

        if (data.attributes?.ignition === false) {
          if (currentGroup.length === 0) currentGroup.push(event);
        } else if (currentGroup.length > 0) {
          currentGroup.push(event);
          if (data.attributes?.ignition === true) {
            groupedEvents.push(currentGroup);
            currentGroup = [];
          }
        }
      });

      if (currentGroup.length > 0) groupedEvents.push(currentGroup);

      const processedEvents = processGroupedEvents(groupedEvents);

      setFilteredRows(processedEvents);
      setOriginalRows(processedEvents);
      setTotalResponses(processedEvents.length);
    }
  } catch (error) {
    console.error("Stop report error:", error);
    setFilteredRows([]);
    setOriginalRows([]);
    setTotalResponses(0);
  }
};
