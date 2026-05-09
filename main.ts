import app from "./app.js";
import chalk from "chalk";
import open from "open";
import Conf from "conf";
import { getAvailablePort } from "./lib/config.js";

const config = new Conf({ projectName: "iris-mini" });
const INITIAL_PORT = 5050; // Unusual port choice

const startServer = async () => {
  const port = await getAvailablePort(INITIAL_PORT);

  console.log(
    chalk.cyan.bold(`
   _____搁搁_____  ______搁搁搁搁搁   搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
     搁搁搁      搁搁搁   搁搁搁     搁搁搁   搁搁搁
     搁搁搁      搁搁搁搁搁搁搁搁搁     搁搁搁   搁搁搁搁搁搁搁搁搁
     搁搁搁      搁搁搁  搁搁搁      搁搁搁           搁搁搁
   搁搁搁搁搁搁搁搁搁  搁搁搁   搁搁搁  搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
  `),
  );

  console.log(chalk.gray("  --------------------------------------------"));
  console.log(
    chalk.white.bold("   IRIS-mini ") + chalk.green("Neural Uplink Stable"),
  );
  console.log(chalk.gray("  --------------------------------------------\n"));

  app.listen(port, () => {
    console.log(
      `${chalk.bgGreen.black.bold(" SUCCESS ")} ${chalk.white("Agent server online at:")} ${chalk.cyan(`http://localhost:${port}`)}`,
    );
    console.log(
      `${chalk.blue("ℹ")} ${chalk.white("Persona:")} ${chalk.magenta(config.get("persona") || "Unset")}`,
    );

    // In a real CLI, we only open the browser once the server is actually ready
    if (process.env.NODE_ENV !== "development") {
      open(`http://localhost:${port}`);
    }
  });
};

startServer().catch((err) => {
  console.error(chalk.red("Failed to ignite IRIS core:"), err);
});
