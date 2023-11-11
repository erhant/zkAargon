import { Bool, Field } from 'o1js';
import { BoardBoxType, BoardCase } from '../test/board/common';
import { ITEM, ITEM_ALL, findItemCounts, itemsInitial } from './item';
import { Box } from '../Box';
import { DIR_ALL } from './direction';

export function caseToProvable(testcase: BoardCase): {
  board: Box[];
  items: Record<ITEM, Field>;
  solution: Box[];
} {
  const { board, solution } = testcase;

  // compute laser directions
  // TODO: makif

  const items = findItemCounts(testcase);

  return {
    board: boardToDummyProvable(board),
    items,
    solution: [
      // TODO: todo todo
    ],
  };
}

export function boardToDummyProvable(board: BoardBoxType[][]) {
  return board.flat().map(
    (box) =>
      new Box({
        // for a board (not solution) we don't care about ins and outs
        // so we can assign them dummy values
        ins: DIR_ALL.map(() => Bool(false)),
        outs: DIR_ALL.map(() => Bool(false)),
        item: Field(box.item),
        itemDir: Field(box.itemDir),
      })
  );
}
