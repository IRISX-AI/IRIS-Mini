import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

// ESM path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Agentic API Section ---

// Example: Create File/Folder Tool
app.post("/api/agent/execute", async (req, res) => {
  const { action, name, content, targetPath = "" } = req.body;
  const fullPath = path.join(process.cwd(), targetPath, name);

  try {
    if (action === "create_folder") {
      await fs.ensureDir(fullPath);
      return res.json({
        status: "success",
        message: `Folder created: ${name}`,
      });
    }

    if (action === "create_file") {
      await fs.outputFile(fullPath, content || "");
      return res.json({ status: "success", message: `File created: ${name}` });
    }

    res.status(400).json({ status: "error", message: "Unknown action" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// --- Static Frontend Serving ---

// In production, we serve the built Vite files from /dist/client
const clientPath = path.join(__dirname, "client");
app.use(express.static(clientPath));

// SPA Fallback: Redirect all non-API requests to the React index.html
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientPath, "index.html"));
  }
});

export default app;
