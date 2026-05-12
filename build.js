import * as esbuild from "esbuild";

await esbuild
  .build({
    entryPoints: ["bin/iris-mini.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    minify: true,
    banner: {
      js: "#!/usr/bin/env node", // Guarantees this is on line 1
    },
    outfile: "dist/cli.js",
  })
  .catch(() => process.exit(1));

console.log("CLI Build Complete.");
