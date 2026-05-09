import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const isProd = process.env.NODE_ENV === "production";

  app.get("/api/health", (req, res) => {
    res.json({ status: "online", mode: isProd ? "production" : "development" });
  });

  if (!isProd) {
    // --- DEVELOPMENT: Vite Middleware Mode ---
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      // CRITICAL FIX: Point to the root config so Tailwind v4 plugin is loaded
      configFile: path.resolve(__dirname, "vite.config.ts"),
      root: path.resolve(__dirname, "client"),
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // Read the index.html from the client folder
        let template = fs.readFileSync(
          path.resolve(__dirname, "client/index.html"),
          "utf-8",
        );

        // Transform the HTML through Vite (injects HMR and Tailwind styles)
        template = await vite.transformIndexHtml(url, template);

        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // --- PRODUCTION: Static Serve ---
    // This is where the compiled HTML/CSS/JS lives after 'npm run build'
    const clientDistPath = path.resolve(__dirname, "dist/client");

    app.use(express.static(clientDistPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(clientDistPath, "index.html"));
    });
  }

  return app;
}

export default createServer;
