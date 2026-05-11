import { Type, type FunctionDeclaration } from "@google/genai";
import { exec } from "child_process";
import * as os from "os";
import { Server } from "socket.io";
import { promisify } from "util";

// Promisify exec so we can await shell commands natively
const execAsync = promisify(exec);

// --- 1. THE TOOL DECLARATIONS ---
export const appToolDeclarations: FunctionDeclaration[] = [
  {
    name: "open_app",
    description: "Opens a specific application on the user's local computer.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        app_name: {
          type: Type.STRING,
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
      type: Type.OBJECT,
      properties: {
        app_name: {
          type: Type.STRING,
          description: "The system name of the application to close.",
        },
      },
      required: ["app_name"],
    },
  },
];

// --- 2. THE EXECUTION HANDLER ---
export const handleAppAction = async (fc: any, io: Server) => {
  let resultStr = "";
  const args = fc.args as any;
  const platform = os.platform(); // Detects OS: 'win32', 'darwin', 'linux'

  try {
    if (fc.name === "open_app") {
      io.emit("system_status", `[APP] Launching: ${args.app_name}`);

      if (platform === "win32") {
        // Windows: use 'start'
        await execAsync(`start ${args.app_name}`);
      } else if (platform === "darwin") {
        // Mac: use 'open -a'
        await execAsync(`open -a "${args.app_name}"`);
      } else {
        // Linux: try executing the name directly
        await execAsync(`${args.app_name}`);
      }

      resultStr = `Success: Launched ${args.app_name}.`;
    } else if (fc.name === "close_app") {
      io.emit("system_status", `[APP] Terminating: ${args.app_name}`);

      if (platform === "win32") {
        // Windows: taskkill requires the .exe extension
        // We append .exe dynamically just in case Gemini forgets it
        const exeName = args.app_name.endsWith(".exe")
          ? args.app_name
          : `${args.app_name}.exe`;
        await execAsync(`taskkill /IM "${exeName}" /F`);
      } else {
        // Mac and Linux: killall
        await execAsync(`killall "${args.app_name}"`);
      }

      resultStr = `Success: Terminated ${args.app_name}.`;
    }
  } catch (err: any) {
    // If the app name is slightly wrong, the OS will throw an error. We catch it and tell Gemini.
    resultStr = `Error managing ${args.app_name}. Note: System process names must be exact. Details: ${err.message}`;
    io.emit("system_status", `[APP ERROR] Check terminal logs.`);
  }

  console.log(`[APP-AGENT] ${resultStr}`);

  return {
    id: fc.id,
    name: fc.name,
    response: { result: resultStr },
  };
};
