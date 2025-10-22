import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./Buttons/PlayButton";
import PauseButton from "./Buttons/PauseButton";
import SettingsButton from "./Buttons/SettingsButton";
import { useState, useEffect, useRef } from "react";

type SettingsProps = {
  workTime: number;
  setWorkTime?: React.Dispatch<React.SetStateAction<number>>;
  breakTime: number;
  setBreakTime?: React.Dispatch<React.SetStateAction<number>>;
  showSettings?: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

function Timer({ workTime, setShowSettings, breakTime }: SettingsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState("w");
  const [timeLeft, setTimeLeft] = useState(workTime * 60);

  // Refs for latest state
  const isPausedRef = useRef(isPaused);
  const timeLeftRef = useRef(timeLeft);
  const modeRef = useRef(mode);

  // Keep refs in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
    timeLeftRef.current = timeLeft;
    modeRef.current = mode;
  }, [isPaused, timeLeft, mode]);

  // Reset timer when mode or times change
  useEffect(() => {
    if (mode === "w") setTimeLeft(workTime * 60);
    else setTimeLeft(breakTime * 60);
  }, [workTime, breakTime, mode]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      if (timeLeftRef.current <= 0) {
        setIsPaused(true);
        // Switch mode and reset timer
        setMode((prevMode) => {
          const nextMode = prevMode === "w" ? "b" : "w";
          // Set timer for next mode
          setTimeLeft(nextMode === "w" ? workTime * 60 : breakTime * 60);
          return nextMode;
        });
        return;
      }

      // Decrement timer
      setTimeLeft((prev) => {
        timeLeftRef.current = prev - 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [workTime, breakTime]);

  const totalseconds = mode === "w" ? workTime * 60 : breakTime * 60;
  const percentage = Math.max(0, Math.round((timeLeft / totalseconds) * 100));
  const displayMinutes = Math.floor(timeLeft / 60);
  let displaySeconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div>
      <CircularProgressbar
        value={percentage}
        text={`${displayMinutes}:${displaySeconds}`}
        styles={buildStyles({
          textSize: "1.5rem",
          textColor: "#CFC8FF",
          trailColor: "#494852ff",
          pathColor: mode === "w" ? "#6C5DD0" : "#FFCE73",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPaused ? (
          <PlayButton onClick={() => setIsPaused(false)} />
        ) : (
          <PauseButton onClick={() => setIsPaused(true)} />
        )}
        <SettingsButton onClick={() => setShowSettings(true)} />
      </div>
    </div>
  );
}

export default Timer;
