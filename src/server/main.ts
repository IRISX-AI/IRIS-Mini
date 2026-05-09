import "../config/dot-env.js";
import express from "express";
import ViteExpress from "vite-express";
import chalk from "chalk";
import { getAvailablePort } from "./lib/port-picker.js";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

const startServer = async () => {
  const port = await getAvailablePort(6753, 8762);

  ViteExpress.listen(app, port, () => {
    console.clear();
    console.log(
      chalk.cyan.bold(`
   _____搁搁_____  ______搁搁搁搁搁   搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
    `),
    );
    console.log(
      chalk.green.bold(` SUCCESS `) +
        chalk.white(`IRIS-mini Engine active at: `) +
        chalk.underline.blue(`http://localhost:${port}`),
    );
  });
};

startServer();
