import express from "express";
import http from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import "../config/dot-env.js";
import { startIrisVoice, stopIrisVoice } from "./agent/iris-voice.js";
import { getAvailablePort } from "./lib/port-picker.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("\n[UI LINK] Face connected. ID:", socket.id);

  // 1. Listen for Connect
  socket.on("ignite_engine", () => {
    console.log("[SOCKET] Received IGNITE command from UI.");
    startIrisVoice(io);
  });

  // 2. Listen for Disconnect
  socket.on("kill_engine", () => {
    console.log("[SOCKET] Received KILL command from UI.");
    stopIrisVoice(io);
  });

  // 3. Handle Browser Close
  socket.on("disconnect", () => {
    console.log("[UI LINK] Face disconnected.");
    stopIrisVoice(io); // Safely shut down if user closes the tab
  });
});

const startServer = async () => {
  const port = await getAvailablePort(6754, 8764);

  server.listen(port, () => {
    console.clear();
    console.log(`Server is listening on http://localhost:${port}`);
    console.log(`Socket is listening on http://localhost:${port}`);
  });

  ViteExpress.bind(app, server);
};

startServer();
