import { Type, type FunctionDeclaration } from "@google/genai";
import * as fs from "fs";
import { Server } from "socket.io";

export const nexusToolDeclarations: FunctionDeclaration[] = [
  {
    name: "create_directory",
    description:
      "Creates a new directory/folder at the specified path on the local file system.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        dir_path: {
          type: Type.STRING,
          description:
            "The path of the directory to create, e.g., './new_folder' or 'src/components'",
        },
      },
      required: ["dir_path"],
    },
  },
  {
    name: "write_file",
    description:
      "Creates a new file or overwrites an existing file with the specified text content.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        file_path: {
          type: Type.STRING,
          description:
            "The path of the file to create, e.g., './index.js' or 'README.md'",
        },
        content: {
          type: Type.STRING,
          description: "The text content to write inside the file.",
        },
      },
      required: ["file_path", "content"],
    },
  },
];

export const handleNexusFs = (toolCall: any, io: Server) => {
  const functionResponses = [];

  for (const fc of toolCall.functionCalls) {
    let resultStr = "";

    try {
      const args = fc.args as any;

      if (fc.name === "create_directory") {
        fs.mkdirSync(args.dir_path, { recursive: true });
        resultStr = `Success: Directory created at ${args.dir_path}`;
        io.emit(
          "system_status",
          `[NEXUS-FS] Directory Created: ${args.dir_path}`,
        );
      } else if (fc.name === "write_file") {
        fs.writeFileSync(args.file_path, args.content);
        resultStr = `Success: File written at ${args.file_path}`;
        io.emit("system_status", `[NEXUS-FS] File Created: ${args.file_path}`);
      } else {
        resultStr = `Error: Function ${fc.name} not found.`;
      }
    } catch (err: any) {
      resultStr = `Error executing ${fc.name}: ${err.message}`;
      io.emit("system_status", `[NEXUS-FS ERROR] ${err.message}`);
    }

    functionResponses.push({
      id: fc.id,
      name: fc.name,
      response: { result: resultStr },
    });
  }

  return functionResponses;
};