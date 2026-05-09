import createServer from "./app.js";
import chalk from "chalk";

const start = async () => {
  const app = await createServer();
  const port = 5050;

  app.listen(port, () => {
    console.clear();
    console.log(
      chalk.cyan.bold(`
   _____搁搁_____  ______搁搁搁搁搁   搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁  搁搁搁搁搁搁搁搁搁
    `),
    );
    console.log(
      chalk.green.bold(` SUCCESS `) +
        `IRIS-mini Unified Engine: http://localhost:${port}`,
    );
    console.log(
      chalk.gray(` Mode: ${process.env.NODE_ENV || "development"}\n`),
    );
  });
};

start();
