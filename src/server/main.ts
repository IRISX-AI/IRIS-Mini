import "../config/dot-env.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
import { startIrisVoice, stopIrisVoice } from "./agent/iris-voice.js";
import { getAvailablePort } from "./lib/port-picker.js";
import path from "path";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV === "production") {
  const originalStdout = process.stdout.write.bind(process.stdout);
  process.stdout.write = ((chunk: any, encoding?: any, callback?: any): boolean => {
    if (typeof chunk === "string" && chunk.includes("[vite-express]")) return true;
    return originalStdout(chunk, encoding, callback);
  }) as any;

  const originalStderr = process.stderr.write.bind(process.stderr);
  process.stderr.write = ((chunk: any, encoding?: any, callback?: any): boolean => {
    if (typeof chunk === "string" && (chunk.includes("DEP0205") || chunk.includes("DeprecationWarning"))) {
      return true;
    }
    return originalStderr(chunk, encoding, callback);
  }) as any;

  process.on("warning", (warning) => {
    if (warning.name === "DeprecationWarning") return;
  });
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
  socket.on("Yana_Connected", (msg) => {
    startIrisVoice(io);
  });

  socket.on("Yana_Disconnected", (msg) => {
    stopIrisVoice(io);
  });

  socket.on("disconnect", () => {
    stopIrisVoice(io);
  });
});

const startServer = async () => {
  const port = await getAvailablePort(6753, 8769);

  server.listen(port, () => {
    console.clear();
    console.clear();

    const banner = `
\x1b[38;2;236;72;153m
  ██╗   ██╗ █████╗ ███╗   ██╗ █████╗ 
  ╚██╗ ██╔╝██╔══██╗████╗  ██║██╔══██╗
   ╚████╔╝ ███████║██╔██╗ ██║███████║
    ╚██╔╝  ██╔══██║██║╚██╗██║██╔══██║
     ██║   ██║  ██║██║ ╚████║██║  ██║
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
\x1b[0m
\x1b[38;2;168;85;247m [ NEURAL CORE ONLINE ]\x1b[0m
\x1b[38;2;236;72;153m [ UI PORT ] \x1b[0m http://localhost:${port}
\x1b[38;2;236;72;153m [ AGENT ]   \x1b[0m Awaiting Connection...
\x1b[90m [ EXIT ]    \x1b[0m Press \x1b[31mCtrl + C\x1b[0m to stop
========================================================
\x1b[38;2;168;85;247m CRAFTED BY \x1b[0m Ashit
\x1b[38;2;168;85;247m POWERED BY \x1b[0m Gemini Live API
========================================================
`;
    process.stdout.write(banner + "\n");
  });

  if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(express.static(__dirname));

    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });
  } else {
    ViteExpress.bind(app, server);
  }
};

startServer();
