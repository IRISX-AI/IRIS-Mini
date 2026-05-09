import "../config/dot-env.js";
import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

const port: any = process.env.PORT || 8762;

ViteExpress.listen(app, port, () =>
  console.log(`Server is Starting on http://localhost:${port}`),
);
