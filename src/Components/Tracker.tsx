import { useState, useRef, useEffect } from "react";
import "./Tracker.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Habit = {
  name: string;
  checks: boolean[];
};
type Month = {
  days: number;
  name: string;
  habits: Habit[];
  sleep: number[];
};

function Tracker() {
  const STORAGE_KEY_MONTHS = "monthData";

  const [months, setMonths] = useState<Month[]>(() => {
    const DefaultMonths = {
      January: 31,
      February: 28, // 29 in leap years
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };
    const monthsArray = Object.entries(DefaultMonths).map(([name, days]) => ({
      name,
      days,
      sleep: Array(days).fill(0),
      habits: [],
    }));
    const saved = localStorage.getItem(STORAGE_KEY_MONTHS);
    if (saved) {
      return JSON.parse(saved);
    } else {
      return monthsArray;
    }
  });

  const addSleep = (hrs: number, dayIndex: number, monthIndex: number) => {
    if (hrs < 0 || hrs > 12) return;
    setMonths((prev) =>
      prev.map((month, mIdx) =>
        monthIndex === mIdx
          ? {
              ...month,
              sleep: month.sleep.map((hours, dIdx) =>
                dIdx === dayIndex ? hrs : hours
              ),
            }
          : month
      )
    );
  };

  const [adding, setAdding] = useState(false);
  const inputref = useRef<HTMLInputElement | null>(null); //reference to the input button
  const [currentMonth, setCurrMonth] = useState(0);

  //Save ALL changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(months));
  }, [months]);

  //focus on the text input
  useEffect(() => {
    if (adding && inputref.current) {
      inputref.current.focus();
    }
  }, [adding]);

  const isDuplicate = (name: string) => {
    return months[currentMonth].habits.some(
      (habit) => habit.name.toLowerCase() === name.toLowerCase()
    );
  };
  // add a habit
  const addHabits = (name: string, currentMonth: number) => {
    if (!name.trim() || isDuplicate(name)) {
      setAdding(false);
      return;
    }
    const newHabit = {
      name: name,
      checks: Array(months[currentMonth].days).fill(false),
    };
    setMonths((prev) =>
      prev.map((month, mIdx) =>
        mIdx === currentMonth
          ? { ...month, habits: [...month.habits, newHabit] }
          : month
      )
    );
    setAdding(false);
  };

  //Clear all
  const clearAll = (monthIndex: number) => {
    window.confirm("Are you sure?");
    setMonths((prev) =>
      prev.map((month, mIdx) =>
        monthIndex === mIdx
          ? {
              ...month,
              sleep: Array(month.days).fill(0),
              habits: month.habits.map((habit) => ({
                ...habit,
                checks: Array(month.days).fill(false),
              })),
            }
          : month
      )
    );
  };

  //Delete A habit
  const deleteHabit = (habitIndex: number, currentMonth: number) => {
    setMonths((prev) =>
      prev.map((month, mIdx) =>
        mIdx === currentMonth
          ? {
              ...month,
              habits: month.habits.filter((_, hIdx) => hIdx !== habitIndex),
            }
          : month
      )
    );
  };

  const onCheck = (
    habitIndex: number,
    dayIndex: number,
    currentMonth: number
  ) => {
    setMonths((prev) =>
      prev.map((month, mIdx) =>
        mIdx === currentMonth
          ? {
              ...month,
              habits: month.habits.map((habit, hIdx) =>
                hIdx === habitIndex
                  ? {
                      ...habit,
                      checks: habit.checks.map((checked, dIdx) =>
                        dIdx === dayIndex ? !checked : checked
                      ),
                    }
                  : habit
              ),
            }
          : month
      )
    );
  };

  const days = Array.from(
    { length: months[currentMonth].days },
    (_, i) => i + 1
  );

  const sleepData = months[currentMonth].sleep.map((hrs, i) => ({
    day: i + 1,
    sleep: hrs,
  }));
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  return (
    <>
      <div className="main">
        <div className="month-main">
          <button
            className="month-button"
            onClick={() => setShowMonthDropdown((v) => !v)}
          >
            {months[currentMonth].name} ▼
          </button>
          {showMonthDropdown && (
            <select
              className="month-select"
              value={currentMonth}
              onChange={(e) => {
                setCurrMonth(Number(e.target.value));
                setShowMonthDropdown(false);
              }}
              size={months.length}
              style={{
                position: "absolute",
                zIndex: 10,
                left: 0,
                top: "2.5em",
                minWidth: "120px",
                background: "#fff",
                border: "1px solid #aaa",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {months.map((month, monthIdx) => (
                <option key={monthIdx} value={monthIdx}>
                  {month.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <table border={1}>
          <tr>
            <th></th>

            {days.map((day) => {
              return <th key={day}>{day}</th>;
            })}
          </tr>

          {months[currentMonth].habits.map((habit, hIdx) => (
            <tr key={hIdx}>
              <th>
                {habit.name}
                <input
                  type="button"
                  className="delete-btn"
                  value="X"
                  onClick={() => deleteHabit(hIdx, currentMonth)}
                />
              </th>
              {habit.checks.map((checked, dIdx) => (
                <td key={dIdx} scope="row">
                  <input
                    key={dIdx}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onCheck(hIdx, dIdx, currentMonth)}
                  ></input>
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <th id="sleep-row">Sleep</th>
            {months[currentMonth].sleep.map((hrs, dIdx) => (
              <td key={dIdx}>
                <input
                  type="number"
                  max={12}
                  value={hrs}
                  onChange={(e) =>
                    addSleep(Number(e.target.value), dIdx, currentMonth)
                  }
                  className="sleep-input"
                />
              </td>
            ))}
          </tr>
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

                  addHabits(value, currentMonth);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          )}
          <input
            type="button"
            value="Clear All"
            onClick={() => clearAll(currentMonth)}
            className="clear"
          />
        </div>

        <div className="sleep-graph">
          <h3>Sleep Graph</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={sleepData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#CFC8FF" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#6C5DD0"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default Tracker;
