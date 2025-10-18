import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Timer() {
  return (
    <div>
      <CircularProgressbar
        value={60}
        text={`60%`}
        styles={buildStyles({
          textColor:'#fff',
          trailColor:'#5E6272',
          pathColor:'#6C5DD3'
        })}
      />
      ;
    </div>
  );
}

export default Timer;
