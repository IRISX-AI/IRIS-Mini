import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- THE AGENT'S HANDS (Backend Logic) ---
app.get("/api/health", (req, res) => {
  res.json({ status: "online", agent: "IRIS-mini" });
});

// --- SMART UI SERVING ---
const clientDistPath = path.resolve(__dirname, "dist/client");

if (fs.existsSync(clientDistPath)) {
  // If the build exists (Production mode)
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  // If the build is missing (Dev mode)
  app.get("/", (req, res) => {
    res.send(`
      <body style="background:#09090b; color:#4ade80; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">
        <h1>IRIS-mini <span style="color:#fff">Engine is Running</span></h1>
        <p style="color:#71717a;">The backend is active on port 5050.</p>
        <p>Go to <a href="http://localhost:5173" style="color:#4ade80;">http://localhost:5173</a> to see the UI (Vite Dev Mode).</p>
      </body>
    `);
  });
}

export default app;
