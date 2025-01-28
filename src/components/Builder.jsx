import React, { useState } from "react";
import SectionWrapper from "./SectionWrapper";
import { SCHEMES, WORKOUTS } from "../utils/swoldier";
import Button from "./Button";

function Header(props) {
  const { index, title, descrption } = props;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-400">
          {index}
        </p>
        <h4 className="text-xl sm:text-2xl md:text-3xl ">{title}</h4>
      </div>
      <p className="text-sm sm:text-base mx-auto">{descrption}</p>
    </div>
  );
}

const Builder = (props) => {
  const{muscle,setMuscle,poison,setPoison,goal,setGoal,updateWorkout}=props
  const [showmodal, setShowModal] = useState(false);
  

  function toggleModal() {
    setShowModal(!showmodal);
  }

  function updateMuscle(muscleGroup) {
    setMuscle((prevMuscle) => {
      if (prevMuscle.includes(muscleGroup)) {
        return prevMuscle.filter((val) => val !== muscleGroup);
      } else {
        return [...prevMuscle, muscleGroup];
      }
    });
    if (muscle.length === 2) {
      setShowModal(false);
    }
    if (muscle.length > 2) {
      return;
    }

    if (poison !== "individual") {
      setMuscle([muscleGroup]);
      setShowModal(false);
      return;
    }
  }

  return (
    <div>
      <SectionWrapper id={'generate'}
        header={"generate your workout"}
        title={["It's", "Huge", "o'clock"]}
      >
        <Header
          index={"01"}
          title={"Pick Your Poison"}
          descrption={"Select The WorkOut You Wish"}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(WORKOUTS).map((type, index) => (
            <button
              onClick={() => {
                setMuscle([]);
                setPoison(type);
              }}
              className={`bg-slate-950 border px-4 py-3 duration-200 rounded-lg ${
                type === poison ? "border-blue-600" : "border-blue-400"
              } hover:border-blue-600`}
              key={index}
            >
              <p className="capitalize">{type.replaceAll("_", " ")}</p>
            </button>
          ))}
        </div>

        <Header
          index={"02"}
          title={"Locks On Target"}
          descrption={"Select The Muscle Workout And Enjoy Pain"}
        />
        <div className="bg-slate-950 border border-solid border-blue-400 rounded-lg flex flex-col">
          <button
            onClick={toggleModal}
            className="relative p-3 flex items-center justify-center"
          >
            <p className="capitalize">
              {muscle.length == 0 ? "Select Muscle Group" : muscle.join(" ")}
            </p>
            <i className="fa-solid absolute right-3 top-1/2 -translate-y-1/2 fa-caret-down"></i>
          </button>
          {showmodal && (
            <div className="flex flex-col px-3 pb-3">
              {(poison === "individual"
                ? WORKOUTS[poison]
                : Object.keys(WORKOUTS[poison])
              ).map((muscleGroup, muscleGroupIndex) => {
                return (
                  <button
                    onClick={() => {
                      updateMuscle(muscleGroup);
                    }}
                    key={muscleGroupIndex}
                    className={
                      "hover:text-blue-400 duration-200" +
                      (muscle.includes(muscleGroup) ? " text-blue-400" : "")
                    }
                  >
                    <p className="uppercase">{muscleGroup}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <Header
          index={"03"}
          title={"Become JuggerNaut"}
          descrption={"Select your ultimate objective."}
        />
        <div className="grid grid-cols-3  gap-4">
          {Object.keys(SCHEMES).map((schemes, schemesIndex) => {
            return (
              <button
                onClick={() => {
                  setGoal(schemes);
                }}
                className={`bg-slate-950 border py-3 px-4 duration-200 rounded-lg ${
                  schemes === goal ? "border-blue-600" : "border-blue-400"
                } hover:border-blue-600`}
                key={schemesIndex}
              >
                <p className="capitalize">{schemes.replaceAll("_", " ")}</p>
              </button>
            );
          })}
        </div>
        <div className="flex justify-center mt-6">
        <Button func={updateWorkout} text={"Formulate"}/>
        </div>
        
      </SectionWrapper>
    </div>
  );
};

export default Builder;
