import { EXAMPLE_MAP, TileType } from "@/lib/maps";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMouse } from "react-use";
// import { useMouse } from "@uidotdev/usehooks";
import { main } from "@/lib/board_generator";
import GameControls from "./GameControls";
import Inventory from "./Inventory";
interface Point {
  x: number;
  y: number;
}

interface IGrid {}

export interface InventoryItem {
  id: number;
  type: TileType;
}

const TILE_WIDTH = 200;
const TILE_HEIGHT = 200;

const SmallGrid: React.FC<IGrid> = ({}) => {
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
    {
      id: 2,
      type: TileType.Mirror,
    },
    {
      id: 3,
      type: TileType.Mirror,
    },
    {
      id: 4,
      type: TileType.Mirror,
    },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef(null);
  const lightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [lightPosition, setLightPosition] = useState({ row: 5, col: 20 });
  const [map, setMap] = useState<TileType[]>(EXAMPLE_MAP);
  const [tilePoints, setTilePoints] = useState<{ [key: string]: Point[] }>({});
  const { docX, docY, posY, posX } = useMouse(lightCanvasRef);

  // console.log("doc", docX, docY);
  console.log("pos", posX, posY);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const lightCanvas = lightCanvasRef.current;

    if (canvas && lightCanvas) {
      const ctx = canvas.getContext("2d");
      const lightCtx = lightCanvas.getContext("2d");

      const draw = () => {
        drawMap();
        propagateLight(lightCtx!, 0); // Example: Light source at the center of the grid
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

        const drawLightRay = () => {
          context.beginPath();
          const sourceX = TILE_WIDTH * (sourceCol + 0.5);
          console.log(
            "🚀 ~ file: SmallGrid.tsx:107 ~ drawLightRay ~ sourceX:",
            sourceX
          );
          const sourceY = TILE_HEIGHT * (sourceRow + 0.5);
          context.moveTo(sourceX, sourceY); // Move to the center of the source tile

          let row = sourceRow;
          let col = sourceCol;

          while (row >= 0 && row < 3 && col >= 0 && col < 3) {
            row += Math.sin(lightDirection);
            col += Math.cos(lightDirection);

            const x = TILE_WIDTH * (col + 0.5);
            const y = TILE_HEIGHT * (row + 0.5);
            context.lineTo(x, y);
          }

          context.stroke();
        };

        // Draw light source
        const sourceX = TILE_WIDTH * (sourceCol + 0.5);
        const sourceY = TILE_HEIGHT * (sourceRow + 0.5);
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(
          sourceX,
          sourceY,
          10, // Adjust the size of the light source
          0,
          2 * Math.PI
        );
        context.fill();

        // Draw the light ray
        drawLightRay();
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
        for (let eachRow = 0; eachRow < 3; eachRow++) {
          for (let eachCol = 0; eachCol < 3; eachCol++) {
            let arrayIndex = eachRow * 3 + eachCol;

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
  }, [map]);

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.MIRROR,
  //   item: { id, type: ItemTypes.MIRROR },
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // });

  // const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [boxSelection, setBoxSelection] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: any) => {
    // 👇️ Get the mouse position relative to the element
    // setLocalCoords({
    //   x: event.clientX - event.target.offsetLeft,
    //   y: event.clientY - event.target.offsetTop,
    // });

    const rect = event.target.getBoundingClientRect();
    const xPercentage = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercentage = ((event.clientY - rect.top) / rect.height) * 100;

    const gridRow = Math.floor((yPercentage / 100) * 10);
    const gridCol = Math.floor((xPercentage / 100) * 10);

    setBoxSelection({
      x: gridCol,
      y: gridRow,
    });
  }, []);
  console.log("list", inventoryList);

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
    main();
  }, []);

  console.log("local", boxSelection);

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
          // style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        ></canvas>
        {/* <h1 className="text-4xl">Hey</h1> */}
      </div>
      <GameControls />
      {/* <Mirror /> */}
    </section>
  );
};

export default SmallGrid;
