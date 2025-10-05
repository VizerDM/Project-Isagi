import { useState, useRef, useEffect } from "react";
import "./Tracker.css";

type Habit = {
  name: string;
  checks: boolean[];
};

function Tracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { name: "GYM", checks: Array(30).fill(false) },
    { name: "Work", checks: Array(30).fill(false) },
  ]);

  const [adding, setAdding] = useState(false);
  const inputref = useRef<HTMLInputElement | null>(null); //reference to the input button

  useEffect(() => {
    if (adding && inputref.current) {
      inputref.current.focus();
    }
  }, [adding]);

  const addHabits = (name: string) => {
    if (!name.trim()) return;
    const newHabit = { name: name, checks: Array(30).fill(false) };
    setHabits((prev) => [...prev, newHabit]);
    setAdding(false);
  };

  const onCheck = (habitIndex: number, dayIndex: number): void => {
    // handler for when a checkbox is ticked/unticked
    setHabits(
      (
        prevHabits //The useState Modifier, this is the second method that uses the previous object
      ) =>
        prevHabits.map(
          (
            habit,
            hIdx //copying each habit in a new array of habits (new state ig)
          ) =>
            habitIndex === hIdx
              ? {
                  ...habit, //Spread Op. it copies all propreties of the previous habit obj in this the name.
                  checks: habit.checks.map(
                    (
                      checked,
                      dIdx //now we copy the checks array and change only the checked day
                    ) => (dIdx === dayIndex ? !checked : checked)
                  ),
                }
              : habit
        )
    );
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <>
      <div className="main">
        <table border={1}>
          <tbody>
            <tr>
              <th></th>

              {days.map((day) => {
                return <th key={day}>{day}</th>;
              })}
            </tr>

            {habits.map((habit, hIdx) => (
              <tr key={hIdx}>
                <th>{habit.name}</th>
                {habit.checks.map((checked, dIdx) => (
                  <td key={dIdx} scope="row">
                    <input
                      key={dIdx}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onCheck(hIdx, dIdx)}
                    ></input>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="add-habit">
          <input
            type="button"
            value="Add Habit"
            onClick={() => setAdding(true)}
          />
          {adding && (
            <input
              type="text"
              //reference to auto focus on the text input
              ref={inputref}
              // When the user presses Enter
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;

                  addHabits(value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Tracker;
