import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { captureAttributionOnEntry } from "./analytics/attribution-service";
import "./styles.css";

// Captured here, before any client-side redirect (React Router's initial
// compatibility redirects do not preserve arbitrary query params), so
// first-touch UTM parameters are never lost for a bare "/" campaign link.
captureAttributionOnEntry(window.location.search, window.location.pathname);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
