import { EXAMPLE_MAP, TileType } from "@/lib/maps";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMouse } from "react-use";
// import { useMouse } from "@uidotdev/usehooks";
import { main } from "@/lib/board_generator";
import Inventory from "./Inventory";
interface Point {
  x: number;
  y: number;
}

interface LightData {
  ins: number[][];
  outs: number[][];
}
type SendTransactionResult = {
  hash: string;
};

interface ProviderError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface SendTransactionArgs {
  readonly transaction: string | object;
  readonly feePayer?: {
    readonly fee?: number;
    readonly memo?: string;
  };
}

interface IGrid {
  mina: any;
}

export interface InventoryItem {
  id: number;
  type: TileType;
}

const TILE_WIDTH = 200;
const TILE_HEIGHT = 200;

const SmallGrid: React.FC<IGrid> = ({ mina }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([
    {
      id: 0,
      type: TileType.Mirror,
    },
    {
      id: 1,
      type: TileType.Mirror,
    },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [lightPosition, setLightPosition] = useState({ row: 5, col: 20 });
  const [map, setMap] = useState<TileType[]>(EXAMPLE_MAP);
  const [tilePoints, setTilePoints] = useState<{ [key: string]: Point[] }>({});
  const { docX, docY, posY, posX } = useMouse(lightCanvasRef);
  const [lightData, setLightData] = useState<LightData>();
  const [boxSelection, setBoxSelection] = useState({ x: 0, y: 0 });
  // console.log("doc", docX, docY);
  // console.log("pos", posX, posY);

  // const handleCanvasClick = () => {
  //   console.log("clicked");

  //   if (selectedItem) {
  //     console.log("clicked2");

  //     // Place the mirror on the grid
  //     const newMap = [...map];
  //     const index = lightPosition.row * 10 + lightPosition.col;
  //     console.log("🚀 ~ file: Grid.tsx:49 ~ handleCanvasClick ~ index:", index);
  //     newMap[index] = TileType.Mirror;
  //     setMap(newMap);

  //     // Remove the item from the inventory
  //     const updatedInventory = inventoryList.filter(
  //       (i) => i.id !== selectedItem.id
  //     );
  //     setInventoryList(updatedInventory);

  //     // Clear the selected item
  //     setSelectedItem(null);
  //   }
  // };

  const calculateTilePoints = useCallback((col: number, row: number) => {
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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const lightCanvas = lightCanvasRef.current;

    if (canvas && lightCanvas) {
      const ctx = canvas.getContext("2d");
      const lightCtx = lightCanvas.getContext("2d");

      const draw = () => {
        drawMap();
        // propagateLight(lightCtx!, 0); // Example: Light source at the center of the grid
        requestAnimationFrame(draw);
      };
      const propagateLight = (
        context: CanvasRenderingContext2D,
        lightDirection: number
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
          // console.log(
          //   "🚀 ~ file: Grid.tsx:58 ~ useEffect ~ startingPoint:",
          //   startingPoint
          // );
          let row = startingPoint.y / TILE_HEIGHT;
          let col = startingPoint.x / TILE_WIDTH;

          context.beginPath();
          context.moveTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);

          while (row >= 0 && row < 3 && col >= 0 && col < 3) {
            row += Math.sin(angle); // Update using sin
            col += Math.cos(angle); // Update using cos

            const arrayIndex = Math.floor(row) * 10 + Math.floor(col);

            if (map[arrayIndex] === TileType.Wall) {
              break;
            }

            // Convert row and col back to pixel coordinates
            const x = row;
            const y = col;

            context.lineTo(x, y);
          }

          context.stroke();
        };

        // Draw light source
        // const sourceX = TILE_WIDTH * (sourceCol + 0.5);
        // const sourceY = TILE_HEIGHT * (sourceRow + 0.5);
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

        // const tilePointsData = calculateTilePoints()
        // tilePoints.map((point) => {
        //   ctx!.strokeStyle = "red"; // Change color as needed
        //   ctx?.strokeRect(point.x - 2, point.y - 2, 4, 4); // Adjust size as needed
        // });

        // console.log("tile", tilePoints);

        if (lightData) {
          lightData!.ins.forEach((lightArray, index) => {
            const rowIndex = Math.floor(index / 3);
            // console.log(
            //   "🚀 ~ file: SmallGrid.tsx:192 ~ lightData!.ins.forEach ~ rowIndex:",
            //   rowIndex
            // );
            const columnIndex = Math.floor(index % 3);

            // lightData!.outs.forEach((lightArray, rowIndex) => {
            //   lightArray.forEach((lightValue, colIndex) => {
            //     if (lightValue === 1) {
            //       // If there is light, draw a ray
            //       const startPoint = {
            //         x: tilePoints[rowIndex][colIndex].x,
            //         y: tilePoints[rowIndex][colIndex].y,
            //       };
            //       const angle = lightDirection;
            //       drawRay(angle, startPoint);
            //     }
            //   });
            // });

            // Draw the light ray

            // drawRay(angle, startPoint);
          });
        }
      };
      const neighborConnectionMap: { [key: number]: number[] } = {
        0: [-1, -1],
        1: [0, -1],
        2: [1, -1],
        3: [1, 0],
        4: [1, 1],
        5: [0, 1],
        6: [-1, 1],
        7: [-1, 0],
      };
      // const neighborConnectionMap: { [key: number]: number[] } = {
      //   0: [-1, 1],
      //   1: [0, 1],
      //   2: [1, 1],
      //   3: [1, 0],
      //   4: [1, -1],
      //   5: [0, -1],
      //   6: [-1, -1],
      //   7: [-1, 0],
      // };

      const drawMap = () => {
        for (let eachRow = 0; eachRow < 3; eachRow++) {
          for (let eachCol = 0; eachCol < 3; eachCol++) {
            let arrayIndex = eachRow * 3 + eachCol;
            if (lightData) {
              const boxLight = lightData!.ins[eachRow * 3 + eachCol];
              console.log(
                "🚀 ~ file: SmallGrid.tsx:235 ~ drawMap ~ boxLight:",
                eachRow,
                eachCol,
                boxLight
              );
              const boxLightOuts = lightData!.outs[eachRow * 3 + eachCol];
              console.log(
                "🚀 ~ file: SmallGrid.tsx:242 ~ drawMap ~ boxLightOuts:",
                eachRow,
                eachCol,
                boxLightOuts
              );
              // console.log(
              //   "🚀 ~ file: SmallGrid.tsx:224 ~ drawMap ~ boxLight:",
              //   boxLight
              // );
              const centerX = TILE_WIDTH * eachCol + TILE_WIDTH / 2;
              const centerY = TILE_HEIGHT * eachRow + TILE_HEIGHT / 2;
              for (let i = 0; i < 8; i++) {
                if (boxLight[i] === 1 || boxLightOuts[i] === 1) {
                  const coordinate = neighborConnectionMap[i];
                  console.log(
                    "🚀 ~ file: SmallGrid.tsx:246 ~ drawMap ~ coordinate:",
                    coordinate
                  );
                  const newX = centerX + (coordinate[0] * TILE_WIDTH) / 2;
                  const newY = centerY + (coordinate[1] * TILE_HEIGHT) / 2;

                  lightCtx!.fillStyle = "yellow";
                  lightCtx!.beginPath();
                  lightCtx!.arc(
                    300,
                    300,
                    10, // Adjust the size of the light source
                    0,
                    2 * Math.PI
                  );
                  lightCtx!.fill();
                  lightCtx!.strokeStyle = "yellow";
                  lightCtx!.lineWidth = 2;
                  lightCtx!.beginPath();
                  lightCtx!.moveTo(centerX, centerY);
                  // lightCtx!.strokeStyle = "yellow";
                  lightCtx?.lineTo(newX, newY);
                  lightCtx?.stroke();
                  console.log("data center ", centerX, centerY, i);
                  console.log("data new ", newX, newY, i);

                  // lightCtx.
                }
              }
            }
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
                // image.src = "/assets/mirror.jpg";
                // image.onload = () => {
                //   console.log("image", image);

                //   ctx!.drawImage(image, 6, 8, 20, 20);
                // };
                // ctx!.strokeRect(14, 8, 5, 5);
                break;
              case TileType.Bomb:
                ctx!.fillStyle = "purple";
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
  }, [map, lightData]);

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.MIRROR,
  //   item: { id, type: ItemTypes.MIRROR },
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // });

  // const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: any) => {
    // 👇️ Get the mouse position relative to the element
    // setLocalCoords({
    //   x: event.clientX - event.target.offsetLeft,
    //   y: event.clientY - event.target.offsetTop,
    // });

    const rect = event.target.getBoundingClientRect();
    const xPercentage = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercentage = ((event.clientY - rect.top) / rect.height) * 100;

    const gridRow = Math.floor((yPercentage / 100) * 3);
    const gridCol = Math.floor((xPercentage / 100) * 3);

    setBoxSelection({
      x: gridCol,
      y: gridRow,
    });
  }, []);
  // console.log("list", inventoryList);

  // const handleCanvasClick = () => {
  //   const { x, y } = boxSelection;
  //   const index = y * 10 + x;

  //   if (index >= 0 && index < map.length) {
  //     const newMap = JSON.parse(JSON.stringify(map));

  //     if (selectedItem && selectedItem.type === TileType.Mirror) {
  //       if (newMap[index] === TileType.Mirror) {
  //         // If the cell contains a mirror, remove it
  //         newMap[index] = TileType.Empty;

  //         // If there are mirrors left in the inventory, add the removed mirror back to the inventory
  //         if (inventoryList.some((item) => item.type === TileType.Mirror)) {
  //           setInventoryList((prevInventory) => [
  //             ...prevInventory,
  //             { id: selectedItem.id, type: TileType.Mirror },
  //           ]);
  //         }

  //         // Update the map state
  //         setMap(newMap);

  //         // Clear the selected item
  //         setSelectedItem(null);
  //       } else if (
  //         newMap[index] !== TileType.Wall &&
  //         newMap[index] !== TileType.Bomb &&
  //         newMap[index] !== TileType.Light
  //       ) {
  //         // If a mirror is selected and the clicked tile is empty, handle placement
  //         // Remove the mirror from its previous position in the inventory
  //         const prevIndex = inventoryList.findIndex(
  //           (item) => item.type === TileType.Mirror
  //         );

  //         if (prevIndex !== -1) {
  //           setInventoryList((prevInventory) =>
  //             prevInventory.filter((item, i) => i !== prevIndex)
  //           );
  //         }

  //         // Place the mirror on the grid
  //         newMap[index] = TileType.Mirror;

  //         // Update the map state
  //         setMap(newMap);

  //         // Clear the selected item
  //         setSelectedItem(null);
  //       }
  //     } else if (newMap[index] === TileType.Mirror) {
  //       // If no item is selected and the clicked position contains a mirror,
  //       // set it as the selected item
  //       setSelectedItem({ id: newMap[index].id, type: TileType.Mirror });
  //     } else if (
  //       newMap[index] !== TileType.Wall &&
  //       newMap[index] !== TileType.Bomb &&
  //       newMap[index] !== TileType.Light
  //     ) {
  //       // If no item is selected and the clicked tile is empty, and there are mirrors
  //       // left in the inventory, set it as the selected item
  //       if (inventoryList.some((item) => item.type === TileType.Mirror)) {
  //         setSelectedItem({ id: newMap[index].id, type: TileType.Mirror });
  //       }
  //     }
  //   }
  // };

  const handleCanvasClick = () => {
    const { x, y } = boxSelection;
    const index = y * 10 + x;

    if (index >= 0 && index < map.length) {
      const newMap = JSON.parse(JSON.stringify(map));

      if (selectedItem && selectedItem.type === TileType.Mirror) {
        // If an item is already selected, handle placement/removal logic
        if (newMap[index] === TileType.Mirror) {
          // If the cell contains a mirror, remove it
          newMap[index] = TileType.Empty;

          // Remove the item from the inventory
          setInventoryList((prevInventory) => [
            ...prevInventory,
            { id: selectedItem.id, type: TileType.Mirror },
          ]);

          // Update the map state
          setMap(newMap);

          // Clear the selected item
          setSelectedItem(null);
        } else if (
          newMap[index] !== TileType.Wall &&
          newMap[index] !== TileType.Bomb &&
          newMap[index] !== TileType.Light
        ) {
          // Remove the mirror from its previous position in the inventory
          const prevIndex = inventoryList.findIndex(
            (item) => item.type === TileType.Mirror
          );

          if (prevIndex !== -1) {
            setInventoryList((prevInventory) =>
              prevInventory.filter((item, i) => i !== prevIndex)
            );
          }

          // Place the mirror on the grid if the cell is empty and not a wall, bomb, or source
          newMap[index] = TileType.Mirror;

          // Update the map state
          setMap(newMap);

          // Clear the selected item
          setSelectedItem(null);
        }
      } else if (newMap[index] === TileType.Mirror) {
        // If no item is selected and the clicked position contains a mirror, set it as the selected item
        setSelectedItem({ id: 0, type: TileType.Mirror }); // Update with the correct ID
      }
    }
  };
  useEffect(() => {
    const lightArrays = main();
    console.log(
      "🚀 ~ file: SmallGrid.tsx:406 ~ useEffect ~ lightData:",
      lightArrays
    );
    setLightData(lightArrays);
  }, []);

  const proveSolution = async () => {
    try {
      // const updateResult: SendTransactionResult | ProviderError =
      //   await mina!.sendTransaction({
      //     transaction: transactionJSON, // this is zk commond, create by zkApp.
      //   });
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("local", boxSelection);

  return (
    <section className=" h-full  w-screen flex items-center justify-center">
      {/* <div className="w-48 h-48 bg-green-400"></div> */}
      <Inventory
        // onInventoryClick={handleInventoryItemClick}
        setSelectedItem={setSelectedItem}
        inventoryList={inventoryList}
      />
      <div className="relative w-fit">
        <canvas ref={canvasRef} width={600} height={600}></canvas>
        {/* <BoardSquare game={game} x={50} y={50}> */}
        {/* <Mirror /> */}
        {/* </BoardSquare> */}
        <canvas
          ref={lightCanvasRef}
          width={600}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          height={600}
          className="absolute cursor-pointer left-auto top-0"
        ></canvas>
        {/* <h1 className="text-4xl">Hey</h1> */}
      </div>
      <div className="relative left-16 flex w-96 flex-col  space-y-4 items-center justify-center h-full">
        <button className="w-full hover:scale-105 transition duration-200 text-2xl  rounded-xl font-bold tracking-tighter bg-purple-800 text-white py-2.5">
          Start Game
        </button>
        <button
          onClick={proveSolution}
          className="w-full text-2xl hover:scale-105 transition duration-200   rounded-xl font-bold tracking-tighter bg-purple-800 text-white py-2.5"
        >
          Submit Game
        </button>
        <button className="w-full hover:scale-105 transition duration-200 text-2xl  rounded-xl font-bold tracking-tighter bg-purple-800 text-white py-2.5">
          Restart Game
        </button>
      </div>
      {/* <Mirror /> */}
    </section>
  );
};

export default SmallGrid;

// casetoprovable inventory elimdeki itemlerin listesi
// board item ve item dir
// solution item ve itemdir

// itemList [{item: ITEM.MIRROR, itemDir: DIR_TOP },{item: ITEM.MIRROR, itemDir: DIR_TOP }] }

// ITEM = [MIRROR,MIRROR],
// Solution [{item: ITEM.MIRROR, itemDir: DIR_BOTTOM_RIGHT},{item: ITEM.MIRROR, itemDir: DIR_BOTTOM_LEFT}]
