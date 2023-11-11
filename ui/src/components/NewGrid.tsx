import React, { useState, useMemo, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "@/lib/consts";
import { Game, Position, MovableItem } from "./Game";
import { BoardSquare } from "./BoardSquare";
import { Square } from "./Square";
import Mirror from "./Mirror";

interface GridProps {}

const Grid: React.FC<GridProps> = () => {
  const game = useMemo(() => new Game(), []);
  const [movableItemPositions, setMovableItemPositions] = useState<Position[]>(
    []
  );

  useEffect(() => {
    const unsubscribe = game.observe(setMovableItemPositions);
    return () => unsubscribe();
  }, [game]);

  const renderSquare = (x: number, y: number) => {
    const isKnightHere = movableItemPositions.some(
      ([itemX, itemY]) => itemX === x && itemY === y
    );
    return (
      <BoardSquare key={`${x}-${y}`} x={x} y={y} game={game}>
        <Square black={!isKnightHere}>
          {/* {isKnightHere && <Mirror x={x} y={y} game={game} />} */}
          {/* {isKnightHere && <Mirror />} */}
          {/* {isKnightHere && <Mirror id={index.toString()}/>} */}
        </Square>
      </BoardSquare>
    );
  };

  const renderInventorySquare = (index: number) => {
    const movableItem = game.movableItems[index];
    return (
      <div key={`inventory-${index}`} className="w-full h-full">
        {movableItem && (
          //   <Mirror
          //     x={movableItem.position[0]}
          //     y={movableItem.position[1]}
          //     game={game}
          //   />
          <Mirror id={index.toString()} />
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-96 h-96 grid-cols-10">
        <section className="flex gap-4">
          <div
            className="hover:z-20"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              width: "120px",
              height: "120px",
            }}
          >
            {game.movableItems.map((_, index) => renderInventorySquare(index))}
          </div>
          <div
            className="hover:z-20"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
              width: "600px",
              height: "600px",
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const x = i % 10;
              const y = Math.floor(i / 10);
              return renderSquare(x, y);
            })}
          </div>
        </section>
      </div>
    </DndProvider>
  );
};

export default Grid;
