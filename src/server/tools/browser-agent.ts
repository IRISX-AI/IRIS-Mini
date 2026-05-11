import open from "open";
import { Server } from "socket.io";

export const browserToolDeclarations = [
  {
    name: "open_website",
    description:
      "Opens a specific website URL in the user's default web browser.",
    parameters: {
      type: "OBJECT",
      properties: {
        url: {
          type: "STRING",
          description:
            "The full URL to open, e.g., 'https://github.com' or 'https://chat.openai.com'",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "search_youtube",
    description:
      "Searches YouTube for a specific query or song and plays it in the browser.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description:
            "The search query, e.g., 'Blinding Lights The Weeknd' or 'Top 10 coders'",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_google",
    description: "Searches Google for a specific query to find information.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query to look up on Google.",
        },
      },
      required: ["query"],
    },
  },
];

export const handleBrowserAction = async (fc: any, io: Server) => {
  let resultStr = "";
  const args = fc.args as any;

  try {
    if (fc.name === "open_website") {
      await open(args.url);
      resultStr = `Success: Opened ${args.url} in the browser.`;
      io.emit("system_status", `[BROWSER] Opening URL: ${args.url}`);
    } else if (fc.name === "search_youtube") {
      // Format the query for YouTube search URL
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(args.query)}`;
      await open(searchUrl);
      resultStr = `Success: Searched YouTube for '${args.query}'`;
      io.emit("system_status", `[BROWSER] Searching YouTube: ${args.query}`);
    } else if (fc.name === "search_google") {
      // Format the query for Google search URL
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(args.query)}`;
      await open(searchUrl);
      resultStr = `Success: Searched Google for '${args.query}'`;
      io.emit("system_status", `[BROWSER] Searching Google: ${args.query}`);
    } else {
      resultStr = `Error: Function ${fc.name} not handled by Browser Agent.`;
    }
  } catch (err: any) {
    resultStr = `Error executing ${fc.name}: ${err.message}`;
    io.emit("system_status", `[BROWSER ERROR] ${err.message}`);
  }

  console.log(`[BROWSER-AGENT] ${resultStr}`);

  return {
    id: fc.id,
    name: fc.name,
    response: { result: resultStr },
  };
};
