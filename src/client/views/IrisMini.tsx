import { Mic, MicOff, Power } from "lucide-react";
import { useState } from "react";
import AICore from "../utils/AICore";

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    // High Responsiveness: Stacks as columns on mobile, row on large screens (lg)
    <div className="min-h-screen w-full bg-[#050505] text-[#00ff41] font-mono flex flex-col lg:flex-row overflow-hidden selection:bg-[#00ff41]/30">
      {/* --- LEFT SIDE: CHAT & CONTROLS --- */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-8 lg:pt-0 z-20">
        {/* Header */}
        <div className="text-center lg:text-left mb-6">
          <h1 className="text-xl font-bold tracking-widest mb-2 text-white">
            IRIS NEURAL LINK
          </h1>
          <p className="text-[10px] tracking-widest text-[#00ff41]/50 uppercase">
            Local Node :: Port 6753 :: Secure Connection
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-full max-h-[400px] lg:max-h-[600px] shadow-2xl relative">
          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#1a1a1a]">
            {/* System Bubble */}
            <div className="bg-[#050505] rounded-xl p-4 text-[12px] text-gray-500 w-fit max-w-[90%] leading-relaxed border border-[#111]">
              [System] Uplink initialized. Current node time:{" "}
              {new Date().toLocaleTimeString()}
            </div>

            {/* Agent Bubble */}
            <div className="bg-[#00ff41]/5 rounded-xl p-4 text-[12px] text-[#00ff41] w-fit max-w-[90%] leading-relaxed border border-[#00ff41]/20">
              Uplink established. Ready for command input, Operator.
            </div>
          </div>

          {/* Bottom Controls (Replacing "Hold to Talk") */}
          <div className="mt-6 flex flex-col items-center border-t border-[#1a1a1a] pt-6">
            {/* Status Text */}
            <div className="h-6 mb-3 flex items-center justify-center">
              <span
                className={`text-[10px] tracking-[0.2em] uppercase ${isConnected ? "text-[#00ff41] animate-pulse" : "text-gray-600"}`}
              >
                {isConnected
                  ? "Connection Stable :: Monitoring"
                  : "System Offline :: Awaiting Link"}
              </span>
            </div>

            {/* IRIS Command Dock */}
            <div className="flex items-center gap-4 w-full max-w-sm">
              {/* Main Connect Button */}
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`flex-1 py-3.5 rounded-xl text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                  isConnected
                    ? "bg-red-950/30 text-red-500 border border-red-900/50 hover:bg-red-900/40"
                    : "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                }`}
              >
                <Power size={16} strokeWidth={2.5} />
                {isConnected ? "Disconnect" : "Connect"}
              </button>

              {/* Mic Toggle Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                disabled={!isConnected}
                className={`w-14 h-[46px] rounded-xl flex items-center justify-center transition-all ${
                  !isConnected
                    ? "opacity-30 cursor-not-allowed bg-black border border-[#111] text-gray-600"
                    : isMuted
                      ? "bg-amber-950/30 border border-amber-900/50 text-amber-500 hover:bg-amber-900/40"
                      : "bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/20"
                }`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: 3D MODEL --- */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative flex flex-col items-center justify-center bg-[#050505]">
        {/* Glow behind the sphere when connected */}
        <div
          className={`absolute w-[60%] h-[60%] rounded-full transition-all duration-1000 blur-[120px] pointer-events-none ${isConnected ? "bg-[#00ff41]/10" : "bg-transparent"}`}
        />

        {/* The 3D Dual-Sphere */}
        <AICore isConnected={isConnected} />

        {/* Bottom Telemetry Text */}
        <div className="absolute bottom-6 lg:bottom-10 text-[9px] tracking-[0.3em] text-[#00ff41]/40 uppercase z-10">
          IRIS • NEURAL CORE v2.0
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
