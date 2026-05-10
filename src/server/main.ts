import express from "express";
import http from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import "../config/dot-env.js";
import { getAvailablePort } from "./lib/port-picker.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
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
