import { useState, useRef, useEffect, use } from "react";
import "./Tracker.css";
import Select from "react-select";

type Habit = {
  name: string;
  checks: boolean[];
};

function Tracker() {
  const STORAGE_KEY_HABITS = "habitsData";
  const STORAGE_KEY_SLEEP = "sleepData";

  //habit load
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_HABITS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  //Sleep Load
  const [sleeps, setSleep] = useState<number[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SLEEP);
      return data ? JSON.parse(data) : Array(30).fill(0);
    } catch {
      return Array(30).fill(0);
    }
  });

  const addSleep = (hrs: number, dayIndex: number) => {
    if (hrs < 0 || hrs > 12) return;
    setSleep((prev) =>
      prev.map((hours, dIdx) => (dayIndex === dIdx ? hrs : hours))
    );
  };

  const [adding, setAdding] = useState(false);
  const inputref = useRef<HTMLInputElement | null>(null); //reference to the input button

  //Save sleep change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SLEEP, JSON.stringify(sleeps));
  }, [sleeps]);
  //Save habit change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    if (adding && inputref.current) {
      inputref.current.focus();
    }
  }, [adding]);

  const isDuplicate = (name: string) => {
    return habits.some(
      (habit) => habit.name.toLowerCase() === name.toLowerCase()
    );
  };
  // add a habit
  const addHabits = (name: string) => {
    if (!name.trim() || isDuplicate(name)) {
      setAdding(false);
      return;
    }
    const newHabit = { name: name, checks: Array(30).fill(false) };
    setHabits((prev) => [...prev, newHabit]);
    setAdding(false);
  };

  //Clear all checks on habits ++ Clears sleepdata also
  const clearAll = () => {
    window.confirm("Are you sure?");
    setHabits((prev) =>
      prev.map((habit) => ({ ...habit, checks: Array(30).fill(false) }))
    );
    setSleep((prev) => prev.map((hrs) => 0));
  };

  //Delete A habit
  const deleteHabit = (habitIndex: number) => {
    setHabits((prev) => prev.filter((_, hIdx) => hIdx !== habitIndex));
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
                <th>
                  {habit.name}
                  <input
                    type="button"
                    className="delete-btn"
                    value="X"
                    onClick={() => deleteHabit(hIdx)}
                  />
                </th>
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

            <tr>
              <th id="sleep-row">Sleep</th>
              {sleeps.map((hrs, dIdx) => (
                <td key={dIdx}>
                  <input
                    type="number"
                    max={12}
                    value={hrs}
                    onChange={(e) => addSleep(Number(e.target.value), dIdx)}
                    className="sleep-input"
                  />
                </td>
              ))}
            </tr>
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
          <input
            type="button"
            value="Clear All"
            onClick={() => clearAll()}
            className="clear"
          />
        </div>
      </div>
    </>
  );
}

export default Tracker;
