// client/src/App.tsx
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Power, Terminal, Zap, ShieldCheck } from "lucide-react";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [systemStatus, setSystemStatus] = useState("OFFLINE");

  const [transcript] = useState([
    {
      id: 1,
      role: "system",
      text: "SYSTEM IS OFFLINE. AWAITING NEURAL UPLINK...",
    },
    { id: 2, role: "user", text: "Initialize Iris-Mini." },
    {
      id: 3,
      role: "agent",
      text: "Neural connection active. Standby for command, Boss.",
    },
    { id: 4, role: "system", text: "UPLINK STABLE :: MONITORING OS FEED..." },
  ]);

  useEffect(() => {
    if (isConnected) {
      setSystemStatus("STABLE");
    } else {
      setSystemStatus("OFFLINE");
    }
  }, [isConnected]);

  return (
    <div className="h-screen w-full bg-bg text-primary font-mono selection:bg-primary/30 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

      <div className="relative flex items-center justify-center scale-90 md:scale-100">
        <div
          className={`absolute w-[32rem] h-[32rem] border border-system/10 rounded-full transition-all duration-1000 ${isConnected ? "animate-[spin_10s_linear_infinite]" : "scale-95 opacity-50"}`}
        />

        <div
          className={`absolute w-[28rem] h-[28rem] border-t-2 border-r border-system/30 rounded-full transition-all duration-1000 ${isConnected ? "animate-[spin_15s_linear_infinite_reverse]" : "scale-95 opacity-50"}`}
        />

        <div
          className={`absolute w-[22rem] h-[22rem] border border-primary/10 rounded-full transition-all duration-1000 ${isConnected ? "animate-pulse scale-110" : "scale-95 opacity-50"}`}
        />

        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${isConnected ? "bg-primary/10 shadow-[0_0_80px_rgba(0,255,0,0.25)]" : "bg-black/30"}`}
        >
          <div
            className={`w-28 h-28 rounded-full transition-all duration-500 flex items-center justify-center ${isConnected ? "bg-primary/20 shadow-[0_0_40px_rgba(0,255,0,0.7)] animate-pulse" : "bg-zinc-900"}`}
          >
            <Zap
              size={40}
              className={`transition-opacity duration-1000 ${isConnected ? "opacity-100" : "opacity-20"}`}
            />
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/70 backdrop-blur-xl border-l border-system/30 p-5 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6 border-b border-system/30 pb-3">
          <Terminal size={18} className="text-primary" />
          <span className="text-xs tracking-[0.2em] font-bold">
            NEURAL_FEED
          </span>
          <span
            className={`ml-auto text-[10px] tracking-widest px-2 py-0.5 rounded ${isConnected ? "bg-primary/20 text-primary" : "bg-red-950/40 text-red-400"}`}
          >
            {systemStatus}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-system/30">
          {transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[9px] uppercase tracking-widest text-system/60 mb-1">
                {msg.role}
              </span>
              <div
                className={`text-xs p-3 rounded-lg leading-relaxed max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-primary/10 border border-system/50 text-primary"
                    : msg.role === "system"
                      ? "bg-zinc-900/60 border border-zinc-700 text-zinc-400"
                      : "bg-black/80 border border-system/30 text-primary"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/90 backdrop-blur-xl border border-system/30 px-6 py-3 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
            isConnected
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : "bg-primary/20 text-primary hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
          }`}
          title={isConnected ? "Shutdown System" : "Ignite Engine"}
        >
          <Power size={22} />
        </button>

        <div className="w-px h-8 bg-system/30 mx-2" />

        <button
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isConnected}
          className={`p-3 rounded-full transition-all duration-300 ${
            !isConnected ? "opacity-20 cursor-not-allowed" : "hover:scale-110"
          } ${
            isMuted && isConnected
              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : isConnected
                ? "bg-primary/20 text-primary hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                : "bg-black text-system/30 border border-system/30"
          }`}
          title={isMuted ? "Activate Neural Input" : "Mute Neural Input"}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
      </div>

      <div className="absolute bottom-4 right-5 text-[9px] text-system/50 tracking-[0.2em] pointer-events-none">
        IRIS-MINI :: NEURAL INTERFACE PROTOCOL v1.0
      </div>
    </div>
  );
};

export default App;
