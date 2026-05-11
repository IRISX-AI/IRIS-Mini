import {
  EndSensitivity,
  GoogleGenAI,
  Modality,
  StartSensitivity,
  type LiveServerMessage,
} from "@google/genai";
import Decibri from "decibri";
import { Server } from "socket.io";
const { DecibriOutput } = Decibri;

let isRunning = false;
let closeSessionFn: (() => void) | null = null;

export const startIrisVoice = (io: Server) => {
  if (isRunning) return;
  isRunning = true;
  io.emit("system_status", "IRIS-MINI : Connected");

  live()
    .then((fn) => {
      closeSessionFn = fn;
    })
    .catch(console.error);
};

export const stopIrisVoice = (io: Server) => {
  if (!isRunning) return;
  isRunning = false;
  io.emit("system_status", "IRIS-MINI : Disconnected");

  if (closeSessionFn) {
    closeSessionFn();
    closeSessionFn = null;
  }
};

const ai = new GoogleGenAI({
  apiKey: (process.env.GOOGLE_API_KEY as string) || "",
});

const model = "gemini-3.1-flash-live-preview";
const config = {
  responseModalities: [Modality.AUDIO],
  systemInstruction: "You are IRIS. An AI voice assistant created by Harsh.",
  automaticActivityDetection: {
    disabled: true,
    startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
    endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
    prefixPaddingMs: 20,
    silenceDurationMs: 100,
  },
  speechConfig: {
    voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
  },
};

async function live() {
  const responseQueue: LiveServerMessage[] = [];
  const audioQueue: Buffer[] = [];
  let speaker: any | null = null;

  async function waitMessage(): Promise<LiveServerMessage> {
    while (responseQueue.length === 0) {
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
    return responseQueue.shift()!;
  }

  function createSpeaker() {
    if (speaker) {
      speaker.end();
    }
    speaker = new DecibriOutput({
      channels: 1,
      format: "int16",
      sampleRate: 24000,
    });
    speaker.on("error", (err: Error) => console.error("Speaker error:", err));
  }

  async function messageLoop() {
    while (true) {
      const message = await waitMessage();
      if (message.serverContent && message.serverContent.interrupted) {
        audioQueue.length = 0;
        if (speaker) {
          speaker.stop();
          createSpeaker();
        }
        continue;
      }
      if (
        message.serverContent &&
        message.serverContent.modelTurn &&
        message.serverContent.modelTurn.parts
      ) {
        for (const part of message.serverContent.modelTurn.parts) {
          if (part.inlineData && part.inlineData.data) {
            audioQueue.push(Buffer.from(part.inlineData.data, "base64"));
          }
        }
      }
      if (message.serverContent && message.serverContent.turnComplete) {
      }
    }
  }

  async function playbackLoop() {
    while (true) {
      if (audioQueue.length === 0) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      } else {
        if (!speaker) createSpeaker();
        const chunk = audioQueue.shift()!;
        await new Promise<void>((resolve) => {
          speaker!.write(chunk, () => resolve());
        });
      }
    }
  }

  messageLoop();
  playbackLoop();

  const session = await ai.live.connect({
    model: model,
    config: config,
    callbacks: {
      onopen: () => console.log("Connected to Gemini Live API"),
      onmessage: (message: LiveServerMessage) => {
        responseQueue.push(message);
        const content = message.serverContent;
        if (content?.inputTranscription) {
          console.log("User:", content.inputTranscription.text);
        }
        if (content?.outputTranscription) {
          console.log("Gemini:", content.outputTranscription.text);
        }
      },
      onerror: (e: ErrorEvent) => console.error("Error:", e.message),
      onclose: (e: CloseEvent) => console.log("Closed:", e.reason),
    },
  });

  const micInstance: any = new Decibri({
    sampleRate: 16000,
    framesPerBuffer: 1600,
    channels: 1,
  });

  micInstance.on("data", (data: Buffer) => {
    session.sendRealtimeInput({
      audio: {
        data: data.toString("base64"),
        mimeType: "audio/pcm;rate=16000",
      },
    });
  });

  micInstance.on("error", (err: Error) => {
    console.error("Microphone error:", err);
  });

  console.log("Microphone started. Speak now...");

  const closeSession = () => {
    micInstance.stop();
    session.close();
    isRunning = false;
  };
  return closeSession;
}
