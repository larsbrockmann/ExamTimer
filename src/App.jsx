import React, { useState, useEffect, useRef } from "react";

// Utility: Pad number to 2 digits
function pad(n) {
  return n.toString().padStart(2, "0");
}

// Utility: Format milliseconds as HH:MM or HH:MM:SS
function formatTime(ms, showSeconds = false) {
  let totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  // Force show seconds only in the final 5 minutes
  const forceShowSeconds = totalSeconds > 0 && totalSeconds <= 60;
  return (showSeconds || forceShowSeconds)
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}`;
}

// Main App Component
export default function App() {
  // --- State ---
  // Settings
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [showSeconds, setShowSeconds] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Modes
  const [mode, setMode] = useState("start-duration"); // "start-duration" or "countdown"

  // Start/Duration mode
  const [start, setStart] = useState(() => {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [duration, setDuration] = useState("");

  // Countdown mode
  const [countdownInput, setCountdownInput] = useState(60);
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const countdownInterval = useRef();

  // Timer for start/duration mode
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Click outside to close settings menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      const settingsButton = document.querySelector('button[aria-label="Settings"]');
      const settingsMenu = document.querySelector('.settings-menu');
      
      if (settingsOpen && 
          settingsButton && 
          settingsMenu && 
          !settingsButton.contains(event.target) && 
          !settingsMenu.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [settingsOpen]);

  // Theme effect
  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.documentElement.classList.toggle("dark-mode", dark);
  }, [dark]);

  // Countdown logic
  useEffect(() => {
    if (countdownRunning && countdownLeft > 0) {
      countdownInterval.current = setInterval(() => {
        setCountdownLeft((left) => {
          if (left <= 1000) {
            clearInterval(countdownInterval.current);
            return 0;
          }
          return left - 1000;
        });
      }, 1000);
      return () => clearInterval(countdownInterval.current);
    }
    return () => {};
  }, [countdownRunning, countdownLeft]);

  // --- Derived values ---
  let remainingMs = 0;
  let bis = "";
  if (mode === "start-duration") {
    const [h, m] = start.split(":").map(Number);
    const startDate = new Date(now);
    startDate.setHours(h, m, 0, 0);
    const bisDate = new Date(startDate.getTime() + duration * 60000);
    bis = `${pad(bisDate.getHours())}:${pad(bisDate.getMinutes())}`;
    remainingMs = bisDate - now;
  }

  // --- Theme Colors are now handled by CSS variables in index.css ---

  // --- Render ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--main-bg)",
        color: "var(--text-color)",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      {/* Settings menu */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          zIndex: 10
        }}
      >
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0002"
          }}
          aria-label="Settings"
        >
          ⚙️
        </button>
        {settingsOpen && (
          <div
            className="settings-menu"
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              background: "var(--card-bg)",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              boxShadow: "0 4px 24px #0003",
              padding: 20,
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={dark}
                onChange={() => setDark((d) => !d)}
              />
              Dark Mode
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={showSeconds}
                onChange={() => setShowSeconds((s) => !s)}
              />
              Show Seconds
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="radio"
                name="mode"
                value="start-duration"
                checked={mode === "start-duration"}
                onChange={() => setMode("start-duration")}
              />
              Start + Duration
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="radio"
                name="mode"
                value="countdown"
                checked={mode === "countdown"}
                onChange={() => setMode("countdown")}
              />
              Countdown
            </label>
          </div>
        )}
      </div>

      {/* Centered Timer Card */}
      <div id="center-wrapper">
        <div
          className="exam-timer-card"
          style={{ background: "var(--card-bg)", border: "1.5px solid var(--border-color)" }}
        >
          <h2 className="exam-timer-title">Exam Timer</h2>
          {mode === "start-duration" ? (
            <form
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
              onSubmit={e => e.preventDefault()}
            >
              {/* Start Time */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label htmlFor="start" style={{ flex: 1, textAlign: "right", fontSize: 20 }}>Start:</label>
                <input
                  id="start"
                  type="time"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  style={{ fontSize: 28, border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 8px", background: "var(--main-bg)", color: "var(--text-color)", width: 70 }}
                />
              </div>
              {/* Duration */}
              <div className="duration-row" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label htmlFor="duration" style={{ flex: 1, textAlign: "right", fontSize: 20, flexBasis: "50%" }}>Duration:</label>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    id="duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    onFocus={e => {e.target.value = ''; setDuration('')}}
                    style={{ fontSize: 28, border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 8px", background: "var(--main-bg)", color: "var(--text-color)", width: 70}}
                  />
                  <span style={{ fontSize: 20, color: "var(--text-color)" }}>min</span>
                </div>
              </div>
              {/* Current Time */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label style={{ flex: 1, textAlign: "right", fontSize: 20 }}>Current:</label>
                <input
                  type="time"
                  readOnly
                  value={pad(now.getHours()) + ":" + pad(now.getMinutes())}
                  style={{ fontSize: 28, border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 8px", background: "var(--main-bg)", color: "var(--text-color)", width: 70 }}
                  step={60}
                />
              </div>
              {/* Remaining Time */}
              <hr style={{ border: 'none', borderTop: '2px solid var(--accent)', margin: '18px 0 8px 0' }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label style={{ flex: 1, textAlign: "right", fontSize: 20 }}>Remaining:</label>
                <input
                  type="text"
                  readOnly
                  value={remainingMs > 0 ? formatTime(remainingMs, showSeconds) : "00:00" + (showSeconds ? ":00" : "")}
                  style={{ fontSize: 36, border: "1.5px solid var(--accent)", borderRadius: 8, padding: "6px 8px", background: "var(--main-bg)", color: remainingMs > 0 ? "var(--accent)" : "#e53935", width: 90, textAlign: "left", fontWeight: 700 }}
                />
              </div>
              <hr style={{ border: 'none', borderTop: '2px solid var(--accent)', margin: '8px 0 18px 0' }} />
              {/* End Time */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label style={{ flex: 1, textAlign: "right", fontSize: 20 }}>End:</label>
                <input
                  type="time"
                  readOnly
                  value={bis}
                  style={{ fontSize: 28, border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 8px", background: "var(--main-bg)", color: "var(--text-color)", width: 70 }}
                />
              </div>
            </form>
          ) : (
            <form
              style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center" }}
              onSubmit={e => e.preventDefault()}
            >
              {/* Countdown Input */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label htmlFor="cdur" style={{ fontSize: 20 }}>Minutes:</label>
                <input
                  id="cdur"
                  type="number"
                  min={1}
                  value={countdownInput}
                  onChange={e => setCountdownInput(Number(e.target.value))}
                  onFocus={e => {e.target.value = ''; setCountdownInput('')}}
                  style={{ fontSize: 28, border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 8px", background: "var(--main-bg)", color: "var(--text-color)", width: 50, textAlign: "right" }}
                  disabled={countdownRunning}
                />
              </div>
              {/* Countdown Controls */}
              <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
                <button
                  style={{ fontSize: 26, padding: "8px 32px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontWeight: 600, cursor: countdownRunning ? "not-allowed" : "pointer", boxShadow: countdownRunning ? "none" : "0 2px 8px #2e7dff33" }}
                  onClick={() => {
                    setCountdownLeft(countdownInput * 60000);
                    setCountdownRunning(true);
                  }}
                  disabled={countdownRunning}
                >
                  Start
                </button>
                <button
                  style={{ fontSize: 26, padding: "8px 32px", borderRadius: 8, border: "1.5px solid var(--accent)", background: "none", color: "var(--accent)", fontWeight: 600, cursor: !countdownRunning ? "not-allowed" : "pointer" }}
                  onClick={() => {
                    setCountdownRunning(false);
                    setCountdownLeft(0);
                  }}
                  disabled={!countdownRunning}
                >
                  Stop
                </button>
              </div>
              {/* Countdown Display */}
              <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                <input
                  type="text"
                  readOnly
                  value={formatTime(countdownLeft, showSeconds)}
                  style={{ fontSize: 32, border: "2px solid var(--accent)", borderRadius: 10, padding: "8px 12px", background: "var(--main-bg)", color: countdownLeft > 0 ? "var(--accent)" : "#e53935", textAlign: "center", width: 270, fontWeight: 700, letterSpacing: 2 }}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}