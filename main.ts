import app from "./app.js"; // MUST BE .js
import chalk from "chalk";
import { getAvailablePort } from "./lib/config.js"; // MUST BE .js

const INITIAL_PORT = 5050; // Your custom unusual port

// main.ts
// ... (rest of your imports)

const startServer = async () => {
  const port = 5050; // Let's keep it simple while we debug

  // Specify '127.0.0.1' explicitly
  app.listen(port, "127.0.0.1", () => {
    console.log(
      chalk.green.bold(`\n SUCCESS `) +
        `IRIS-mini Uplink: http://127.0.0.1:${port}`,
    );
  });
};

startServer();
