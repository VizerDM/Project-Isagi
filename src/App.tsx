import Tracker from "./Tracker";
import { useState } from "react";

function App() {
  const [checks, SetChecks] = useState<boolean[]>(Array(30).fill(false));

  return <Tracker name="GYM" checks={checks} />;
}

export default App;
