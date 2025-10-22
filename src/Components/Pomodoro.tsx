import Timer from "./Timer";
import Settings from "./Settings";
import "./Pomodoro.css";
import { useState } from "react";

function Pomodoro() {
  const [showSettings, setShowSettings] = useState(false);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(10);

  return (
    <main className="Pomo-main">

      {showSettings ? (
        <Settings
          workTime={workTime}
          setWorkTime={setWorkTime}
          breakTime={breakTime}
          setBreakTime={setBreakTime}
          setShowSettings={setShowSettings}
        />
      ) : (
        <Timer
          workTime={workTime}
          breakTime={breakTime}
          setShowSettings={setShowSettings}
        />
      )}
    </main>
  );
}

export default Pomodoro;
