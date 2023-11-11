import { TileType } from "@/lib/maps";
import type { FC, ReactNode } from "react";
import Mirror from "./Mirror";

export interface SquareProps {
  children?: ReactNode;
  black: boolean;
}

export const Square: FC<SquareProps> = ({ black, children }) => {
  const backgroundColor = black ? "black" : "white";
  const color = black ? "white" : "black";
  let GridComponent: JSX.Element | null = null;

  switch (children) {
    case TileType.Empty:
      // ctx!.fillStyle = "black";
      //   return (
      //     <div
      //       style={{
      //         color,
      //         backgroundColor,
      //       }}
      //       className={` h-full w-full`}
      //     >
      //       {children}
      //     </div>
      //   );
      //   GridComponent = <Mirror />;
      break;
    case TileType.Wall:
      // ctx!.fillStyle = "lightgray";
      break;
    case TileType.Mirror:
    // ctx!.fillStyle = "blue";
  }

  return (
    <div
      style={{
        color,
        backgroundColor,
      }}
      className={` h-full w-full`}
    >
      {children}
    </div>
  );
};
