import express from "express";
import http from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import { startIrisVoice, stopIrisVoice } from "./agent/iris-voice.js";
import { getAvailablePort } from "./lib/port-picker.js";

if (process.env.NODE_ENV === "production") {
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = (
    chunk: any,
    encoding?: any,
    callback?: any,
  ): boolean => {
    if (typeof chunk === "string" && chunk.includes("[vite-express]")) {
      return true;
    }
    return originalStdoutWrite(chunk, encoding, callback);
  };
}

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
\x1b[36m CREATED BY \x1b[0m Harsh (\x1b[32m@irisxai\x1b[0m)
\x1b[36m GITHUB     \x1b[0m https://github.com/201Harsh
\x1b[36m INSTAGRAM  \x1b[0m https://www.instagram.com/201harshs/
========================================================
`;
    process.stdout.write(banner + "\n");
  });

  ViteExpress.bind(app, server);
};

startServer();
