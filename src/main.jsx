import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

// EASTER EGG (v3.2 Industrial Standard)
console.log(
  "%c < Z > %c ZIROCRAFT ENGINE v1.0 %c Industrial Grade ",
  "background:#0dcaf0; color:#000; font-weight:bold; border-radius:3px 0 0 3px; padding:3px 10px;",
  "background:#333; color:#fff; font-weight:bold; padding:3px 10px;",
  "background:#1a1a1a; color:#0dcaf0; font-weight:bold; border-radius:0 3px 3px 0; padding:3px 10px;",
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <App />
  </React.StrictMode>,
);
