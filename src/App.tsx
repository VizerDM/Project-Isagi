import Tracker from "./Tracker";

function App() {
  const checks = Array.from({ length: 30 }, (_, i) =>
    i % 2 === 0 ? true : false
  );
  return <Tracker name="GYM" checks={checks} />;
}

export default App;
