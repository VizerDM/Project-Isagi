import Tracker from "./Components/Tracker";
import "./App.css";
import Pomodoro from "./Components/Pomodoro";

function App() {
  return (
    <>
      <div className="main-app">
        <h1>Isagi</h1>
        <div className="main-content">
          <div className="tracker-section">
            <Tracker />
          </div>
          <div className="pomodoro-section">
            <h3>Study</h3>

            <Pomodoro />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
