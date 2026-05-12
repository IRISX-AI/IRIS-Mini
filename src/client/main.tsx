import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Slide, ToastContainer } from "react-toastify";

import App from "./App";

const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("THREE.Clock: This module has been deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ToastContainer
      position="top-left"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Slide}
    />
    <App />
  </React.StrictMode>,
);
