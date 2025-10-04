import { useState } from "react";

type Habit = {
  name: string;
  checks: boolean[];
};
const [habits, SetHabits] = useState<Habit[]>([
  { name: "GYM", checks: Array(30).fill(false) },
]);

const onCheck = (habitIndex: number, dayIndex: number): void => {
  // handler for when a checkbox is ticked/unticked

  SetHabits(
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

function Tracker() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Days / Habits</th>
            {days.map((day) => {
              return <th key={day}>{day}</th>;
            })}
          </tr>
          <tr>
            <th>{habits[0].name}</th>
            {days.map((day) => (
              <td key={day}>
                <input
                  type="checkbox"
                  checked={habits[0].checks[day - 1]}
                  onchange={onCheck(day, 0)}
                ></input>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Tracker;
