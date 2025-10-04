import { useState } from "react";

type Habit = {
  name: string;
  checks: boolean[];
};
const [habits, SetHabits] = useState<Habit[]>([
  { name: "GYM", checks: Array(30).fill(false) },
]);

const [checks, SetChecks] = useState<boolean[]>(Array(30).fill(false));

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
