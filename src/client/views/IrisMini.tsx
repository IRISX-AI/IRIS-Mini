import { Mic, MicOff, Power, Terminal } from "lucide-react";
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
    },
    { id: 2, role: "user", text: "Connect to local OS." },
    {
      id: 3,
      role: "agent",
      text: "Uplink established. Ready for voice command, Boss.",
    },
  ]);

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center text-[#00ff41] font-mono overflow-hidden relative selection:bg-[#00ff41]/30">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* --- CENTRAL 3D CORE --- */}
      {/* The background glow */}
      <div
        className={`absolute w-[30rem] h-[30rem] rounded-full transition-all duration-1000 blur-[100px] pointer-events-none ${isConnected ? "bg-[#00ff41]/10" : "bg-transparent"}`}
      />

      {/* The 3D Canvas */}
      <AICore isConnected={isConnected} />

      {/* --- TRANSCRIPT PANEL (Right Side Overlay) --- */}
      <div className="absolute right-0 top-0 bottom-0 w-[26rem] bg-[#0a0a0a]/80 backdrop-blur-xl border-l border-[#00ff41]/20 p-6 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-10">
        {/* Panel Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-[#00ff41]/30 pb-3">
          <Terminal size={18} className="text-[#00ff41]" />
          <span className="text-xs tracking-[0.2em] font-bold">LIVE_LOG</span>
          <span className="ml-auto flex h-2.5 w-2.5 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? "bg-[#00ff41]" : "bg-red-500"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? "bg-[#00ff41]" : "bg-red-500"}`}
            ></span>
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#00ff41]/20 scrollbar-track-transparent">
          {transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[9px] uppercase tracking-widest text-[#00ff41]/50 mb-1">
                {msg.role}
              </span>
              <div
                className={`text-[11px] p-3 rounded-md leading-relaxed max-w-[90%] border ${
                  msg.role === "user"
                    ? "bg-[#00ff41]/10 border-[#00ff41]/40 text-[#00ff41]"
                    : msg.role === "system"
                      ? "bg-transparent border-[#00ff41]/20 text-[#00ff41]/60 italic"
                      : "bg-[#050505] border-[#00ff41]/50 text-[#00ff41]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM CONTROL BAR --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#00ff41]/30 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-10">
        {/* Connect Button */}
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`p-4 rounded-full transition-all duration-300 hover:scale-105 ${
            isConnected
              ? "bg-red-950/40 text-red-500 border border-red-500/50 hover:bg-red-900/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              : "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/50 hover:bg-[#00ff41]/20 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
          }`}
          title={isConnected ? "Disconnect" : "Initialize System"}
        >
          <Power size={20} />
        </button>

        <div className="w-px h-8 bg-[#00ff41]/30 mx-2" />

        {/* Mic Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isConnected}
          className={`p-4 rounded-full transition-all duration-300 ${
            !isConnected ? "opacity-30 cursor-not-allowed" : "hover:scale-105"
          } ${
            isMuted && isConnected
              ? "bg-amber-950/40 text-amber-500 border border-amber-500/50 hover:bg-amber-900/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              : isConnected
                ? "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/50 hover:bg-[#00ff41]/20 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                : "bg-transparent text-[#00ff41]/30 border border-[#00ff41]/20"
          }`}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
};

export default IrisMini;
