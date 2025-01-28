import React from "react";
import Button from "./Button";

const Gym = () => {
  return (
    <div className="min-h-screen flex flex-col gap-10 items-center justify-center text-center max-w-[800px] w-full mx-auto p-4">
      <div className="flex flex-col gap-4">
        <p className="font-medium">IT'S TIME FOR WORKOUT</p>
        <h1 className="uppercase font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          GYM <span className="text-blue-400">FIT</span>
        </h1>
      </div>
      <p className="text-sm md:text-base font-light">
        I hereby acknowledgement that I may become
        <span className="text-blue-400 font-medium">
          {" "}
          unbelievably swolenormous
        </span>{" "}
        and accept all risks of becoming the local
        <span className="text-blue-400 font-medium"> mass montrosity</span>,
        afflicted with severe body dismorphia, unable to fit through doors.
      </p>
      <Button func={()=>{
        window.location.href='#generate'
      }} text={"Accept & Begin"}/> 
    </div>
  );
};

export default Gym;
