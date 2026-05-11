import * as fs from "fs";
import * as path from "path";

const memoryFile = path.join(process.cwd(), "data", "memory.json");

export function getMemory() {
  if (!fs.existsSync(memoryFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(memoryFile, "utf-8"));
  } catch {
    return [];
  }
}

export function addMemory(role: string, text: string) {
  const dir = path.dirname(memoryFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let mem = getMemory();
  mem.push({ role, text, timestamp: new Date().toLocaleString() });

  if (mem.length > 10) mem = mem.slice(mem.length - 10);

  fs.writeFileSync(memoryFile, JSON.stringify(mem, null, 2));
}

export function getMemoryContextString() {
  const mem = getMemory();
  if (mem.length === 0) return "No previous conversation history.";

  return mem
    .map((m: any) => `[${m.role}] (${m.timestamp}): ${m.text}`)
    .join("\n");
}
