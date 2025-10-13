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
  Mood: number[];
};

function Tracker() {
  const STORAGE_KEY_MONTHS = "monthData";
  const STORAGE_KEY_CURR_MONTH = "currMonthData";

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
      Mood: Array(days).fill(0),
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
  const [currentMonth, setCurrMonth] = useState<number>(() => {
    const data = localStorage.getItem(STORAGE_KEY_CURR_MONTH);
    if (data) {
      return JSON.parse(data);
    } else {
      return 0;
    }
  });

  //Save ALL changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(months));
  }, [months]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURR_MONTH, JSON.stringify(currentMonth));
  }, [currentMonth]);

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

  const setMood = (currentMonth: number, day: number, newMood: number) => {
    if (newMood < 0 || newMood > 5) return;
    setMonths((prev) =>
      prev.map((month, mIdx) =>
        mIdx === currentMonth
          ? {
              ...month,
              Mood: month.Mood.map((currMood, dIdx) =>
                dIdx === day ? newMood : currMood
              ),
            }
          : month
      )
    );
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1:
        return "😠";
      case 2:
        return "😓";
      case 3:
        return "😐";
      case 4:
        return "😃";
      case 5:
        return "😎";
      default:
        return "";
    }
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
  const [showMoodDropdowns, setShowMoodDropdown] = useState(() =>
    Array(months[currentMonth].days).fill(false)
  );

  useEffect(() => {
    setShowMoodDropdown(Array(months[currentMonth].days).fill(false));
  }, [currentMonth, months[currentMonth].days]);
  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);

  const handleMoodButtonClick = (dIdx: number) => {
    setShowMoodDropdown(
      Array(months[currentMonth].days)
        .fill(false)
        .map((_, idx) => idx === dIdx)
    );
  };
  selectRefs.current = Array(months[currentMonth].days).fill(null);
  if (selectRefs.current.length !== months[currentMonth].days) {
    selectRefs.current.length = months[currentMonth].days;
  }

  useEffect(() => {
    showMoodDropdowns.forEach((isOpen, idx) => {
      if (isOpen && selectRefs.current[idx]) {
        selectRefs.current[idx]!.focus();
        // Trick to force it to open:
        const el = selectRefs.current[idx]!;
        const event = new MouseEvent("mousedown", { bubbles: true });
        el.dispatchEvent(event);
      }
    });
  }, [showMoodDropdowns]);

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
          <tr>
            <th>Mood</th>
            {days.map((day, dIdx) => (
              <td
                key={dIdx}
                style={{ textAlign: "center", position: "relative" }}
              >
                {showMoodDropdowns[dIdx] ? (
                  <div
                    className="mood-dropdown"
                    style={{
                      position: "absolute",
                      top: "0em",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#2d2b33ff",
                      border: "1px solid #6C5DD0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      display: "flex",

                      gap: "0.3em",
                      padding: "0.1em 0.4em",
                      zIndex: 10,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((mood) => (
                      <span
                        key={mood}
                        style={{
                          fontSize: "1.5em",
                          cursor: "pointer",
                          transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.transform =
                            "scale(1.2)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.transform =
                            "scale(1)";
                        }}
                        onClick={() => {
                          setMood(currentMonth, dIdx, mood);
                          setShowMoodDropdown((prev) =>
                            prev.map((_, idx) => (idx === dIdx ? false : _))
                          );
                        }}
                      >
                        {getMoodEmoji(mood)}
                      </span>
                    ))}
                  </div>
                ) : months[currentMonth].Mood[dIdx] === 0 ? (
                  <button
                    className="mood-arrow-btn"
                    onClick={() => handleMoodButtonClick(dIdx)}
                  >
                    ▼
                  </button>
                ) : (
                  <span
                    style={{ fontSize: "1.5em", cursor: "pointer" }}
                    onClick={() => handleMoodButtonClick(dIdx)}
                  >
                    {getMoodEmoji(months[currentMonth].Mood[dIdx])}
                  </span>
                )}
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
