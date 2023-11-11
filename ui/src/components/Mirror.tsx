import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/lib/consts";
import { Game } from "./Game";

interface IMirror {
  id: string;
  game: Game;
}

const Mirror: React.FC<IMirror> = ({ id, game }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LIGHT,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end(draggedItem, monitor) {
      console.log("drag", draggedItem, monitor);

      game.movableItems.filter((item) => {
        return item.id != id;
      });
    },
  }));

  return (
    <div
      id={id}
      ref={drag}
      className={` flex items-center justify-center w-full h-full  font-bold text-xl ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{
        cursor: "move",
        width: 60,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      ♘
    </div>
  );
};
export default Mirror;

// import React from "react";
// import { useDrag } from "react-dnd";
// import { ItemTypes } from "@/lib/consts";

// interface IMirror {
//   id: string;
// }

// const Mirror: React.FC<IMirror> = ({ id }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.LIGHT,
//     item: { id },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`flex items-center justify-center w-full h-full font-bold text-xl ${
//         isDragging ? "opacity-50" : "opacity-100"
//       }`}
//       style={{
//         cursor: "move",
//         width: 60,
//         height: 60,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       ♘
//     </div>
//   );
// };

// export default Mirror;
