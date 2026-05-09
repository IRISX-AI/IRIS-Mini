import React, { useState } from "react";
import { Mic, MicOff, Power, Terminal } from "lucide-react";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Dummy transcript data for layout testing
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
    <div className="h-screen w-full bg-[#030712] flex items-center justify-center text-[#4ade80] font-mono overflow-hidden relative selection:bg-[#4ade80]/30">
      {/* Background Grid / Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* --- CENTRAL JARVIS CORE (Pure CSS, Zero Lag) --- */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring 1 */}
        <div
          className={`absolute w-[28rem] h-[28rem] border border-[#4ade80]/20 rounded-full transition-all duration-1000 ${isConnected ? "animate-[spin_12s_linear_infinite]" : "scale-90 opacity-50"}`}
        />

        {/* Outer Ring 2 (Dashed/Partial) */}
        <div
          className={`absolute w-[24rem] h-[24rem] border-t-2 border-r-2 border-[#4ade80]/40 rounded-full transition-all duration-1000 ${isConnected ? "animate-[spin_8s_linear_infinite_reverse]" : "scale-90 opacity-50"}`}
        />

        {/* Inner Pulse Ring */}
        <div
          className={`absolute w-64 h-64 border border-[#4ade80]/10 rounded-full transition-all duration-1000 ${isConnected ? "animate-pulse scale-110" : "scale-90 opacity-50"}`}
        />

        {/* The Core */}
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isConnected ? "bg-[#4ade80]/10 shadow-[0_0_60px_rgba(74,222,128,0.3)]" : "bg-zinc-900/30"}`}
        >
          <div
            className={`w-20 h-20 rounded-full transition-all duration-500 ${isConnected ? "bg-[#4ade80]/30 shadow-[0_0_30px_rgba(74,222,128,0.8)] animate-pulse" : "bg-zinc-800"}`}
          />
        </div>
      </div>

      {/* --- TRANSCRIPT PANEL (Right Side Overlay) --- */}
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/60 backdrop-blur-xl border-l border-[#4ade80]/20 p-5 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        {/* Panel Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-[#4ade80]/30 pb-3">
          <Terminal size={18} className="text-[#4ade80]" />
          <span className="text-xs tracking-[0.2em] font-bold">LIVE_LOG</span>
          <span className="ml-auto flex h-2.5 w-2.5 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? "bg-[#4ade80]" : "bg-red-500"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? "bg-[#4ade80]" : "bg-red-500"}`}
            ></span>
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#4ade80]/20">
          {transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[9px] uppercase tracking-widest text-[#4ade80]/50 mb-1">
                {msg.role}
              </span>
              <div
                className={`text-xs p-3 rounded-lg leading-relaxed max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]"
                    : msg.role === "system"
                      ? "bg-zinc-900/50 border border-zinc-700 text-zinc-400"
                      : "bg-black/80 border border-[#4ade80]/20 text-[#4ade80]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM CONTROL BAR --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-[#4ade80]/20 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Connect Button */}
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
            isConnected
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              : "bg-[#4ade80]/20 text-[#4ade80] hover:bg-[#4ade80]/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
          }`}
          title={isConnected ? "Disconnect" : "Initialize System"}
        >
          <Power size={22} />
        </button>

        <div className="w-px h-8 bg-[#4ade80]/20 mx-2" />

        {/* Mic Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isConnected}
          className={`p-3 rounded-full transition-all duration-300 ${
            !isConnected ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
          } ${
            isMuted && isConnected
              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              : isConnected
                ? "bg-[#4ade80]/20 text-[#4ade80] hover:bg-[#4ade80]/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
                : "bg-zinc-800 text-zinc-500"
          }`}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
      </div>
    </div>
  );
};

export default App;
