#!/usr/bin/env node
process.env.NODE_NO_WARNINGS = "1";
import { confirm, input, select } from "@inquirer/prompts";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const configPath = path.join(os.homedir(), ".yana-mini-config.json");

const g = (s: string) => `\x1b[38;2;0;255;136m${s}\x1b[0m`;
const dg = (s: string) => `\x1b[38;2;0;160;80m${s}\x1b[0m`;
const cy = (s: string) => `\x1b[38;2;0;210;180m${s}\x1b[0m`;
const w = (s: string) => `\x1b[97m${s}\x1b[0m`;
const d = (s: string) => `\x1b[2m${s}\x1b[0m`;
const b = (s: string) => `\x1b[1m${s}\x1b[0m`;
const pu = (s: string) => `\x1b[38;2;160;100;255m${s}\x1b[0m`;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function type(text: string, ms = 15) {
  for (const ch of text) {
    process.stdout.write(ch);
    await sleep(ms);
  }
  process.stdout.write("\n");
}

async function spinner(label: string, ms = 700) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const end = Date.now() + ms;
  let i = 0;
  while (Date.now() < end) {
    process.stdout.write(`\r  ${g(frames[i % frames.length])}  ${d(label)}`);
    await sleep(70);
    i++;
  }
  process.stdout.write(`\r  ${g("✓")}  ${d(label)}\n`);
}

async function bar(label: string, ms = 600) {
  const W = 24;
  for (let i = 0; i <= W; i++) {
    const fill = g("█".repeat(i));
    const empty = d("░".repeat(W - i));
    const pct = d(`${String(Math.round((i / W) * 100)).padStart(3)}%`);
    process.stdout.write(
      `\r  ${dg(label.padEnd(20))}  ${fill}${empty}  ${pct}`,
    );
    await sleep(ms / W);
  }
  process.stdout.write("\n");
}

const LINE = "─".repeat(56);
function div(label = "") {
  if (!label) {
    console.log(dg(`  ${LINE}`));
    return;
  }
  const pad = Math.floor((56 - label.length - 2) / 2);
  const l = "─".repeat(pad);
  const r = "─".repeat(56 - pad - label.length - 2);
  console.log(dg(`  ${l} ${label} ${r}`));
}

const ln = () => console.log();
const info = (msg: string) => console.log(`  ${dg("›")}  ${d(msg)}`);
const ok = (msg: string) => console.log(`  ${g("✓")}  ${msg}`);
const hint = (msg: string) => console.log(`  ${cy("·")}  ${d(msg)}`);

function printBanner(mode: "setup" | "online") {
  console.clear();
  ln();
  console.log(g("  ██╗   ██╗ █████╗ ███╗   ██╗ █████╗ "));
  console.log(g("  ╚██╗ ██╔╝██╔══██╗████╗  ██║██╔══██╗"));
  console.log(g("   ╚████╔╝ ███████║██╔██╗ ██║███████║"));
  console.log(g("    ╚██╔╝  ██╔══██║██║╚██╗██║██╔══██║"));
  console.log(g("     ██║   ██║  ██║██║ ╚████║██║  ██║"));
  console.log(g("     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝"));
  ln();

  const tag =
    mode === "setup"
      ? `  ${cy("SETUP")}   ${d("·")}   ${d("Voice Assistant")}   ${d("·")}   ${pu("Powered by Gemini")}`
      : `  ${cy("ONLINE")}  ${d("·")}   ${d("Voice Assistant")}   ${d("·")}   ${pu("Powered by Gemini")}`;

  console.log(dg(`  ${LINE}`));
  console.log(tag);
  console.log(dg(`  ${LINE}`));

  if (mode === "online") {
    ln();
    console.log(
      `  ${dg("CRAFTED BY")}  ${w("Ashit")}`,
    );
    console.log(dg(`  ${LINE}`));
  }

  ln();
}

async function runSetup(): Promise<{ apiKey: string; voice: string }> {
  printBanner("setup");

  await type(
    `  ${dg("Looks like your first time here — let's get you set up.")}`,
    13,
  );
  ln();
  await sleep(200);

  div("  1 / 2  ·  API KEY  ");
  ln();
  const keyUrl = "https://aistudio.google.com/app/api-keys";
  console.log(
    `  ${cy("·")}  ${d("Get your free key at  →  ")}\x1b]8;;${keyUrl}\x07${cy(keyUrl)}\x1b]8;;\x07`,
  );
  ln();

  const apiKey = await input({
    message: g("  Gemini API key"),
    validate: (v) =>
      v.trim().length > 10 || "That doesn't look right — paste the full key.",
    transformer: (v) => v.trim(),
  });

  ln();
  await spinner("Validating key format", 480);
  ln();

  div("  2 / 2  ·  VOICE  ");
  ln();
  hint("You can change this anytime in  ~/.yana-mini-config.json");
  ln();

  const voice = await select({
    message: g("  Pick a voice"),
    choices: [
      {
        name: `${w("Lyra")}   ${d("Female  ·  warm, clear, expressive")}`,
        value: "Lyra",
        short: "Lyra",
      },
      {
        name: `${w("Puck")}   ${d("Male    ·  deep, calm, precise")}`,
        value: "Puck",
        short: "Puck",
      },
    ],
  });

  ln();

  div("  REVIEW  ");
  ln();
  info(
    `API key  →  ${"•".repeat(Math.max(0, apiKey.length - 6))}${apiKey.slice(-6)}`,
  );
  info(`Voice    →  ${voice}`);
  info(`Saved to →  ${configPath}`);
  ln();

  const confirmed = await confirm({
    message: g("  Save and launch YANA?"),
    default: true,
  });

  if (!confirmed) {
    ln();
    hint("No problem. Run  yana  again whenever you're ready.");
    ln();
    process.exit(0);
  }

  return { apiKey: apiKey.trim(), voice };
}

async function boot() {
  ln();
  div("  STARTING  ");
  ln();
  await bar("Loading config    ", 260);
  await bar("Connecting API    ", 500);
  await bar("Warming up server ", 420);
  await bar("Almost ready      ", 200);
  ln();
  console.log(
    `  ${b(g("YANA MINI is live."))}  ${d("Open your browser to start talking.")}`,
  );
  ln();
  div();
  ln();
  hint("Press  Ctrl + C  to stop.");
  ln();
}

async function initCLI() {
  let config: { apiKey: string; voice: string } | null = null;
  let firstRun = false;

  if (fs.existsSync(configPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (raw?.apiKey && raw?.voice) config = raw;
    } catch {}
  }

  if (!config) {
    firstRun = true;
    config = await runSetup();

    ln();
    await spinner("Saving configuration", 380);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    ok("Configuration saved.");
  } else {
    printBanner("online");
  }

  process.env.GOOGLE_API_KEY = config.apiKey;
  process.env.IRIS_VOICE = config.voice;

  await boot();

  await import("../src/server/main.ts");
}

initCLI().catch((err: Error) => {
  ln();
  console.log(
    `  \x1b[31m✗\x1b[0m  ${d("IRIS failed to start — " + err.message)}`,
  );
  ln();
  process.exit(1);
});
