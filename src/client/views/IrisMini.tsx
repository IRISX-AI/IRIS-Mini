/**
 * IRISMini.tsx
 * ─────────────────────────────────────────────────────────────────
 * Refined, high-contrast operational interface for IRIS assistant.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useRef, useState } from "react";
// Assuming AICore is in the utils folder. If types aren't exported,
// copy AIState definition here or change to any.
import AICore, { AIState } from "../utils/AICore";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TranscriptMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface IRISMiniProps {
  state?: AIState;
  audioLevel?: number;
  transcript?: TranscriptMessage[];
  isConnected?: boolean;
  isMuted?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMute?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const STATE_LABEL: Record<AIState, string> = {
  idle: "STANDBY",
  listening: "LISTENING",
  thinking: "PROCESSING",
  speaking: "RESPONDING",
};

// ── Custom Hooks ──────────────────────────────────────────────────────────────
function useSystemTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div
      style={{
        background: "#000000",
        border: "1px solid #111111",
        padding: "10px",
        minWidth: 72,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#666666",
          letterSpacing: "0.15em",
          marginBottom: 6,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#00ff88",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1,
        }}
      >
        {value}
        <span
          style={{
            fontSize: 12,
            color: "#00ff88",
            opacity: 0.7,
            marginLeft: 2,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function NetworkBar({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid #222",
        padding: "4px 8px",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          background: active ? "#00ff88" : "#333",
          boxShadow: active ? "0 0 10px #00ff88" : "none",
          animation: active ? "iris-blink 1.4s ease-in-out infinite" : "none",
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: active ? "#00ff88" : "#666",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
        }}
      >
        {active ? "LINK ACTIVE" : "LINK OFFLINE"}
      </span>
    </div>
  );
}

function TranscriptMessageItem({ msg }: { msg: TranscriptMessage }) {
  const isUser = msg.role === "user";
  const color = isUser ? "#ffffff" : "#00ff88";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginBottom: 16,
        paddingLeft: isUser ? 20 : 0,
        paddingRight: isUser ? 0 : 20,
        animation: "iris-fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
          color: isUser ? "#666" : "#00ff88",
          opacity: isUser ? 1 : 0.8,
          fontWeight: 600,
        }}
      >
        <span>{isUser ? ">> USER_INPUT" : ">> IRIS_RESPONSE"}</span>
        <span style={{ color: "#333" }}>|</span>
        <span style={{ color: "#444" }}>{formatTime(msg.timestamp)}</span>
      </div>

      <div
        style={{
          color: color,
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: isUser ? 400 : 500,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          borderLeft: `2px solid ${isUser ? "#333" : "#00ff88"}`,
          paddingLeft: 12,
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

function ControlButton({
  onClick,
  active,
  danger,
  disabled,
  children,
  label,
}: {
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  const [pressed, setPressed] = useState(false);

  const baseColor = danger ? "#ff4444" : "#00ff88";
  const inactiveColor = danger ? "#552222" : "#222222";
  const borderColor = active ? baseColor : inactiveColor;

  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: 60,
        height: 60,
        background: "#000000",
        border: `2px solid ${borderColor}`,
        color: active ? baseColor : "#444444",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        transition: "all 0.1s ease",
        transform: pressed ? "scale(0.95)" : "scale(1)",
        boxShadow: active
          ? `0 0 20px ${danger ? "rgba(255,68,68,0.3)" : "rgba(0,255,136,0.3)"}`
          : "none",
        opacity: disabled ? 0.3 : 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background fill when active */}
      {active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: baseColor,
            opacity: 0.05,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, display: "flex" }}>
        {children}
      </div>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function IRISMini({
  state: stateProp,
  audioLevel: audioProp,
  transcript: transcriptProp,
  isConnected: connectedProp,
  isMuted: mutedProp,
  onConnect,
  onDisconnect,
  onMute,
}: IRISMiniProps) {
  // Internal state (demo mode when no external control passed)
  const [demoState, setDemoState] = useState<AIState>("idle");
  const [demoAudio, setDemoAudio] = useState(0);
  const [demoConnected, setDemoConnected] = useState(false);
  const [demoMuted, setDemoMuted] = useState(false);
  const [demoTranscript, setDemoTranscript] = useState<TranscriptMessage[]>([]);
  const [uptime, setUptime] = useState(0);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const demoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const systemTime = useSystemTime();

  const state = stateProp ?? demoState;
  const audioLevel = audioProp ?? demoAudio;
  const isConnected = connectedProp ?? demoConnected;
  const isMuted = mutedProp ?? demoMuted;
  const transcript = transcriptProp ?? demoTranscript;

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Uptime counter
  useEffect(() => {
    if (!isConnected) {
      setUptime(0);
      return;
    }
    const t = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(t);
  }, [isConnected]);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sc = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sc}`;
  };

  // ── Demo mode automation ────────────────────────────────────────────────────
  const runDemoSequence = useCallback(() => {
    if (stateProp !== undefined) return; // controlled externally

    const seq = [
      () => {
        setDemoState("listening");
        setDemoAudio(0.6);
      },
      () => {
        setDemoTranscript((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "user",
            text: "System status report query.",
            timestamp: new Date(),
          },
        ]);
        setDemoAudio(0);
      },
      () => {
        setDemoState("thinking");
        setDemoAudio(0.2);
      },
      () => {
        setDemoState("speaking");
        setDemoAudio(0.55);
        setDemoTranscript((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: "Core systems nominal. Neural lattice synchronization complete at 99.8%. Environmental parameters within expected variance. Standby for directive.",
            timestamp: new Date(),
          },
        ]);
      },
      () => {
        setDemoState("idle");
        setDemoAudio(0);
      },
    ];

    let i = 0;
    const next = () => {
      if (i >= seq.length) return;
      seq[i]();
      i++;
      demoTimerRef.current = setTimeout(
        next,
        [1800, 400, 1500, 3500, 500][i - 1] ?? 1000,
      );
    };
    demoTimerRef.current = setTimeout(next, 1500);
  }, [stateProp]);

  const handleConnect = () => {
    if (onConnect) {
      onConnect();
      return;
    }
    setDemoConnected(true);
    setDemoTranscript([]);
    runDemoSequence();
  };

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
      return;
    }
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setDemoConnected(false);
    setDemoState("idle");
    setDemoAudio(0);
  };

  const handleMute = () => {
    if (onMute) {
      onMute();
      return;
    }
    setDemoMuted((m) => !m);
  };

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        background: "#000000",
        color: "#00ff88",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "grid",
        gridTemplateRows: "50px 1fr",
        gridTemplateColumns: "300px 1fr 320px",
        gridTemplateAreas: `
        "topbar topbar topbar"
        "left   center right"
      `,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Global styles ──────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000000; }
        ::-webkit-scrollbar-thumb { background: #222222; }
        ::-webkit-scrollbar-thumb:hover { background: #00ff88; }

        @keyframes iris-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes iris-scan {
          0%   { transform: translateY(-100%); opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes iris-fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iris-glow-pulse {
          0%, 100% { text-shadow: 0 0 5px #00ff88aa; }
          50%       { text-shadow: 0 0 15px #00ff88, 0 0 25px #00ff8855; }
        }
        @keyframes iris-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Static grid overlay for texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0.03,
          background:
            "linear-gradient(90deg, #111 1px, transparent 1px), linear-gradient(#111 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Moving scan ray - subtler */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,136,0.1), transparent)",
          animation: "iris-scan 12s linear infinite",
          pointerEvents: "none",
          zIndex: 998,
        }}
      />

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          gridArea: "topbar",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid #111111",
          background: "#000000",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              background: "#00ff88",
              boxShadow: isConnected ? "0 0 10px #00ff88" : "none",
            }}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#ffffff",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            IRIS<span style={{ color: "#00ff88" }}>_</span>CORE
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 12,
            color: "#666666",
            fontWeight: 500,
          }}
        >
          <NetworkBar active={isConnected} />
          <div
            style={{
              display: "flex",
              gap: 8,
              color: isConnected ? "#aaa" : "#444",
            }}
          >
            <span style={{ color: "#444" }}>UP:</span>
            <span style={{ fontFamily: "monospace", minWidth: 65 }}>
              {formatUptime(uptime)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, color: "#aaa" }}>
            <span style={{ color: "#444" }}>SYS_TIME:</span>
            <span style={{ fontFamily: "monospace" }}>
              {systemTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div
        style={{
          gridArea: "left",
          borderRight: "1px solid #111111",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          gap: 20,
          overflowY: "auto",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#666",
            letterSpacing: "0.2em",
            borderBottom: "1px solid #111",
            paddingBottom: 8,
            marginBottom: -4,
          }}
        >
          SYSTEM_STATUS
        </div>

        {/* Network telemetry */}
        <div
          style={{
            border: "1px solid #111111",
            padding: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#999",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              DATA_STREAM
            </span>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                background: isConnected ? "rgba(0,255,136,0.06)" : "#111",
                color: isConnected ? "#00ff88" : "#444",
                border: `1px solid ${isConnected ? "#1a3a22" : "#222"}`,
              }}
            >
              {isConnected ? "SECURE" : "INACTIVE"}
            </div>
          </div>
          {[
            ["LATENCY", "RATE"],
            ["TX", "RX"],
          ].map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: ri === 0 ? 10 : 0,
              }}
            >
              {row.map((lbl) => (
                <div key={lbl} style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#555",
                      marginBottom: 4,
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {lbl}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: isConnected ? "#ffffff" : "#333",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {isConnected
                      ? ri === 0
                        ? lbl === "LATENCY"
                          ? "12ms"
                          : "3.1k/s"
                        : lbl === "TX"
                          ? "1.2MB"
                          : "8.7MB"
                      : "--"}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Core metrics */}
        <div
          style={{
            border: "1px solid #111111",
            padding: "15px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#999",
              fontWeight: 600,
              letterSpacing: "0.1em",
              marginBottom: 15,
            }}
          >
            HARDWARE_RESOURCES
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <MetricCard
              label="CPU"
              value={isConnected ? "31" : "--"}
              unit="%"
            />
            <MetricCard
              label="RAM"
              value={isConnected ? "4.2" : "--"}
              unit="GB"
            />
            <MetricCard
              label="NET"
              value={isConnected ? "98" : "--"}
              unit="mbps"
            />
            <MetricCard
              label="LOAD"
              value={isConnected ? "1.2" : "--"}
              unit="avg"
            />
          </div>
        </div>
      </div>

      {/* --- Center panel ───────────────────────────────────────────────────── */}
      <div
        style={{
          gridArea: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 20px 100px",
          position: "relative",
          gap: 30,
          background: "#000",
        }}
      >
        {/* State label */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.4em",
            color: state === "idle" ? "#333" : "#00ff88",
            transition: "color 0.4s ease",
            border: `1px solid ${state === "idle" ? "#222" : "#1a3a22"}`,
            padding: "6px 16px",
            background:
              state === "idle" ? "transparent" : "rgba(0, 255, 136, 0.02)",
          }}
        >
          {STATE_LABEL[state]}
        </div>

        {/* 3D Sphere Container */}
        <div
          style={{
            width: 350,
            height: 350,
            position: "relative",
          }}
        >
          {/* Static geometric decoration instead of animations */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              border: `1px solid #111`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: `1px solid #181818`,
            }}
          />

          <AICore state={state} audioLevel={audioLevel} />
        </div>

        {/* Audio Interface section */}
        <div
          style={{
            width: 350,
            display: "flex",
            flexDirection: "column",
            gap: 15,
            alignItems: "center",
          }}
        >
          {/* Audio level bar */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#444",
                letterSpacing: "0.1em",
                width: 30,
              }}
            >
              INPUT
            </span>
            <div
              style={{
                flex: 1,
                height: 4,
                background: "#111",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${audioLevel * 100}%`,
                  background: "#00ff88",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isConnected ? "#fff" : "#444",
                fontFamily: "monospace",
                width: 35,
                textAlign: "right",
              }}
            >
              {Math.round(audioLevel * 100)}%
            </span>
          </div>

          {/* Frequency visualizer - solid bars */}
          <div
            style={{
              display: "flex",
              gap: 3,
              alignItems: "flex-end",
              height: 30,
              width: "100%",
            }}
          >
            {Array.from({ length: 40 }, (_, i) => {
              const baseH = isConnected ? Math.abs(Math.sin(i * 0.3)) * 15 : 2;
              const dynamicH = isConnected
                ? audioLevel * 15 * Math.random()
                : 0;
              const h = Math.max(2, baseH + dynamicH);

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: Math.round(h),
                    background: isConnected
                      ? i % 2 === 0
                        ? "#00ff88"
                        : "#00cc66"
                      : "#222",
                    transition: "height 0.1s ease, background 0.3s ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right panel — Transcript ────────────────────────────────────────── */}
      <div
        style={{
          gridArea: "right",
          borderLeft: "1px solid #111111",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "0 15px",
            height: 40,
            borderBottom: "1px solid #111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.15em",
            }}
          >
            SESSION_LOG
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: isConnected ? "#00ff88" : "#444",
              letterSpacing: "0.1em",
            }}
          >
            LIVE
          </span>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {transcript.length === 0 && (
            <div
              style={{
                textAlign: "left",
                color: "#333",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: 20,
                lineHeight: 1.6,
                borderLeft: "2px solid #222",
                paddingLeft: 12,
              }}
            >
              {isConnected
                ? ">> Awaiting initialization sequence or voice input..."
                : ">> System standing by. Establish link to begin log."}
            </div>
          )}
          {transcript.map((msg) => (
            <TranscriptMessageItem key={msg.id} msg={msg} />
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* ── Floating Bottom Controls ────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "260px", // align with grid
          right: "280px", // align with grid
          height: 100,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "linear-gradient(to top, #000 40%, transparent)",
          pointerEvents: "none", // let clicks pass through background
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            pointerEvents: "auto", // re-enable clicks for buttons
            background: "#000",
            padding: "10px 30px",
            border: "1px solid #111",
            borderBottom: "none",
          }}
        >
          {/* Connect / Disconnect */}
          <ControlButton
            label={isConnected ? "TERMINATE LINK" : "ESTABLISH LINK"}
            active={isConnected}
            danger={isConnected}
            onClick={isConnected ? handleDisconnect : handleConnect}
          >
            {isConnected ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            )}
          </ControlButton>

          {/* Mic */}
          <ControlButton
            label={isMuted ? "INPUT ON" : "INPUT MUTE"}
            active={!isMuted && isConnected}
            danger={isMuted}
            onClick={handleMute}
            disabled={!isConnected}
          >
            {isMuted ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </ControlButton>
        </div>
      </div>
    </div>
  );
}
