import { Mic, MicOff, Power, TerminalSquare } from "lucide-react";
import { useState } from "react";
import AICore from "../utils/AICore";

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [transcript] = useState([
    {
      id: 1,
      role: "system",
      text: "IRIS MINI INITIALIZED. AWAITING NEURAL UPLINK...",
      time: "04:21:27",
    },
    { id: 2, role: "user", text: "Connect to local OS.", time: "04:21:45" },
    {
      id: 3,
      role: "agent",
      text: "Uplink established. Ready for voice command, Boss.",
      time: "04:21:46",
    },
  ]);

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-between text-[#00ff41] font-mono overflow-hidden relative selection:bg-[#00ff41]/30">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* --- CENTRAL 3D CORE --- */}
      <div className="relative flex-1 h-full flex flex-col items-center justify-center z-10">
        {/* Glow behind globe (Activates only when connected) */}
        <div
          className={`absolute w-[24rem] h-[24rem] rounded-full transition-all duration-1000 blur-[100px] pointer-events-none ${isConnected ? "bg-[#00ff41]/10" : "bg-transparent"}`}
        />

        <AICore isConnected={isConnected} />

        {/* --- BOTTOM CONTROL BAR --- */}
        <div className="absolute bottom-12 flex items-center gap-6 bg-[#0a0a0a] border border-[#1a1a1a] px-8 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20">
          <button
            onClick={() => setIsConnected(!isConnected)}
            className={`transition-all duration-300 hover:scale-110 ${
              isConnected
                ? "text-red-500 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                : "text-[#00ff41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]"
            }`}
          >
            <Power size={20} strokeWidth={1.5} />
          </button>

          <div className="w-px h-6 bg-[#222]" />

          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={!isConnected}
            className={`transition-all duration-300 ${
              !isConnected
                ? "opacity-30 cursor-not-allowed text-gray-500"
                : "hover:scale-110"
            } ${
              isMuted && isConnected
                ? "text-amber-500 hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                : isConnected
                  ? "text-[#00ff41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]"
                  : "text-gray-500"
            }`}
          >
            {isMuted ? (
              <MicOff size={20} strokeWidth={1.5} />
            ) : (
              <Mic size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PROFESSIONAL TRANSCRIPT --- */}
      <div className="w-[420px] h-full bg-[#080808] border-l border-[#111] flex flex-col z-20 shadow-2xl relative">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-[#111]">
          <div className="flex items-center gap-3">
            <TerminalSquare size={16} className="text-[#00ff41]/70" />
            <span className="text-[10px] tracking-[0.2em] font-semibold text-[#00ff41]/80">
              LIVE_LOG
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#00ff41] shadow-[0_0_8px_#00ff41]" : "bg-neutral-600"}`}
            ></span>
          </div>
        </div>

        {/* Log Entries (Clean, Data-driven Look) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
          {transcript.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1.5">
              {/* Meta Row: Role & Time */}
              <div className="flex justify-between items-end">
                <span
                  className={`text-[9px] uppercase tracking-widest font-bold ${
                    msg.role === "agent" ? "text-[#00ff41]" : "text-neutral-500"
                  }`}
                >
                  {msg.role}
                </span>
                <span className="text-[9px] text-neutral-600 font-mono">
                  [{msg.time}]
                </span>
              </div>

              {/* Message Content */}
              <div
                className={`text-[12px] leading-relaxed tracking-wide ${
                  msg.role === "user"
                    ? "text-neutral-300" // White/gray for user
                    : msg.role === "system"
                      ? "text-neutral-500 italic" // Dimmed for system events
                      : "text-[#00ff41]/90" // Bright green for IRIS
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
