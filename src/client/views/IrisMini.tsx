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
      if (msg === "YANA-MINI : Connected") {
        toast.success(msg, {
          position: "top-left",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
      } else if (msg === "YANA-MINI : Disconnected") {
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
        {
          id: Date.now() + Math.random(),
          role: "SYSTEM",
          text: msg,
          isFinal: true,
        },
      ]);
    });

    socket.on("transcript_chunk", (msg: { role: string; text: string }) => {
      if (msg.role === "AGENT") {
        setIsSpeaking(true);
      }

      setTranscripts((prev) => {
        if (prev.length === 0) {
          return [
            {
              id: Date.now() + Math.random(),
              role: msg.role,
              text: msg.text,
              isFinal: false,
            },
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
            {
              id: Date.now() + Math.random(),
              role: msg.role,
              text: msg.text,
              isFinal: false,
            },
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
      socket.emit("Yana_Connected", "Yana Connected");
      setIsConnected(true);
    } else {
      socket.emit("Yana_Disconnected", "Yana Disconnected");
      setIsConnected(false);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0c0a1d] via-[#050508] to-[#120822] text-white font-sans flex flex-col lg:flex-row overflow-hidden relative pointer-events-auto select-none">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[130px] pointer-events-none" />

      {/* Left Panel - Glassmorphic Interface */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col px-8 lg:px-16 py-10 lg:py-16 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02] backdrop-blur-xl z-10 relative">
        <div className="flex-none">
          <h1 className="text-2xl font-black mb-1 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent tracking-wide">YANA-Mini</h1>
          <p className="text-[10px] text-purple-300/60 font-mono tracking-[0.2em] uppercase">
            Local Server :: Active :: Secure Link
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 py-8 pr-4 font-mono scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex flex-col justify-start"
        >
          {transcripts.length === 0 ? (
            <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl px-5 py-4 text-[12px] text-purple-200/70 w-fit max-w-[85%] leading-relaxed border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              ▸ Uplink initialized. System standing by.
            </div>
          ) : (
            transcripts.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "SYSTEM"
                    ? "bg-white/[0.04] backdrop-blur-md rounded-2xl px-5 py-4 text-[12px] text-purple-200/70 w-fit max-w-[85%] leading-relaxed border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                    : msg.role === "USER"
                      ? "bg-gradient-to-r from-pink-500/25 to-purple-600/25 backdrop-blur-md rounded-2xl px-5 py-4 text-[13px] text-white w-fit max-w-[85%] leading-relaxed border border-white/20 self-end ml-auto shadow-[0_8px_32px_rgba(236,72,153,0.15)]"
                      : "bg-white/[0.08] backdrop-blur-md rounded-2xl px-5 py-4 text-[13px] text-purple-100 w-fit max-w-[85%] leading-relaxed border border-white/15 shadow-[0_8px_32px_rgba(255,255,255,0.05)]"
                }
              >
                {msg.role === "SYSTEM" ? `▸ ${msg.text}` : msg.text}
                {!msg.isFinal && msg.role !== "SYSTEM" && (
                  <span className="animate-pulse ml-1 text-pink-400 font-bold">▌</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer controls */}
        <div className="flex-none pt-6 font-mono">
          <div className="h-6 mb-4 flex items-center gap-2">
            <span
              className={`text-[9px] px-2.5 py-1 rounded-full border tracking-[0.15em] uppercase font-bold transition-all duration-500 ${
                isConnected 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]" 
                  : "bg-white/5 text-purple-300/40 border-white/10"
              }`}
            >
              {isConnected ? "Connection Stable" : "System Offline"}
            </span>
          </div>

          <div className="flex items-center gap-4 w-full max-w-sm">
            <button
              onClick={handleConnect}
              className={`flex-1 py-3.5 rounded-xl text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                isConnected
                  ? "bg-gradient-to-r from-red-600/40 to-red-700/40 text-white border border-red-500/30 hover:from-red-600/50 hover:to-red-700/50 shadow-[0_8px_32px_rgba(220,38,38,0.2)] hover:scale-[1.02]"
                  : "bg-gradient-to-r from-pink-500/60 to-purple-600/60 text-white border border-white/20 hover:from-pink-500/70 hover:to-purple-600/70 shadow-[0_8px_32px_rgba(236,72,153,0.3)] hover:scale-[1.02]"
              }`}
            >
              <Power size={14} strokeWidth={2.5} />
              {isConnected ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual Space */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative flex items-center justify-center bg-transparent z-0">
        <div
          className={`absolute w-[60%] h-[60%] rounded-full transition-all duration-1000 blur-[120px] pointer-events-none ${
            isSpeaking 
              ? "bg-gradient-to-tr from-pink-500/20 to-purple-500/30" 
              : isConnected 
                ? "bg-gradient-to-tr from-purple-500/15 to-indigo-500/20" 
                : "bg-transparent"
          }`}
        />
        <AICore isConnected={isConnected} isSpeaking={isSpeaking} />
        <div className="absolute bottom-8 flex flex-col items-center gap-1 z-10">
          <div className="text-[9px] font-mono tracking-[0.3em] text-purple-300/30 uppercase">
            YANA-Mini v1.0 · Glassmorphic Core · {new Date().toLocaleDateString()}
          </div>
          <div className="text-[8px] font-mono tracking-[0.2em] text-purple-300/20 uppercase">
            Created by Ashit
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
