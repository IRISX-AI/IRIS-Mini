import {
  Activity,
  Cpu,
  Database,
  Mic,
  MicOff,
  Network,
  Power,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import AICore from "../utils/AICore";

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [systemStatus, setSystemStatus] = useState("STANDBY");

  const [transcript] = useState([
    { id: 1, role: "system", text: "INITIALIZING IRIS-MINI KERNEL..." },
    { id: 2, role: "system", text: "AWAITING NEURAL UPLINK..." },
    { id: 3, role: "user", text: "Connect to local filesystem." },
    {
      id: 4,
      role: "agent",
      text: "Uplink established. Awaiting instructions.",
    },
  ]);

  useEffect(() => {
    setSystemStatus(isConnected ? "ACTIVE" : "STANDBY");
  }, [isConnected]);

  return (
    <div className="h-screen w-full bg-[#050505] text-[#00ff41] font-mono selection:bg-[#00ff41]/30 flex items-center justify-between overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none z-0" />

      <div className="z-20 w-72 h-full flex flex-col justify-center pl-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity size={18} className="text-[#00ff41]" />
          <span className="text-xs tracking-[0.3em] text-[#00ff41]/70">
            SYS_METRICS
          </span>
        </div>

        {[
          {
            label: "CPU_LOAD",
            value: isConnected ? "14.2%" : "--%",
            icon: <Cpu size={14} />,
          },
          {
            label: "MEM_ALLOC",
            value: isConnected ? "2.1 GB" : "-- GB",
            icon: <Database size={14} />,
          },
          {
            label: "NET_LATENCY",
            value: isConnected ? "12ms" : "--ms",
            icon: <Network size={14} />,
          },
        ].map((metric, i) => (
          <div
            key={i}
            className="bg-black/40 border border-[#00ff41]/20 p-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between text-[#00ff41]/50 text-[10px] tracking-widest mb-2">
              <span className="flex items-center gap-2">
                {metric.icon} {metric.label}
              </span>
            </div>
            <div
              className={`text-xl font-light ${isConnected ? "text-[#00ff41]" : "text-[#00ff41]/30"}`}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-1 flex items-center justify-center z-10 scale-90 md:scale-100">
        <div
          className={`absolute w-96 h-96 rounded-full transition-all duration-1000 blur-[100px] pointer-events-none ${isConnected ? "bg-[#00ff41]/10" : "bg-transparent"}`}
        />

        <AICore isConnected={isConnected} />
      </div>

      <div className="z-20 w-96 h-[85vh] mr-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#00ff41]/20 p-6 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#00ff41]/50 to-transparent" />

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#00ff41]/20">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-[#00ff41]" />
            <span className="text-xs tracking-[0.2em] text-[#00ff41]/80">
              TERMINAL_LOG
            </span>
          </div>
          <span
            className={`text-[9px] tracking-widest px-2 py-1 border ${isConnected ? "border-[#00ff41]/50 text-[#00ff41] bg-[#00ff41]/10" : "border-[#00ff41]/20 text-[#00ff41]/40"}`}
          >
            {systemStatus}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-4 scrollbar-thin scrollbar-thumb-[#00ff41]/20 scrollbar-track-transparent">
          {transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#00ff41]/40 mb-1.5">
                {msg.role === "agent" ? "IRIS" : msg.role}
              </span>
              <div
                className={`text-[11px] p-3 leading-relaxed max-w-[90%] border-l-2 ${
                  msg.role === "user"
                    ? "bg-[#00ff41]/5 border-[#00ff41] text-[#00ff41] border-l-0 border-r-2"
                    : msg.role === "system"
                      ? "bg-transparent border-[#00ff41]/30 text-[#00ff41]/50 italic"
                      : "bg-[#001100] border-[#00ff41] text-[#00ff41]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#00ff41]/20 px-8 py-4 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`flex items-center gap-3 transition-all duration-300 ${
            isConnected
              ? "text-red-500 hover:text-red-400 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
              : "text-[#00ff41] hover:text-[#00ff41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]"
          }`}
        >
          <Power size={20} />
          <span className="text-[10px] tracking-widest">
            {isConnected ? "DISCONNECT" : "INITIALIZE"}
          </span>
        </button>

        <div className="w-px h-6 bg-[#00ff41]/20" />

        <button
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isConnected}
          className={`flex items-center gap-3 transition-all duration-300 ${
            !isConnected ? "opacity-30 cursor-not-allowed" : ""
          } ${
            isMuted && isConnected
              ? "text-amber-500 hover:text-amber-400 hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
              : isConnected
                ? "text-[#00ff41] hover:text-[#00ff41] hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]"
                : "text-[#00ff41]/50"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          <span className="text-[10px] tracking-widest">
            {isMuted ? "MUTED" : "VOICE_LINK"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default IrisMini;
