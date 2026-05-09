import app from "./app.js";
import chalk from "chalk";
import open from "open";
import Conf from "conf";

const config = new Conf({ projectName: "iris-mini" });
const PORT = 3000;

const startServer = async () => {
  // 1. Cool ASCII Art & Branding
  console.clear();
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
    chalk.white.bold("   IRIS-mini ") + chalk.green("Local Agentic OS v1.0.0"),
  );
  console.log(chalk.gray("  --------------------------------------------\n"));

  // 2. Status Indicators
  console.log(
    `${chalk.blue("ℹ")} ${chalk.white("Environment:")}  ${chalk.green("Local Dev")}`,
  );
  console.log(
    `${chalk.blue("ℹ")} ${chalk.white("Persona:")}      ${chalk.magenta(config.get("persona") || "Default")}`,
  );
  console.log(
    `${chalk.blue("ℹ")} ${chalk.white("Target Dir:")}   ${chalk.yellow(process.cwd())}`,
  );

  try {
    app.listen(PORT, () => {
      console.log(
        `\n${chalk.bgCyan.black.bold(" UPLINK ACTIVE ")} ${chalk.cyan(`Listening on http://localhost:${PORT}`)}`,
      );
      console.log(chalk.gray("Watching for agentic commands...\n"));

      // 3. Auto-open Browser
      open(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(chalk.red("\n✖ Critical Failure: Could not establish uplink."));
    process.exit(1);
  }
};

startServer();
