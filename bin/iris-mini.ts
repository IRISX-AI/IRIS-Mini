#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const configPath = path.join(os.homedir(), ".iris-config.json");

async function initCLI() {
  let config: { apiKey: string; voice: string } | null = null;

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (err) {
      console.log("Config file corrupted. Re-initializing...");
    }
  }

  if (!config || !config.apiKey || !config.voice) {
    console.clear();
    console.log("==================================================");
    console.log("   IRIS NEURAL LINK :: FIRST TIME INITIALIZATION  ");
    console.log("==================================================\n");

    const apiKey = await input({
      message: "Enter your Google Gemini API Key:",
      validate: (value) => value.length > 10 || "Please enter a valid API key.",
    });

    const voice = await select({
      message: "Select IRIS's voice profile:",
      choices: [
        { name: "Female (Lyra)", value: "Lyra" },
        { name: "Male (Puck)", value: "Puck" }, // Puck is the standard Gemini male voice
      ],
    });

    config = { apiKey, voice };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n[SYSTEM] Configuration saved to ${configPath}\n`);
  }

  process.env.GOOGLE_API_KEY = config.apiKey;
  process.env.IRIS_VOICE = config.voice; // We will read this in your voice agent

  console.log("[SYSTEM] Booting IRIS Neural Core...");

  process.env.NODE_ENV = "production";

  await import("../src/server/main.ts");
}

initCLI().catch((err) => {
  console.error("\n[FATAL ERROR] Failed to initialize IRIS:", err.message);
  process.exit(1);
});
