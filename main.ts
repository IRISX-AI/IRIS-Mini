import app from "./app.js"; // MUST BE .js
import chalk from "chalk";
import { getAvailablePort } from "./lib/config.js"; // MUST BE .js

const INITIAL_PORT = 5050; // Your custom unusual port

const startServer = async () => {
  const port = await getAvailablePort(INITIAL_PORT);

  // We print this BEFORE app.listen to ensure we see the attempt
  console.log(chalk.cyan("\n[CORE] Starting Neural Engine..."));

  app.listen(port, () => {
    console.log(
      chalk.green.bold(`
   _____搁搁_____  ______搁搁搁搁搁   搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
  `),
    );
    console.log(
      `${chalk.bgGreen.black.bold(" SUCCESS ")} IRIS-mini Core Uplink: ${chalk.cyan(`http://localhost:${port}`)}`,
    );
  });
};

startServer().catch((err) => {
  console.error(chalk.red("[CORE] ERROR:"), err);
});
