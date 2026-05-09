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

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", agent: "IRIS-mini" });
  });

  // Placeholder for your future tools
  app.post("/api/agent/execute", (req, res) => {
    res.json({ message: "Ready for tools" });
  });

  if (!isProd) {
    // --- DEVELOPMENT: True HMR Mode ---
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          // This ensures HMR stays stable on port 5050
          server: undefined,
        },
      },
      appType: "custom",
      // Forces Vite to find the root config for Tailwind v4
      configFile: path.resolve(__dirname, "vite.config.ts"),
      root: path.resolve(__dirname, "client"),
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      // Skip API and Vite internal files
      if (url.startsWith("/api") || url.includes(".")) return next();

      try {
        let template = fs.readFileSync(
          path.resolve(__dirname, "client/index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // --- PRODUCTION: Static ---
    const clientDistPath = path.resolve(__dirname, "dist/client");
    app.use(express.static(clientDistPath));
    app.get("*", (req, res) =>
      res.sendFile(path.join(clientDistPath, "index.html")),
    );
  }

  return app;
}

export default createServer;
