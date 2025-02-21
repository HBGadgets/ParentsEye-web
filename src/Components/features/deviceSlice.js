import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (_, { rejectWithValue }) => {
    const username = "schoolmaster";
    const password = "123456";
    const authToken = btoa(`${username}:${password}`);

    try {
      const response = await axios.get(
        `https://rocketsalestracker.com/api/devices`,
        {
          headers: {
            Authorization: `Basic ${authToken}`,
          },
        }
      );
      console.log("FETCH DEVICE DATA", response.data);

      // Ensure the response contains the expected data structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format");
      }

      return response.data; // Return only the devices array
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        // Server responded with a status code outside 2xx
        return rejectWithValue(error.response.data.message || "Server error");
      } else if (error.request) {
        // No response received
        return rejectWithValue("No response from server");
      } else {
        // Something went wrong in setting up the request
        return rejectWithValue(error.message);
      }
    }
  }
);

const deviceSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload; // Set devices array
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch devices"; // Set error message
      });
  },
});

export default deviceSlice.reducer;
