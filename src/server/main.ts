import express from "express";
import http from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import { startIrisVoice, stopIrisVoice } from "./agent/iris-voice.js";
import { getAvailablePort } from "./lib/port-picker.js";

const app = express();
const server = http.createServer(app);

ViteExpress.config({ mode: "production" });

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("Iris_Connected", (msg) => {
    startIrisVoice(io);
  });

  socket.on("Iris_Disconnected", (msg) => {
    stopIrisVoice(io);
  });

  socket.on("disconnect", () => {
    stopIrisVoice(io);
  });
});

const startServer = async () => {
  const port = await getAvailablePort(6754, 8764);

  server.listen(port, () => {
    // Wipe the terminal clean
    console.clear();

    const banner = `
\x1b[32m
 ██╗██████╗ ██╗███████╗   ███╗   ███╗██╗███╗   ██╗██╗
 ██║██╔══██╗██║██╔════╝   ████╗ ████║██║████╗  ██║██║
 ██║██████╔╝██║███████╗   ██╔████╔██║██║██╔██╗ ██║██║
 ██║██╔══██╗██║╚════██║   ██║╚██╔╝██║██║██║╚██╗██║██║
 ██║██║  ██║██║███████║   ██║ ╚═╝ ██║██║██║ ╚████║██║
 ╚═╝╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝
\x1b[0m
\x1b[36m [ NEURAL CORE ONLINE ]\x1b[0m
\x1b[35m [ UI PORT ] \x1b[0m http://localhost:${port}
\x1b[35m [ AGENT ]   \x1b[0m Awaiting Connection...
========================================================
`;
    console.log(banner);
  });

  // --- THE ULTIMATE MUTE ---
  // Temporarily disable console.info so vite-express stays quiet
  if (process.env.NODE_ENV === "production") {
    console.info = () => {};
  }

  ViteExpress.bind(app, server);
};

startServer();
