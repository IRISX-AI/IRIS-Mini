import { Mic } from "lucide-react";
import { useState } from "react";
import AICore from "../utils/AICore";

const IrisMini = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Toggle to test the green text and animation

  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* --- LEFT SIDE: CHAT & CONTROLS --- */}
      <div className="w-1/2 h-full flex flex-col justify-center px-12 lg:px-24">
        {/* Header (Matching your screenshot) */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold mb-1">AI Voice Assistant</h1>
          <p className="text-[11px] text-gray-400">
            Powered by Whisper (STT) and Kokoro (TTS) running locally in your
            browser.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col h-[60vh] max-h-[600px] shadow-2xl">
          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* System/Info Bubble */}
            <div className="bg-[#161616] rounded-xl p-4 text-[13px] text-gray-300 w-fit max-w-[85%] leading-relaxed border border-[#222]">
              [Session started] Current date: Sunday, May 10, 2026 Current time:
              07:27:26 AM Timezone: Asia/Calcutta
            </div>

            {/* Agent Bubble */}
            <div className="bg-[#161616] rounded-xl p-4 text-[13px] text-gray-300 w-fit max-w-[85%] leading-relaxed border border-[#222]">
              Good morning, sir. I'm ready when you are.
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="mt-4 flex flex-col items-center">
            {/* Status Text */}
            <div className="h-6 mb-2 flex items-center justify-center">
              {isPlaying ? (
                <span className="text-[#00ff41] text-[11px] font-medium animate-pulse tracking-wide">
                  Playing audio...
                </span>
              ) : isRecording ? (
                <span className="text-red-500 text-[11px] font-medium animate-pulse tracking-wide">
                  Listening...
                </span>
              ) : null}
            </div>

            {/* Hold to Talk Button */}
            <button
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
              className="w-full bg-[#eeeeee] hover:bg-white text-black py-3.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Mic size={16} strokeWidth={2.5} />
              Hold to talk
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: 3D MODEL --- */}
      <div className="w-1/2 h-full relative flex flex-col items-center justify-center bg-[#050505]">
        {/* The 3D Sphere */}
        <AICore isPlaying={isPlaying} />

        {/* Bottom Text (Matching your screenshot) */}
        <div className="absolute bottom-10 text-[9px] tracking-[0.3em] text-gray-600 font-medium">
          IRIS • AUDIO FEED
        </div>
      </div>
    </div>
  );
};

export default IrisMini;
