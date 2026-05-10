import express from "express";
import ViteExpress from "vite-express";
import "../config/dot-env.js";
import { getAvailablePort } from "./lib/port-picker.js";

const app = express();

const startServer = async () => {
  const port = await getAvailablePort(6754, 8764);

  ViteExpress.listen(app, port, () => {
    console.clear();
    console.log(`Server is listening on http://localhost:${port}`);
  });
};

startServer();
