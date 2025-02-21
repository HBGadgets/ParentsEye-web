import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChangePassword } from "./Components/ChangePassword";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TotalResponsesProvider } from "./TotalResponsesContext";
import Logoprac from "./Components/Logoprac";
import Signupp from "./Components/Signupp";
import IndividualTrack from "./Components/Table/livetrack/IndividualTrack";
// import store from "./store";
import { Provider } from "react-redux";
import store from "./Components/store";
import { HistoryReport } from "./Components/VariousTables/ReportsUpdated/HistoryReport/HistoryReport";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <TotalResponsesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/salesman/:deviceId/:category/:name"
            element={<IndividualTrack />}
          />
          <Route path="/Login" element={<Logoprac />} />
          <Route path="/signup" element={<Signupp />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/history" element={<HistoryReport />} />
        </Routes>
      </BrowserRouter>
    </TotalResponsesProvider>
  </Provider>
);
