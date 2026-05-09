import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- Agentic API Section ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "Neural Uplink Stable",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/agent/execute", (req, res) => {
  res.json({ message: "Ready to execute commands" });
});

// --- Static File Logic ---
// We point to 'client/dist' for production or 'client' for static assets
const clientPath = path.resolve(__dirname, "client/dist");
app.use(express.static(clientPath));

// Fallback: If someone visits 5050 directly and the file isn't found
app.get("*", (req, res) => {
  // If it's not an API call, send the index.html
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientPath, "index.html"), (err) => {
      if (err) {
        // If the build doesn't exist yet, show a friendly dev message
        res.status(200).send(`
                    <body style="background:#09090b;color:#4ade80;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
                        <h1>IRIS-mini CORE</h1>
                        <p style="color:#71717a;">The API is online, but the UI build is missing.</p>
                        <p>Visit <a href="http://localhost:5173" style="color:#fff;">http://localhost:5173</a> for Development UI.</p>
                    </body>
                `);
      }
    });
  }
});

export default app;
