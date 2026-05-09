import {
  Activity,
  Cpu,
  Database,
  Mic,
  MicOff,
  Monitor,
  Phone,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import AICore from "../utils/AICore";

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [transcript] = useState([
    { id: 1, role: "user", text: "हेलो आयरिश कैसा है" },
    {
      id: 2,
      role: "system",
      text: "Badhiya ek dam, bro! Tu bata, kya scene hai? How can I help you today?",
    },
    {
      id: 3,
      role: "user",
      text: "अच्छा तेरे को मेरा फेवरेट सॉन्ग याद है उसको Spotify पे प्ले कर दे यार",
    },
    {
      id: 4,
      role: "system",
      text: 'Executing, bro! Playing "Blinding Lights" by The Weeknd on Spotify. Done, bro! Full vibe set ho gaya.',
    },
    { id: 5, role: "user", text: "हेलो हेलो हेलो" },
    {
      id: 6,
      role: "system",
      text: "Hello, bro! Kya haal hai? Sab badhiya? Bata, how can I assist you?",
    },
  ]);

  return (
    <div className="h-screen w-full bg-[#030303] text-[#00ff41] font-mono selection:bg-[#00ff41]/30 flex flex-col overflow-hidden relative">
      {/* --- TOP NAV BAR --- */}
      <div className="w-full h-12 border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur z-30">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#00ff41]" : "bg-red-500"}`}
          />
          <span className="text-xs font-bold tracking-widest text-[#00ff41]/70">
            IRIS OS // SYSTEM
          </span>
        </div>
        <div className="text-[10px] tracking-widest text-[#00ff41]/50">
          {isConnected ? "LINKED" : "OFFLINE"} | 100% | 7:51:13 PM
        </div>
      </div>

      {/* --- MAIN CONTENT WINDOW --- */}
      <div className="flex-1 flex justify-between p-4 gap-4 relative z-20">
        {/* --- LEFT PANEL: METRICS --- */}
        <div className="w-80 flex flex-col gap-4">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#00ff41]/70">
                <Activity size={12} /> NEURAL UPLINK
              </div>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded ${isConnected ? "bg-[#00ff41]/10 text-[#00ff41]" : "bg-red-500/10 text-red-500"}`}
              >
                {isConnected ? "CONNECTED" : "OFFLINE"}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[8px] text-[#00ff41]/40 mb-1">
                  WSS LATENCY
                </div>
                <div className="text-sm">24ms</div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-[#00ff41]/40 mb-1">
                  HOST NODE
                </div>
                <div className="text-sm">GEM-V2.5</div>
              </div>
            </div>
          </div>

          <div className="flex-1 border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-4 flex flex-col">
            <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#00ff41]/70 mb-4">
              <Monitor size={12} /> CORE METRICS
            </div>

            {/* 2x2 Grid matching screenshot */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
              <div className="border border-[#1a1a1a] bg-[#050505] rounded p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] text-[#00ff41]/40 uppercase">
                  <Cpu size={10} /> CPU LOAD
                </div>
                <div className="text-right text-xl font-bold">
                  {isConnected ? "9.5%" : "--"}
                </div>
              </div>

              <div className="border border-[#1a1a1a] bg-[#050505] rounded p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] text-[#00ff41]/40 uppercase">
                  <Database size={10} /> RAM USAGE
                </div>
                <div className="text-right text-xl font-bold">
                  {isConnected ? "79.0%" : "--"}
                </div>
              </div>

              <div className="border border-[#1a1a1a] bg-[#050505] rounded p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] text-[#00ff41]/40 uppercase">
                  <Wrench size={10} /> TEMP
                </div>
                <div className="text-right text-xl font-bold">
                  {isConnected ? "50°C" : "--"}
                </div>
              </div>

              <div className="border border-[#1a1a1a] bg-[#050505] rounded p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[8px] text-[#00ff41]/40 uppercase">
                  <Monitor size={10} /> OS
                </div>
                <div className="text-right text-sm font-bold pt-2 text-[#00ff41]/80">
                  Windows 11
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CENTER: THE AI CORE & DOCK --- */}
        <div className="flex-1 relative flex flex-col items-center justify-center">
          <div className="w-full h-full max-w-3xl absolute inset-0 m-auto flex items-center justify-center">
            <AICore isConnected={isConnected} />
          </div>

          {/* Bottom Dock (Exact match to screenshot) */}
          <div className="absolute bottom-8 flex items-center gap-6 z-30">
            {/* Red Disconnect Button */}
            <button
              className="w-10 h-10 rounded-full border border-red-900/50 flex items-center justify-center bg-red-950/20 text-red-500 hover:bg-red-900/40 transition-colors"
              onClick={() => setIsConnected(false)}
            >
              <Phone size={14} className="rotate-[135deg]" />
            </button>

            {/* Main Green Connect Button */}
            <button
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.2)] transition-colors ${
                isConnected
                  ? "bg-[#00ff41] text-black"
                  : "bg-[#00ff41]/20 border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41]/40"
              }`}
              onClick={() => setIsConnected(true)}
            >
              <Phone size={24} />
            </button>

            {/* Mic Toggle Button */}
            <button
              className="w-10 h-10 rounded-full border border-[#00ff41]/20 flex items-center justify-center bg-[#00ff41]/5 text-[#00ff41] hover:bg-[#00ff41]/20 transition-colors"
              onClick={() => setIsMuted(!isMuted)}
              disabled={!isConnected}
            >
              {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>
        </div>

        {/* --- RIGHT PANEL: TRANSCRIPT --- */}
        <div className="w-96 border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1a1a1a]">
            <div className="text-[10px] tracking-widest text-[#00ff41]/70">
              TRANSCRIPT
            </div>
            <div className="text-[8px] tracking-widest text-[#00ff41]/40">
              LIVE-LOG
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#1a1a1a] scrollbar-track-transparent">
            {transcript.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`text-[11px] p-3 rounded-lg max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "border border-[#00ff41]/30 bg-[#00ff41]/5 text-[#00ff41]" // User styling
                      : "border border-[#1a1a1a] bg-[#050505] text-[#00ff41]/70" // System styling
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
