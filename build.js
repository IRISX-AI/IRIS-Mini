import * as esbuild from "esbuild";
import fs from "fs";

await esbuild
  .build({
    entryPoints: ["bin/iris-mini.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    minify: true,
    outfile: "dist/cli.js",
  })
  .catch(() => process.exit(1));

const file = "dist/cli.js";
let code = fs.readFileSync(file, "utf8");

code = code.replace(/^#!(.*)/gm, "");
code = code.trimStart();

const absoluteTop = `#!/usr/bin/env node\nprocess.env.NODE_ENV = "production";\n`;

fs.writeFileSync(file, absoluteTop + code);