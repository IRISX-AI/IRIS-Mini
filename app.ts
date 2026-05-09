import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- Connection Health Check ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "Neural Uplink Stable",
    timestamp: new Date().toISOString(),
  });
});

// Agentic Execute Route (placeholder for now)
app.post("/api/agent/execute", (req, res) => {
  res.json({ message: "Ready to execute commands" });
});

export default app;
