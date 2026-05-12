#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// 1. Define a persistent, hidden config file in the user's home directory
const configPath = path.join(os.homedir(), ".iris-config.json");

async function initCLI() {
  let config: { apiKey: string; voice: string } | null = null;

  // 2. Check if the config already exists
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (err) {
      console.log("Config file corrupted. Re-initializing...");
    }
  }

  // 3. If no config, run the Interactive First-Time Setup
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

    // Save to the user's home directory so they never have to do this again
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n[SYSTEM] Configuration saved to ${configPath}\n`);
  }

  // 4. Inject the saved configuration into the runtime environment
  process.env.GOOGLE_API_KEY = config.apiKey;
  process.env.IRIS_VOICE = config.voice; // We will read this in your voice agent

  console.log("[SYSTEM] Booting IRIS Neural Core...");

  // 5. Boot the actual backend server!
  // Note: Depending on your compiler, you might need to adjust this path to point to your compiled main.js
  await import("../src/server/main.js");
}

// Catch any hard crashes and exit cleanly
initCLI().catch((err) => {
  console.error("\n[FATAL ERROR] Failed to initialize IRIS:", err.message);
  process.exit(1);
});
