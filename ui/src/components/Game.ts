// export type Position = [number, number];
// export type PositionObserver = ((position: Position) => void) | null;

// export class Game {
//   public knightPosition: Position = [4, 1];
//   private observers: PositionObserver[] = [];

//   public observe(o: PositionObserver): () => void {
//     this.observers.push(o);
//     this.emitChange();

//     return (): void => {
//       this.observers = this.observers.filter((t) => t !== o);
//     };
//   }

//   public moveKnight(toX: number, toY: number): void {
//     console.log("TOX", toX);

//     this.knightPosition = [toX, toY];
//     this.emitChange();
//   }

//   private emitChange() {
//     const pos = this.knightPosition;
//     this.observers.forEach((o) => o && o(pos));
//   }
// }

export type Position = [number, number];
export type PositionObserver = (positions: Position[]) => void;

// Update the Game class

export type MovableItem = {
  id: string;
  position: Position;
};

export class Game {
  public movableItems: MovableItem[] = [];
  private observers: PositionObserver[] = [];

  public observe(o: PositionObserver): () => void {
    this.observers.push(o);
    this.emitChange();

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o);
    };
  }

  public addMovableItem(item: MovableItem): void {
    this.movableItems.push(item);
    this.emitChange();
  }

  public moveMovableItem(id: number, toX: number, toY: number): void {
    // const item = this.movableItems.find((it) => {
    //   console.log("item", it, id);

    //   it.id == id;
    // });
    console.log(
      "🚀 ~ file: Game.ts:60 ~ Game ~ moveMovableItem ~ item:",
      this.movableItems[id],
      this.movableItems,
      id
    );
    const selectedElement = this.movableItems.find((item) => {
      item.id == id.toString();
    });
    const indexElement = this.movableItems.indexOf(selectedElement!);
    console.log(
      "🚀 ~ file: Game.ts:74 ~ Game ~ moveMovableItem ~ indexElement:",
      indexElement
    );
    // if (item) {
    this.movableItems[indexElement] = {
      id: id.toString(),
      position: [toX, toY],
    };
    // item.position = [toX, toY];
    this.emitChange();
    // }
  }

  // public moveMovableItem(id: number, toX: number, toY: number): void {
  //   console.log("itemid", id);

  //   this.movableItems = this.movableItems.map((item) =>
  //     item.id == id.toString() ? { id : id, position: [toX, toY] } : item
  //   );
  //   this.emitChange();
  // }

  private emitChange() {
    const positions = this.movableItems.map((item) => item.position);
    this.observers.forEach((o) => o && o(positions));
  }
}
