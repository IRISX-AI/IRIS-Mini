import { Mic, MicOff, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AICore from "../utils/AICore";

let socket: Socket;

const IrisMini = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    socket = io();

    socket.on("system_status", (msg: string) => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleConnect = () => {
    if (!isConnected) {
      socket.emit("Iris_Connected", "Iris Connected");
      setIsConnected(true);
    } else {
      socket.emit("Iris_Disconnected", "Iris Disconnected");
      setIsConnected(false);
    }
  };

  return (
    <div className="h-screen w-full bg-green-400/5 text-white font-sans flex flex-col lg:flex-row overflow-hidden pointer-events-auto select-none">
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col px-8 lg:px-16 py-10 lg:py-16 border-b lg:border-b-0 lg:border-r border-[#111] z-10">
        <div className="flex-none">
          <h1 className="text-xl font-bold mb-1 text-white">IRIS-MINI</h1>
          <p className="text-[11px] text-[#00ff41]/60 font-mono tracking-widest uppercase">
            Local Server :: Port 6753 :: Secure Connection to Gemini API
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 py-8 pr-4 font-mono scrollbar-thin scrollbar-thumb-[#1a1a1a] flex flex-col justify-end">
          <div className="bg-[#111] rounded-xl p-4 text-[13px] text-gray-400 w-fit max-w-[85%] leading-relaxed border border-[#222]">
            [System] Uplink initialized. Current node time:{" "}
            {new Date().toLocaleTimeString()}
          </div>

          <div className="bg-[#00ff41]/5 rounded-xl p-4 text-[13px] text-[#00ff41] w-fit max-w-[85%] leading-relaxed border border-[#00ff41]/20">
            Uplink established. Ready for command input, Operator.
          </div>
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
              onClick={() => handleConnect()}
              className={`flex-1 py-4 rounded-xl text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                isConnected
                  ? "bg-red-950/20 text-red-500 border border-red-900/40 hover:bg-red-900/30"
                  : "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/20"
              }`}
            >
              <Power size={18} strokeWidth={2.5} />
              {isConnected ? "Disconnect" : "Connect"}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              disabled={!isConnected}
              className={`w-16 h-13.5 rounded-xl flex items-center justify-center transition-all border ${
                !isConnected
                  ? "opacity-30 cursor-not-allowed bg-black border-[#111] text-gray-600"
                  : isMuted
                    ? "bg-amber-950/20 border-amber-900/40 text-amber-500 hover:bg-amber-900/30"
                    : "bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/20"
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative flex items-center justify-center bg-[#020202]">
        <div
          className={`absolute w-[40%] h-[40%] rounded-full transition-all duration-1000 blur-[100px] pointer-events-none ${isConnected ? "bg-[#00ff41]/20" : "bg-transparent"}`}
        />

        <AICore isConnected={isConnected} />

        <div className="absolute bottom-8 text-xs font-mono tracking-[0.3em] text-[#00ff41]/30 uppercase z-10">
          IRIS-Mini v1.0 - Local Server - 6753 - Secure Link -{" "}
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
