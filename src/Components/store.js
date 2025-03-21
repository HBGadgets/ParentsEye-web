// store.js
import { configureStore } from "@reduxjs/toolkit";
// import addressReducer from "./Components/Table/addressSlice.js";
import addressReducer from "./Table/addressSlice.js";
import historyReducer from "./features/historySlice.js";
import deviceReducer from "./features/deviceSlice.js";
import vehicleReducer from "./features/vehicleSlice.js";

export const store = configureStore({
  reducer: {
    address: addressReducer,
    history: historyReducer,
    devices: deviceReducer,
    vehicle: vehicleReducer,
  },
});
export default store;
