import express from "express";
import http from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import { startIrisVoice, stopIrisVoice } from "./agent/iris-voice.js";
import { getAvailablePort } from "./lib/port-picker.js";

const app = express();
const server = http.createServer(app);

if (
  process.env.IRIS_PRODUCTION === "true" ||
  process.env.NODE_ENV === "production"
) {
  ViteExpress.config({ mode: "production" });
}

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("\nThe User have been connected", socket.id);

  socket.on("Iris_Connected", (msg) => {
    startIrisVoice(io);
  });

  socket.on("Iris_Disconnected", (msg) => {
    stopIrisVoice(io);
  });

  socket.on("disconnect", () => {
    stopIrisVoice(io);
    console.log(`The User have been disconnected`, socket.id);
  });
});

const startServer = async () => {
  const port = await getAvailablePort(6754, 8764);

  server.listen(port, () => {
    // console.clear();
    console.log(`Server is listening on http://localhost:${port}`);
  });

  ViteExpress.bind(app, server);
};

startServer();
