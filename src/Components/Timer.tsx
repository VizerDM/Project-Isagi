import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./Buttons/PlayButton";
import PauseButton from "./Buttons/PauseButton";
import SettingsButton from "./Buttons/SettingsButton";
import { useState, useEffect } from "react";

type SettingsProps = {
  workTime: number;
  setWorkTime?: React.Dispatch<React.SetStateAction<number>>;
  breakTime: number;
  setBreakTime?: React.Dispatch<React.SetStateAction<number>>;
  showSettings?: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

function Timer({ workTime, setShowSettings, breakTime }: SettingsProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  useEffect(() => {
    setTimeLeft(workTime * 60);
  }, [workTime, breakTime]);

  return (
    <div>
      <CircularProgressbar
        value={workTime}
        text={`60`}
        styles={buildStyles({
          textSize: "1.5rem",
          textColor: "#CFC8FF",
          trailColor: "#494852ff",
          pathColor: "#6C5DD3",
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
