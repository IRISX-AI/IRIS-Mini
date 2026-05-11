import { Power } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Slide, toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import AICore from "../utils/AICore";

let socket: Socket;

type TranscriptMsg = {
  id: number;
  role: string;
  text: string;
  isFinal: boolean;
};

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io();

    socket.on("system_status", (msg: string) => {
      if (msg === "IRIS-MINI : Connected") {
        toast.success(msg, {
          position: "top-left",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
      } else if (msg === "IRIS-MINI : Disconnected") {
        setIsSpeaking(false);
        toast.error(msg, {
          position: "top-left",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
      }

      setTranscripts((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), role: "SYSTEM", text: msg, isFinal: true },
      ]);
    });

    socket.on("transcript_chunk", (msg: { role: string; text: string }) => {
      if (msg.role === "AGENT") {
        setIsSpeaking(true);
      }

      setTranscripts((prev) => {
        if (prev.length === 0) {
          return [
            { id: Date.now() + Math.random(), role: msg.role, text: msg.text, isFinal: false },
          ];
        }

        const lastIndex = prev.length - 1;
        const lastMsg = prev[lastIndex];

        if (lastMsg.role === msg.role && !lastMsg.isFinal) {
          const updated = [...prev];
          updated[lastIndex].text += msg.text;
          return updated;
        } else {
          return [
            ...prev,
            { id: Date.now() + Math.random(), role: msg.role, text: msg.text, isFinal: false },
          ];
        }
      });
    });

    socket.on("turn_complete", () => {
      setIsSpeaking(false);
      setTranscripts((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[prev.length - 1].isFinal = true;
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  const handleConnect = () => {
    if (!isConnected) {
      socket.emit("Iris_Connected", "Iris Connected");
      setIsConnected(true);
    } else {
      socket.emit("Iris_Disconnected", "Iris Disconnected");
      setIsConnected(false);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="h-screen w-full bg-green-400/5 text-white font-sans flex flex-col lg:flex-row overflow-hidden pointer-events-auto select-none">
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col px-8 lg:px-16 py-10 lg:py-16 border-b lg:border-b-0 lg:border-r border-[#111] z-10">
        <div className="flex-none">
          <h1 className="text-xl font-bold mb-1 text-white">IRIS-MINI</h1>
          <p className="text-[11px] text-[#00ff41]/60 font-mono tracking-widest uppercase">
            Local Server :: Port 6754 :: Secure Connection
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 py-8 pr-4 font-mono scrollbar-thin scrollbar-thumb-[#1a1a1a] flex flex-col justify-start"
        >
          {transcripts.length === 0 ? (
            <div className="bg-[#111] rounded-xl p-4 text-[13px] text-gray-400 w-fit max-w-[85%] leading-relaxed border border-[#222]">
              [System] Uplink initialized. Node standing by.
            </div>
          ) : (
            transcripts.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "SYSTEM"
                    ? "bg-[#111] rounded-xl p-4 text-[13px] text-gray-400 w-fit max-w-[85%] leading-relaxed border border-[#222]"
                    : msg.role === "USER"
                      ? "bg-[#1a1a1a] rounded-xl p-4 text-[13px] text-white w-fit max-w-[85%] leading-relaxed border border-[#333] self-end ml-auto"
                      : "bg-[#00ff41]/5 rounded-xl p-4 text-[13px] text-[#00ff41] w-fit max-w-[85%] leading-relaxed border border-[#00ff41]/20"
                }
              >
                {msg.role === "SYSTEM" ? `[System] ${msg.text}` : msg.text}
                {!msg.isFinal && msg.role !== "SYSTEM" && (
                  <span className="animate-pulse ml-1 text-[#00ff41]">_</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex-none pt-6 font-mono">
          <div className="h-6 mb-4 flex items-center">
            <span
              className={`text-[10px] tracking-[0.2em] uppercase font-bold ${isConnected ? "text-[#00ff41] animate-pulse" : "text-gray-600"}`}
            >
              {isConnected
                ? "Connection Stable :: Monitoring"
                : "System Offline :: Awaiting Link"}
            </span>
          </div>

          <div className="flex items-center gap-4 w-full max-w-md">
            <button
              onClick={handleConnect}
              className={`flex-1 py-4 rounded-xl text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                isConnected
                  ? "bg-red-950/20 text-red-500 border border-red-900/40 hover:bg-red-900/30"
                  : "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/20"
              }`}
            >
              <Power size={18} strokeWidth={2.5} />
              {isConnected ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative flex items-center justify-center bg-[#020202]">
        <div
          className={`absolute w-[40%] h-[40%] rounded-full transition-all duration-1000 blur-[100px] pointer-events-none ${isConnected ? "bg-[#00ff41]/20" : "bg-transparent"}`}
        />
        <AICore isConnected={isConnected} isSpeaking={isSpeaking} />
        <div className="absolute bottom-8 text-xs font-mono tracking-[0.3em] text-[#00ff41]/30 uppercase z-10">
          IRIS-Mini v1.0 - Local Server - 6754 - Secure Link -{" "}
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
