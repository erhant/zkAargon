enum ITEM {
    EMPTY = 0,
    WALL = 1,
    BOMB = 2,
    TARGET = 3,
    MIRROR = 4,
    SOURCE = 5,
    SPLIT = 6,
    SCATTER = 7,
  }
  
  enum DIR {
    TOP_LEFT = 0,
    TOP = 1,
    TOP_RIGHT = 2,
    RIGHT = 3,
    BOTTOM_RIGHT = 4,
    BOTTOM = 5,
    BOTTOM_LEFT = 6,
    LEFT = 7,
  }
  
  interface Neighbor {
    neighborIndex: number;
    neighborInputDir: number;
  }
  
  function getNeighboursFromNewOutsAndGetTheirInputs(
    currentItemIndex: number,
    n: number,
    newOuts: number[]
  ): Neighbor[] {
    const i = Math.floor(currentItemIndex / n);
    const j = currentItemIndex % n;
  
    const neighborConnectionMap: { [key: string]: number } = {
      '-1,-1': 0,
      '-1,0': 1,
      '-1,1': 2,
      '0,1': 3,
      '1,1': 4,
      '1,0': 5,
      '1,-1': 6,
      '0,-1': 7,
    };
  
    const res: Neighbor[] = [];
    for (const ii of [-1, 0, 1]) {
      for (const jj of [-1, 0, 1]) {
        const neighborI = i + ii;
        const neighborJ = j + jj;
  
        if (
          neighborI < n &&
          neighborI > -1 &&
          neighborJ < n &&
          neighborJ > -1 &&
          !(neighborI === i && neighborJ === j)
        ) {
          const neighborDir = neighborConnectionMap[`${ii},${jj}`];
          if (newOuts[neighborDir]) {
            const inputDirForTheNeighbor = (neighborDir + 4) % 8;
            res.push({
              neighborIndex: neighborI * n + neighborJ,
              neighborInputDir: inputDirForTheNeighbor,
            });
          }
        }
      }
    }
    return res;
  }
  
  function getNewOutsForCurrent(
    item: ITEM,
    itemDir: DIR,
    insCur: number[],
    outsCur: number[]
  ): number[] {
    const res = [0, 0, 0, 0, 0, 0, 0, 0];
  
    if (item === ITEM.BOMB) {
      return res;
    } else if (item === ITEM.EMPTY || item === ITEM.TARGET) {
      const insRotatedByFour = insCur.slice(-4).concat(insCur.slice(0, -4));
      res.forEach((_, index) => {
        if (insRotatedByFour[index] === 1 && outsCur[index] !== 1) {
          res[index] = 1;
        }
      });
    } else if (item === ITEM.MIRROR) {
      const leftDir = (itemDir - 1 + 8) % 8;
      const rightDir = (itemDir + 1) % 8;
  
      if (insCur[itemDir] === 1 && outsCur[itemDir] !== 1) {
        res[itemDir] = 1;
      }
  
      if (insCur[leftDir] === 1 && outsCur[rightDir] !== 1) {
        res[rightDir] = 1;
      }
  
      if (insCur[rightDir] === 1 && outsCur[leftDir] !== 1) {
        res[leftDir] = 1;
      }
    } else if (item === ITEM.SCATTER) {
      const leftDir = (itemDir - 3 + 8) % 8;
      const rightDir = (itemDir + 3) % 8;
  
      if (insCur[itemDir] === 1) {
        if (outsCur[rightDir] !== 1) {
          res[rightDir] = 1;
        }
        if (outsCur[leftDir] !== 1) {
          res[leftDir] = 1;
        }
      }
  
      if (
        (insCur[leftDir] === 1 || insCur[rightDir] === 1) &&
        outsCur[itemDir] !== 1
      ) {
        res[itemDir] = 1;
      }
    } else if (item === ITEM.SOURCE) {
      if (outsCur[itemDir] !== 1) {
        res[itemDir] = 1;
      }
    } else if (item === ITEM.SPLIT) {
      const leftDir = (itemDir - 2 + 8) % 8;
      const rightDir = (itemDir + 2) % 8;
  
      if (insCur[itemDir] === 1) {
        if (outsCur[rightDir] !== 1) {
          res[rightDir] = 1;
        }
        if (outsCur[leftDir] !== 1) {
          res[leftDir] = 1;
        }
      }
    } else if (item === ITEM.WALL) {
      return res;
    }
  
    return res;
  }
  
  function boardGenerate(items: ITEM[], itemDirs: DIR[], n: number): [number[][], number[][]] {
    const ins: number[][] = Array.from({ length: n * n }, () => Array(8).fill(0));
    const outs: number[][] = Array.from({ length: n * n }, () => Array(8).fill(0));
  
    const sourceIndices = items
      .map((item, index) => (item === ITEM.SOURCE ? index : -1))
      .filter((index) => index !== -1);
  
    let queue = sourceIndices;
  
    while (queue.length > 0) {
      const currentItemIndex = queue.shift() as number;
      const item = items[currentItemIndex];
      const itemDir = itemDirs[currentItemIndex];
      const insCur = ins[currentItemIndex];
      const outsCur = outs[currentItemIndex];
      const newOuts = getNewOutsForCurrent(item, itemDir, insCur, outsCur);
  
      const neigs = getNeighboursFromNewOutsAndGetTheirInputs(
        currentItemIndex,
        n,
        newOuts
      );
  
      for (const neig of neigs) {
        const { neighborIndex, neighborInputDir } = neig;
        if (!queue.includes(neighborIndex)) {
          queue.push(neighborIndex);
        }
  
        ins[neighborIndex][neighborInputDir] = 1;
      }
  
      const updatedCurOut = newOuts.map(
        (value, index) => (value === 1 || outsCur[index] === 1 ? 1 : 0)
      );
      outs[currentItemIndex] = updatedCurOut;
    }
  
    return [ins, outs];
  }
  
  function main() {
    const n = 3;
    const items: ITEM[] = [
      ITEM.SOURCE,
      ITEM.SOURCE,
      ITEM.TARGET,
      ITEM.BOMB,
      ITEM.SPLIT,
      ITEM.MIRROR,
      ITEM.WALL,
      ITEM.TARGET,
      ITEM.EMPTY,
    ];
    const itemDirs: DIR[] = [
      DIR.BOTTOM_RIGHT,
      DIR.BOTTOM_RIGHT,
      DIR.BOTTOM_LEFT,
      DIR.BOTTOM_LEFT,
      DIR.TOP_LEFT,
      DIR.LEFT,
      DIR.TOP,
      DIR.TOP,
      DIR.TOP,
    ];
  
    const [ins, outs] = boardGenerate(items, itemDirs, n);
  
    // Uncomment the following lines to print the results
    // for (const inx of ins)
    //    console.log(inx);
    //    console.log('============')
    //for (const outx of outs)
    //    console.log(outx);
  }
  
  main();
  