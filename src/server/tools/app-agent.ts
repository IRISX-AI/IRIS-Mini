import { Type, type FunctionDeclaration } from "@google/genai";
import fkill from "fkill";
import open, { openApp } from "open";
import * as os from "os";
import { Server } from "socket.io";

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

export const handleAppAction = async (fc: any, io: Server) => {
  let resultStr = "";
  const args = fc.args as any;

  try {
    if (fc.name === "open_app") {
      io.emit("system_status", `[APP] Launching: ${args.app_name}`);

      const platform = os.platform();
      const cleanName = args.app_name.toLowerCase().replace(".exe", "").trim();

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

      if (platform === "win32" && winMap[cleanName]) {
        await open(winMap[cleanName]);
      } else {
        await openApp(args.app_name);
      }

      resultStr = `Success: Launched ${args.app_name}.`;
    } else if (fc.name === "close_app") {
      io.emit("system_status", `[APP] Terminating: ${args.app_name}`);

      await fkill(args.app_name, { force: true, ignoreCase: true });

      resultStr = `Success: Terminated ${args.app_name}.`;
    }
  } catch (err: any) {
    resultStr = `Error managing ${args.app_name}. Details: ${err.message}`;
    io.emit("system_status", `[APP ERROR] Failed to manage ${args.app_name}`);
  }

  console.log(`[APP-AGENT] ${resultStr}`);

  return {
    id: fc.id,
    name: fc.name,
    response: { result: resultStr },
  };
};
