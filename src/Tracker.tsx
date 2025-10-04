import { useState } from "react";

type Habit = {
  name: string;
  checks: boolean[];
};
function Tracker({ name, checks }: Habit) {
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
            <th>{name}</th>
            {days.map((day) => (
              <td key={day}>
                <input type="checkbox" checked={checks[day - 1]}></input>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Tracker;
