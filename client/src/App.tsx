import React, { useEffect, useState } from "react";

const App = () => {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    // Ping the Express server
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("Uplink Offline ✖"));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#09090b",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ letterSpacing: "4px", marginBottom: "0" }}>IRIS-mini</h1>
      <p
        style={{
          color: status.includes("Stable") ? "#4ade80" : "#ef4444",
          fontWeight: "bold",
          fontSize: "0.8rem",
          textTransform: "uppercase",
        }}
      >
        {status}
      </p>

      <div
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          border: "1px solid #27272a",
          borderRadius: "8px",
          color: "#71717a",
          fontSize: "0.9rem",
        }}
      >
        Ready for Command Input...
      </div>
    </div>
  );
};

export default App;
