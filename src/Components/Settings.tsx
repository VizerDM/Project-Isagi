import BackButton from "./Buttons/BackButton";
import "./Slider.css";

type SettingsProps = {
  workTime: number;
  setWorkTime: React.Dispatch<React.SetStateAction<number>>;
  breakTime: number;
  setBreakTime: React.Dispatch<React.SetStateAction<number>>;
  showSettings?: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

function Settings({
  workTime,
  setWorkTime,
  breakTime,
  setBreakTime,
  showSettings,

  setShowSettings,
}: SettingsProps) {
  return (
    <div
      className="pomo-settings"
      style={{ maxWidth: 400, margin: "2em auto" }}
    >
      <h2> Settings</h2>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Time (Minutes)</div>

      <div style={{margin:'15px 5px '}}>
        <label htmlFor="work-time" style={{ fontWeight: 600, marginRight: 8 }}>
          Work:
        </label>
        <input
          id="work-time"
          type="number"
          min={10}
          max={60}
          step={1}
          value={workTime}
          onChange={(e) => setWorkTime(Number(e.target.value))}
          style={{
            width: 20,
            padding: "6px 10px",
            fontSize: "1.1em",
            border: "1.5px solid #6C5DD0",
            borderRadius: 6,
            background: "#262A34",
            color: "#CFC8FF",
            fontWeight: 700,
            outline: "none",
          }}
        />
      </div>
      <div>
        {" "}
        <label
          htmlFor="break-time"
          style={{ fontWeight: 600, margin: "0 8px" }}
        >
          Break:
        </label>
        <input
          id="break-time"
          type="number"
          min={10}
          max={60}
          step={1}
          value={breakTime}
          onChange={(e) => setBreakTime(Number(e.target.value))}
          style={{
            width: 20,
            padding: "6px 10px",
            fontSize: "1.1em",
            border: "1.5px solid #6C5DD0",
            borderRadius: 6,
            background: "#262A34",
            color: "#CFC8FF",
            fontWeight: 700,
            outline: "none",
          }}
        />
      </div>

      <BackButton onClick={() => setShowSettings(false)} />
    </div>
  );
}

export default Settings;
