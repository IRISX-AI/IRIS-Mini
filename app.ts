import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", agent: "IRIS-mini" });
  });

  // --- STATIC SERVE (The "Everything" Handler) ---
  // Since Vite is building to /dist/client, we just serve that.
  const clientDistPath = path.resolve(__dirname, "dist/client");

  app.use(express.static(clientDistPath));

  app.get("*", (req, res) => {
    // Fallback to index.html for SPA routing
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  return app;
}

export default createServer;
