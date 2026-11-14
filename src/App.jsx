import { useState, useEffect, useRef } from "react";

function pad(n) {
  return n.toString().padStart(2, "0");
}

function formatTime(ms, showSeconds = false) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  // Automatically show seconds in the final minute
  const forceShowSeconds = totalSeconds > 0 && totalSeconds <= 60;
  return showSeconds || forceShowSeconds
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}`;
}

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [showSeconds, setShowSeconds] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState("start-duration");

  const [start, setStart] = useState(() => {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [duration, setDuration] = useState("");

  const [countdownInput, setCountdownInput] = useState(60);
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [countdownRunning, setCountdownRunning] = useState(false);

  const [now, setNow] = useState(new Date());
  const settingsRef = useRef(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close settings on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [settingsOpen]);

  // Dark mode class toggle
  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.documentElement.classList.toggle("dark-mode", dark);
  }, [dark]);

  // Countdown timer interval
  useEffect(() => {
    if (!countdownRunning) return;

    const interval = setInterval(() => {
      setCountdownLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setCountdownRunning(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownRunning]);

  // Derived values for start-duration mode
  let remainingMs = 0;
  let endFormatted = "";
  const numDuration = Number(duration);

  if (mode === "start-duration" && start && numDuration > 0) {
    const [h, m] = start.split(":").map(Number);
    const startDate = new Date(now);
    startDate.setHours(h, m, 0, 0);
    const endDate = new Date(startDate.getTime() + numDuration * 60000);
    endFormatted = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
    remainingMs = endDate.getTime() - now.getTime();
  }

  const handleStartCountdown = () => {
    const mins = Number(countdownInput);
    if (mins > 0) {
      setCountdownLeft(mins * 60000);
      setCountdownRunning(true);
    }
  };

  const handleStopCountdown = () => {
    setCountdownRunning(false);
    setCountdownLeft(0);
  };

  const currentFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const isRemainingActive = numDuration > 0 && remainingMs > 0;
  const remainingDisplay = isRemainingActive
    ? formatTime(remainingMs, showSeconds)
    : `00:00${showSeconds ? ":00" : ""}`;

  return (
    <div className="app-container">
      {/* Settings Menu */}
      <div className="settings-container" ref={settingsRef}>
        <button
          className="settings-btn"
          onClick={() => setSettingsOpen((o) => !o)}
          aria-label="Settings"
        >
          ⚙️
        </button>

        {settingsOpen && (
          <div className="settings-menu">
            <label>
              <input
                type="checkbox"
                checked={dark}
                onChange={() => setDark((d) => !d)}
              />
              Dark Mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={showSeconds}
                onChange={() => setShowSeconds((s) => !s)}
              />
              Show Seconds
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="start-duration"
                checked={mode === "start-duration"}
                onChange={() => setMode("start-duration")}
              />
              Start + Duration
            </label>
            <label>
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

      {/* Main Timer Card */}
      <div className="exam-timer-card">
        <h1 className="exam-timer-title">Exam Timer</h1>

        {mode === "start-duration" ? (
          <form className="timer-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <label htmlFor="start">Start:</label>
              <input
                id="start"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <label htmlFor="duration">Duration:</label>
              <div className="duration-input-wrapper">
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                  onFocus={(e) => {
                    if (e.target.value === "") setDuration("");
                  }}
                  className="form-input form-input-short"
                  placeholder="60"
                />
                <span className="form-input-unit">min</span>
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="now">Now:</label>
              <input
                id="now"
                type="time"
                readOnly
                value={currentFormatted}
                className="form-input"
              />
            </div>

            <hr className="divider" />

            <div className="form-row">
              <label>Remaining:</label>
              <input
                type="text"
                readOnly
                value={remainingDisplay}
                className={`form-input remaining-input ${isRemainingActive ? "active" : "danger"}`}
              />
            </div>

            <hr className="divider" />

            <div className="form-row">
              <label htmlFor="end">End:</label>
              <input
                id="end"
                type="time"
                readOnly
                value={endFormatted}
                className="form-input"
              />
            </div>
          </form>
        ) : (
          <form className="countdown-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row countdown-input-row">
              <label htmlFor="cdur">Minutes:</label>
              <input
                id="cdur"
                type="number"
                min="1"
                value={countdownInput}
                onChange={(e) => setCountdownInput(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-input form-input-short"
                disabled={countdownRunning}
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn-primary"
                onClick={handleStartCountdown}
                disabled={countdownRunning || !countdownInput || Number(countdownInput) <= 0}
              >
                Start
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleStopCountdown}
                disabled={!countdownRunning && countdownLeft === 0}
              >
                Stop
              </button>
            </div>

            <div className="countdown-display-wrapper">
              <input
                type="text"
                readOnly
                value={formatTime(countdownLeft, showSeconds)}
                className={`countdown-display ${countdownLeft > 0 ? "active" : "danger"}`}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
