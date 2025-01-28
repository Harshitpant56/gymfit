import { useState } from "react";
import Builder from "./components/Builder";
import Gym from "./components/Gym";
import Workout from "./components/Workout";
import { GenerateWorkout } from "./utils/funtion";

function App() {
  const [workout, setWorkout] = useState(null);
  const [poison, setPoison] = useState("individual");
  const [muscle, setMuscle] = useState([]);
  const [goal, setGoal] = useState("strength_power");

  function updateWorkout() {
    if (muscle.length < 1) {
      return;
    }
    console.log('debug up', poison, muscle, goal)
    let newWorkout = GenerateWorkout({ poison, muscle, goal });
    setWorkout(newWorkout);
    console.log('new worksout', newWorkout)
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-r from-slate-800 to-slate-950 text-white text-sm sm:text-base">
      <Gym />
      <Builder
        poison={poison}
        setPoison={setPoison}
        muscle={muscle}
        setMuscle={setMuscle}
        goal={goal}
        setGoal={setGoal}
        updateWorkout={updateWorkout}
      />
      {workout && <Workout workout={workout} />}
    </main>
  );
}

export default App;
