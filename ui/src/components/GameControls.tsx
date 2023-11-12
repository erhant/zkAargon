import React from "react";

interface IGameControls {}

const GameControls: React.FC<IGameControls> = ({}) => {
  return (
    <div className="relative left-16 flex w-96 flex-col  space-y-4 items-center justify-center h-full">
      <button className="w-full hover:scale-105 transition duration-200 text-2xl  rounded-xl font-bold tracking-tighter bg-purple-800 text-white py-2.5">
        Start Game
      </button>
      <button className="w-full text-2xl hover:scale-105 transition duration-200   rounded-xl font-bold tracking-tighter bg-purple-800 text-white py-2.5">
        Submit Game
      </button>
      <button className="w-full hover:scale-105 transition duration-200 text-2xl  rounded-xl font-bold tracking-tighter bg-purple-800 text-white py-2.5">
        Restart Game
      </button>
    </div>
  );
};
export default GameControls;
