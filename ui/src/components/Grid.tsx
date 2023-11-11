import React, { useState, useRef, useEffect, useMemo } from "react";
import { MAP_ONE, TileType } from "@/lib/maps";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "@/lib/consts";
import Mirror from "./Mirror";
import { BoardSquare } from "./BoardSquare";
import { Game, Position } from "./Game";
import { Square } from "./Square";
interface Point {
  x: number;
  y: number;
}

const gridStyle = {};

interface IGrid {}

const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;

const Grid: React.FC<IGrid> = ({}) => {
  const [inventoryList, setInventoryList] = useState([
    {
      type: TileType.Mirror,
    },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [lightPosition, setLightPosition] = useState({ row: 5, col: 20 });
  const [map, setMap] = useState<TileType[]>(MAP_ONE);
  const [tilePoints, setTilePoints] = useState<{ [key: string]: Point[] }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const lightCanvas = lightCanvasRef.current;

    if (canvas && lightCanvas) {
      const ctx = canvas.getContext("2d");
      const lightCtx = lightCanvas.getContext("2d");

      const draw = () => {
        drawMap();
        propagateLight(lightCtx!, 5); // Example: Light source at the center of the grid
        requestAnimationFrame(draw);
      };

      const propagateLight = (
        context: CanvasRenderingContext2D,
        // sourceRow: number,
        // sourceCol: number,
        lightDirection: number // Angle in radians (0 to 2π)
      ) => {
        const sourceRow = lightPosition.row;
        const sourceCol = lightPosition.col;
        context.clearRect(0, 0, lightCanvas.width, lightCanvas.height);
        context.strokeStyle = "yellow";
        context.lineWidth = 2;
        const drawRay = (
          angle: number,
          startingPoint: { x: number; y: number }
        ) => {
          console.log(
            "🚀 ~ file: Grid.tsx:58 ~ useEffect ~ startingPoint:",
            startingPoint
          );
          let row = startingPoint.y / TILE_HEIGHT;
          let col = startingPoint.x / TILE_WIDTH;

          context.beginPath();
          context.moveTo(
            TILE_WIDTH * col + TILE_WIDTH / 2,
            TILE_HEIGHT * row + TILE_HEIGHT / 2
          );

          while (row >= 0 && row < 10 && col >= 0 && col < 10) {
            row += Math.sin(angle); // Update using sin
            col += Math.cos(angle); // Update using cos

            const arrayIndex = Math.floor(row) * 10 + Math.floor(col);

            if (map[arrayIndex] === TileType.Wall) {
              break;
            }

            // Convert row and col back to pixel coordinates
            const x = 300;
            const y = 300;

            context.lineTo(x, y);
          }

          context.stroke();
        };

        // Draw light source
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(
          300,
          300,
          10, // Adjust the size of the light source
          0,
          2 * Math.PI
        );
        context.fill();

        // Draw light ray based on the light direction
        const startPoint = {
          x: 300,
          y: 300,
        };
        const angle = lightDirection;
        drawRay(angle, startPoint);
      };

      const calculateTilePoints = (col: number, row: number) => {
        const points = [];
        const x = col * TILE_WIDTH;
        const y = row * TILE_HEIGHT;
        const halfWidth = TILE_WIDTH / 2;
        const halfHeight = TILE_HEIGHT / 2;

        // Corners
        points.push({ x, y });
        points.push({ x: x + TILE_WIDTH, y });
        points.push({ x, y: y + TILE_HEIGHT });
        points.push({ x: x + TILE_WIDTH, y: y + TILE_HEIGHT });

        // Midpoints of sides
        points.push({ x: x + halfWidth, y });
        points.push({ x: x + TILE_WIDTH, y: y + halfHeight });
        points.push({ x: x + halfWidth, y: y + TILE_HEIGHT });
        points.push({ x, y: y + halfHeight });

        return points;
      };

      const drawMap = () => {
        for (let eachRow = 0; eachRow < 10; eachRow++) {
          for (let eachCol = 0; eachCol < 10; eachCol++) {
            let arrayIndex = eachRow * 10 + eachCol;

            ctx!.strokeStyle = "white";
            ctx?.strokeRect(
              TILE_WIDTH * eachCol,
              TILE_HEIGHT * eachRow,
              TILE_WIDTH,
              TILE_HEIGHT
            );

            switch (map[arrayIndex]) {
              case TileType.Empty:
                ctx!.fillStyle = "black";
                break;
              case TileType.Wall:
                ctx!.fillStyle = "lightgray";
                break;
              case TileType.Mirror:
                ctx!.fillStyle = "blue";
                // const image = new Image();
                // image.src = "/assets/mirror.svg";
                // image.onload = () => {
                //   console.log("image", image);

                //   ctx!.drawImage(image, 6, 8, 20, 20);
                // };
                ctx!.strokeRect(14, 8, 5, 5);
                break;
              default:
                ctx!.fillStyle = "black";
            }
            const points = calculateTilePoints(eachCol, eachRow);
            setTilePoints((prevPoints) => ({
              ...prevPoints,
              [arrayIndex]: points,
            }));
            points.forEach((point) => {
              ctx!.strokeStyle = "red"; // Change color as needed
              ctx?.strokeRect(point.x - 2, point.y - 2, 4, 4); // Adjust size as needed
            });
            ctx?.fillRect(
              TILE_WIDTH * eachCol,
              TILE_HEIGHT * eachRow,
              TILE_WIDTH,
              TILE_HEIGHT
            );
          }
        }
      };

      draw();
    }
  }, [map]);

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.MIRROR,
  //   item: { id, type: ItemTypes.MIRROR },
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // });

  return (
    <div className="w-96 h-96 flex items-center justify-center">
      <div className="w-48 h-48 bg-green-400"></div>
      <canvas ref={canvasRef} width={600} height={600}></canvas>
      {/* <BoardSquare game={game} x={50} y={50}> */}
      {/* <Mirror /> */}
      {/* </BoardSquare> */}
      <canvas
        ref={lightCanvasRef}
        width={600}
        height={600}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      ></canvas>
      {/* <Mirror /> */}
    </div>
  );
};

export default Grid;
