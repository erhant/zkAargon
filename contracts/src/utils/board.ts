import { Bool, Field } from 'o1js';
import {
  BoardBoxType,
  BoardCase,
  BoardCaseProvable,
} from '../test/board/common';
import { ITEM, ITEM_ALL, findItemCounts, itemsInitial } from './item';
import { Box, BoxArray } from '../Box';
import { DIR_ALL } from './direction';
import { boardGenerate } from './generator';

export function caseToProvable(testcase: BoardCase): BoardCaseProvable {
  const { board, solution } = testcase;
  const items = findItemCounts(testcase);

  return {
    board: boardToBoxes(board),
    items,
    solution: solutionToBoxes(solution),
  };
}

/** A utility function to create a board with dummy `ins` and `outs`. */
export function boardToBoxes(board: BoardBoxType[][]): BoxArray {
  return new BoxArray({
    boxes: board.flat().map(
      (box) =>
        new Box({
          // for a board (not solution) we don't care about ins and outs
          // so we can assign them dummy values
          ins: DIR_ALL.map(() => Bool(false)),
          outs: DIR_ALL.map(() => Bool(false)),
          item: Field(box.item),
          itemDir: Field(box.itemDir),
        })
    ),
  });
}

/** A utility function to create a board from a solution with the `ins` and `outs`. */
export function solutionToBoxes(solution: BoardBoxType[][]): BoxArray {
  const items = solution.flat().map((s) => s.item);
  const itemDirs = solution.flat().map((s) => s.itemDir);

  const [ins, outs] = boardGenerate(items, itemDirs);

  // for (let i = 0; i < items.length; i++) {
  //   console.log({
  //     index: i,
  //     item: items[i],
  //     dir: itemDirs[i],
  //     in: ins[i],
  //     out: outs[i],
  //   });
  // }

  return new BoxArray({
    boxes: Array.from({ length: items.length }, (_, i) => {
      return new Box({
        ins: ins[i].map((i) => (i === 1 ? Bool(true) : Bool(false))),
        outs: outs[i].map((o) => (o === 1 ? Bool(true) : Bool(false))),
        item: Field(items[i]),
        itemDir: Field(itemDirs[i]),
      });
    }),
  });
}
