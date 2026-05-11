import { exec } from "child_process";
import * as os from "os";
import { Server } from "socket.io";
import { promisify } from "util";

const execAsync = promisify(exec);

export const appToolDeclarations = [
  {
    name: "open_app",
    description: "Opens a specific application on the user's local computer.",
    parameters: {
      type: "OBJECT",
      properties: {
        app_name: {
          type: "STRING",
          description:
            "The exact system name of the application, e.g., 'Spotify', 'Calculator', 'Code', 'Notepad'",
        },
      },
      required: ["app_name"],
    },
  },
  {
    name: "close_app",
    description:
      "Force closes a currently running application on the user's computer.",
    parameters: {
      type: "OBJECT",
      properties: {
        app_name: {
          type: "STRING",
          description: "The system name of the application to close.",
        },
      },
      required: ["app_name"],
    },
  },
];

export const handleAppAction = async (fc: any, io: Server) => {
  let resultStr = "";
  const args = fc.args as any;
  const platform = os.platform();

  try {
    if (fc.name === "open_app") {
      io.emit("system_status", `[APP] Launching: ${args.app_name}`);

      if (platform === "win32") {
        // --- THE FIX: Windows UWP Translation Map ---
        const winMap: Record<string, string> = {
          camera: "microsoft.windows.camera:",
          settings: "ms-settings:",
          calculator: "calc",
          paint: "ms-paint:",
          photos: "ms-photos:",
          mail: "outlookmail:",
          clock: "ms-clock:",
          weather: "msnweather:",
          explorer: "explorer",
          notepad: "notepad",
        };

        // Clean up the name Gemini sends (lowercase, remove .exe if present)
        const cleanName = args.app_name
          .toLowerCase()
          .replace(".exe", "")
          .trim();

        // If it's in our map, use the secret URI. Otherwise, try what Gemini suggested.
        const command = winMap[cleanName] || args.app_name;

        await execAsync(`start ${command}`);
      } else if (platform === "darwin") {
        await execAsync(`open -a "${args.app_name}"`);
      } else {
        await execAsync(`${args.app_name}`);
      }

      resultStr = `Success: Launched ${args.app_name}.`;
    } else if (fc.name === "close_app") {
      io.emit("system_status", `[APP] Terminating: ${args.app_name}`);

      if (platform === "win32") {
        const exeName = args.app_name.toLowerCase().endsWith(".exe")
          ? args.app_name
          : `${args.app_name}.exe`;
        await execAsync(`taskkill /IM "${exeName}" /F`);
      } else {
        await execAsync(`killall "${args.app_name}"`);
      }

      resultStr = `Success: Terminated ${args.app_name}.`;
    }
  } catch (err: any) {
    resultStr = `Error managing ${args.app_name}. System process names must be exact. Details: ${err.message}`;
    io.emit("system_status", `[APP ERROR] Failed to manage ${args.app_name}`);
  }

  console.log(`[APP-AGENT] ${resultStr}`);

  return {
    id: fc.id,
    name: fc.name,
    response: { result: resultStr },
  };
};
