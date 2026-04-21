import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// INDUSTRIAL SIGNATURE ENGINE
const printSignature = () => {
  console.clear();
  console.log(
    "%c 🛠️ ZIROCRAFT INDUSTRIAL ENGINE v1.0 %c",
    "background: #0dcaf0; color: #000; font-weight: bold; font-size: 14px; padding: 5px 10px; border-radius: 5px;",
    "background: transparent",
  );
  console.log(
    "%cAuthorized by Yozi Heru Maulana%c",
    "color: #0dcaf0; font-weight: bold; font-size: 12px;",
    "color: gray; font-size: 10px;",
  );
  console.log("System Status: %cONLINE", "color: #10b981; font-weight: bold;");
  console.log("-----------------------------------------");
};

printSignature();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
