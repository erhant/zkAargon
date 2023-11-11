import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import { MAP_ONE } from "@/lib/maps";

interface IGrid {}

const TILE_WIDTH = 60;
const TILE_HEIGHT = 60;

const Grid: React.FC<IGrid> = ({}) => {
  useEffect(() => {
    // PixiJS setup
    const app = new PIXI.Application({
      width: 600,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    // document.body.appendChild(app!.view);

    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Create your grid based on your map data

    for (let eachRow = 0; eachRow < 10; eachRow++) {
      for (let eachCol = 0; eachCol < 10; eachCol++) {
        const arrayIndex = eachRow * 10 + eachCol;

        const tile = new PIXI.Graphics();
        tile.beginFill(getTileColor(MAP_ONE[arrayIndex]));
        tile.drawRect(
          TILE_WIDTH * eachCol,
          TILE_HEIGHT * eachRow,
          TILE_WIDTH,
          TILE_HEIGHT
        );
        tile.endFill();
        container.addChild(tile);
      }
    }

    // Add interactive elements, event listeners, etc.

    // Render loop
    app.ticker.add(() => {
      // Update game state, handle animations, etc.
    });
  }, []);

  const getTileColor = (tileType: number) => {
    // Implement your logic to determine the color based on the tile type
    switch (tileType) {
      case 0:
        return 0x000000; // Black for empty
      case 1:
        return 0xc0c0c0; // Light gray for walls
      // Add more cases for other tile types
      default:
        return 0x000000; // Default to black for unknown types
    }
  };

  return <div id="pixi-container"></div>;
};

export default Grid;
