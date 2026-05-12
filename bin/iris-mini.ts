#!/usr/bin/env node
import { confirm, input, select } from "@inquirer/prompts";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const configPath = path.join(os.homedir(), ".iris-config.json");

// ── ANSI color helpers ────────────────────────────────────────────────────────
const c = {
  green: (s: string) => `\x1b[38;2;0;255;136m${s}\x1b[0m`,
  dimGreen: (s: string) => `\x1b[38;2;0;140;70m${s}\x1b[0m`,
  teal: (s: string) => `\x1b[38;2;0;210;180m${s}\x1b[0m`,
  white: (s: string) => `\x1b[97m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  reset: "\x1b[0m",
};

// ── Sleep helper ──────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ── Typewriter effect ─────────────────────────────────────────────────────────
async function typewrite(text: string, delay = 18) {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  process.stdout.write("\n");
}

// ── Animated progress bar ─────────────────────────────────────────────────────
async function progressBar(label: string, durationMs = 800) {
  const width = 28;
  const steps = width;
  const stepMs = durationMs / steps;
  process.stdout.write(`  ${c.dimGreen(label.padEnd(18))} [`);
  for (let i = 0; i < steps; i++) {
    await sleep(stepMs);
    const filled = "█".repeat(i + 1);
    const empty = "░".repeat(steps - i - 1);
    process.stdout.write(
      `\r  ${c.dimGreen(label.padEnd(18))} [${c.green(filled)}${c.dim(empty)}]`,
    );
  }
  process.stdout.write(
    `\r  ${c.dimGreen(label.padEnd(18))} [${c.green("█".repeat(width))}] ${c.dimGreen("done")}\n`,
  );
}

// ── Banner ────────────────────────────────────────────────────────────────────
function printBanner() {
  const lines = [
    "",
    c.green("  ██╗██████╗ ██╗███████╗"),
    c.green("  ██║██╔══██╗██║██╔════╝"),
    c.green("  ██║██████╔╝██║███████╗"),
    c.green("  ██║██╔══██╗██║╚════██║"),
    c.green("  ██║██║  ██║██║███████║"),
    c.green("  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝"),
    "",
    c.dimGreen("  ── Intelligent Response & Interaction System ──"),
    "",
    c.dim("  v1.0.0  ·  Voice Assistant  ·  Powered by Gemini"),
    "",
  ];
  lines.forEach((l) => console.log(l));
}

// ── Section divider ───────────────────────────────────────────────────────────
function divider(label?: string) {
  const line = "─".repeat(46);
  if (label) {
    const pad = Math.floor((46 - label.length - 2) / 2);
    console.log(
      c.dimGreen(
        `  ${"─".repeat(pad)} ${label} ${"─".repeat(46 - pad - label.length - 2)}`,
      ),
    );
  } else {
    console.log(c.dimGreen(`  ${line}`));
  }
}

// ── Status message ────────────────────────────────────────────────────────────
function info(msg: string) {
  console.log(`  ${c.dimGreen("›")} ${c.dim(msg)}`);
}
function success(msg: string) {
  console.log(`  ${c.green("✓")} ${msg}`);
}
function warn(msg: string) {
  console.log(`  ${c.teal("!")} ${c.dim(msg)}`);
}

// ── First-run setup flow ──────────────────────────────────────────────────────
async function runSetup(): Promise<{ apiKey: string; voice: string }> {
  console.clear();
  printBanner();

  divider("FIRST TIME SETUP");
  console.log();
  await typewrite(
    c.dimGreen("  Welcome. Let's get IRIS ready in under a minute."),
    14,
  );
  console.log();

  // Step 1 – API key
  divider("STEP 1  ·  API ACCESS");
  console.log();
  info("Get your key at: aistudio.google.com/app/apikey");
  console.log();

  const apiKey = await input({
    message: c.green("  Gemini API key"),
    validate: (v) => v.trim().length > 10 || "Please enter a valid API key.",
    transformer: (v) => v.trim(),
  });

  console.log();

  // Step 2 – Voice
  divider("STEP 2  ·  VOICE");
  console.log();

  const voice = await select({
    message: c.green("  Choose a voice"),
    choices: [
      {
        name: `${c.white("Lyra")}  ${c.dim("— Female · warm & clear")}`,
        value: "Lyra",
        short: "Lyra",
      },
      {
        name: `${c.white("Puck")}  ${c.dim("— Male  · deep & steady")}`,
        value: "Puck",
        short: "Puck",
      },
    ],
  });

  console.log();

  divider("CONFIRM");
  console.log();
  info(
    `API key  : ${"*".repeat(Math.max(0, apiKey.length - 6))}${apiKey.slice(-6)}`,
  );
  info(`Voice    : ${voice}`);
  info(`Config   : ${configPath}`);
  console.log();

  const ok = await confirm({
    message: c.green("  Save and launch?"),
    default: true,
  });

  if (!ok) {
    console.log();
    warn("Setup cancelled. Run again whenever you're ready.");
    console.log();
    process.exit(0);
  }

  return { apiKey: apiKey.trim(), voice };
}

async function bootSequence(isFirstRun: boolean) {
  console.log();
  divider(isFirstRun ? "INITIALIZING" : "STARTING");
  console.log();

  await progressBar("Loading config", 320);
  await progressBar("Connecting API", 560);
  await progressBar("Starting server", 480);
  await progressBar("Ready", 200);

  console.log();
  success(c.bold("IRIS is online."));
  console.log();
  divider();
  console.log();
  info("Open your browser to use the voice assistant.");
  info("Press  Ctrl + C  to stop.");
  console.log();
}

async function initCLI() {
  let config: { apiKey: string; voice: string } | null = null;
  let isFirstRun = false;

  if (fs.existsSync(configPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (raw?.apiKey && raw?.voice) config = raw;
      else warn("Config incomplete — running setup again.");
    } catch {
      warn("Config unreadable — running setup again.");
    }
  }

  if (!config) {
    isFirstRun = true;
    config = await runSetup();

    console.log();
    info("Saving configuration...");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    success("Configuration saved.");
  } else {
    console.clear();
    printBanner();
  }

  process.env.GOOGLE_API_KEY = config.apiKey;
  process.env.IRIS_VOICE = config.voice;

  await bootSequence(isFirstRun);

  await import("../src/server/main.ts");
}

initCLI().catch((err: Error) => {
  console.log();
  console.log(`  \x1b[31m✗\x1b[0m  ${c.dim("IRIS failed to start.")}`);
  console.log(`     ${c.dim(err.message)}`);
  console.log();
  process.exit(1);
});
