import { Mic, MicOff, Power } from "lucide-react";
import { useState } from "react";
import AICore from "../utils/AICore";

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* --- LEFT SIDE: CHAT & CONTROLS --- */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col justify-center px-6 lg:px-12 border-b lg:border-b-0 lg:border-r border-[#111] z-10 bg-[#050505]">
        {/* CONSTRAINED CONTAINER: This fixes the ugly stretching */}
        <div className="w-full max-w-xl mx-auto flex flex-col">
          {/* Header */}
          <div className="text-center lg:text-left mb-6">
            <h1 className="text-xl font-bold mb-1 text-white">
              IRIS NEURAL LINK
            </h1>
            <p className="text-[11px] text-[#00ff41]/60 font-mono tracking-widest uppercase">
              Local Node :: Port 6753 :: Secure Connection
            </p>
          </div>

          {/* Chat Box */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-[50vh] max-h-[500px] shadow-2xl relative">
            {/* Transcript Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono scrollbar-thin scrollbar-thumb-[#1a1a1a]">
              <div className="bg-[#111] rounded-xl p-4 text-[12px] text-gray-400 w-fit max-w-[90%] leading-relaxed border border-[#222]">
                [System] Uplink initialized. Current node time:{" "}
                {new Date().toLocaleTimeString()}
              </div>
              <div className="bg-[#00ff41]/5 rounded-xl p-4 text-[12px] text-[#00ff41] w-fit max-w-[90%] leading-relaxed border border-[#00ff41]/20">
                Uplink established. Ready for command input, Operator.
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-6 flex flex-col items-center border-t border-[#1a1a1a] pt-6 font-mono">
              {/* Status Text */}
              <div className="h-6 mb-3 flex items-center justify-center">
                <span
                  className={`text-[10px] tracking-[0.2em] uppercase font-bold ${isConnected ? "text-[#00ff41] animate-pulse" : "text-gray-600"}`}
                >
                  {isConnected
                    ? "Connection Stable :: Monitoring"
                    : "System Offline :: Awaiting Link"}
                </span>
              </div>

              {/* IRIS Command Dock */}
              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={() => setIsConnected(!isConnected)}
                  className={`flex-1 py-3.5 rounded-xl text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                    isConnected
                      ? "bg-red-950/20 text-red-500 border border-red-900/40 hover:bg-red-900/30"
                      : "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/20"
                  }`}
                >
                  <Power size={16} strokeWidth={2.5} />
                  {isConnected ? "Disconnect" : "Connect"}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!isConnected}
                  className={`w-14 h-[46px] rounded-xl flex items-center justify-center transition-all border ${
                    !isConnected
                      ? "opacity-30 cursor-not-allowed bg-black border-[#111] text-gray-600"
                      : isMuted
                        ? "bg-amber-950/20 border-amber-900/40 text-amber-500 hover:bg-amber-900/30"
                        : "bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/20"
                  }`}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: 3D MODEL --- */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative flex items-center justify-center bg-[#020202]">
        {/* Glow */}
        <div
          className={`absolute w-[50%] h-[50%] rounded-full transition-all duration-1000 blur-[100px] pointer-events-none ${isConnected ? "bg-[#00ff41]/15" : "bg-transparent"}`}
        />

        <AICore isConnected={isConnected} />

        <div className="absolute bottom-8 text-[9px] font-mono tracking-[0.3em] text-[#00ff41]/30 uppercase z-10">
          IRIS • NEURAL CORE v2.0
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
