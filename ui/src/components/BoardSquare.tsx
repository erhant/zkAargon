// import type { FC, ReactNode } from "react";
// import { useDrop } from "react-dnd";

// import { Game } from "./Game";
// import { ItemTypes } from "@/lib/consts";
// import { Square } from "./Square";

// export interface BoardSquareProps {
//   x: number;
//   y: number;
//   children?: ReactNode;
//   game: Game;
// }

// export const BoardSquare: FC<BoardSquareProps> = ({
//   x,
//   y,
//   children,
//   game,
// }: BoardSquareProps) => {
//   const [{ isOver, canDrop }, drop] = useDrop(
//     () => ({
//       accept: ItemTypes.LIGHT,
//       drop: () => game.moveKnight(x, y),
//       //   canDrop: () => game.canMoveKnight(x, y),
//       collect: (monitor) => ({
//         isOver: !!monitor.isOver(),
//         canDrop: !!monitor.canDrop(),
//       }),
//     }),
//     [x, y]
//   );

//   return (
//     <div
//       ref={drop}
//       role="Space"
//       data-testid={`(${x},${y})`}
//       className="relative 64 h-64"
//     >
//       <Square>{children}</Square>
//       {/* {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
//       {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
//       {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />} */}
//     </div>
//   );
// };

import React, { ReactNode, useEffect } from "react";
import { Square } from "./Square";
import { Game } from "./Game";
// import { ItemTypes } from './Constants'
import { ItemTypes } from "@/lib/consts";
import { useDrop } from "react-dnd";

export interface BoardSquareProps {
  x: number;
  y: number;
  children?: ReactNode;
  game: Game;
  id: number;
}

export const BoardSquare: React.FC<BoardSquareProps> = ({
  x,
  y,
  game,
  children,
  id,
}) => {
  console.log("x,y", x, y);

  const black = (x + y) % 2 === 1;
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.LIGHT || ItemTypes.MIRROR,
      drop: () => {
        console.log("drop", x, y);

        game.moveMovableItem(id, x, y);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [x, y]
  );
  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "60px",
        height: "60px",
      }}
    >
      <Square black={black}>{children}</Square>
      {isOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            // height: "100%",
            // width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )}
      {/* {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
//       {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
//       {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />} */}
    </div>
  );
};
