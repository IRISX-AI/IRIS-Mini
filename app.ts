import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 1. Point to the build folder
// During dev, this might be empty until you run 'npm run build'
const clientDistPath = path.resolve(__dirname, "dist/client");

// 2. Serve static files (js, css, images)
app.use(express.static(clientDistPath));

// 3. API Routes go here
app.get("/api/health", (req, res) => {
  res.json({ status: "online", agent: "IRIS-mini" });
});

// 4. The "Catch-All" route
// If Express doesn't recognize a route, it sends the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

export default app;
