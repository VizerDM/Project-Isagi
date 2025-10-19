import Tracker from "./Components/Tracker";
import "./App.css";
import Pomodoro from "./Components/Pomodoro";

function App() {
  return (
    <>
      <div className="main-app">
        <h1>Isagi</h1>
        <Tracker />
        <Pomodoro/>

      </div>
    </>
  );
}

export default App;
