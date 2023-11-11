import { Field } from 'o1js';
import { BoardCase } from '../test/board/common';

/** A box item. */
export enum ITEM {
  EMPTY,
  WALL,
  BOMB,
  TARGET,
  MIRROR,
  SOURCE,
  SPLIT,
  SCATTER,
}

/** An array of all items. Order is important for hashing. */
export const ITEM_ALL = [
  ITEM.EMPTY,
  ITEM.WALL,
  ITEM.BOMB,
  ITEM.TARGET,
  ITEM.MIRROR,
  ITEM.SOURCE,
  ITEM.SPLIT,
  ITEM.SCATTER,
] as const;

export function itemsInitial(): Record<ITEM, Field> {
  // TODO: this safe right?
  return {
    [ITEM.BOMB]: Field(0),
    [ITEM.EMPTY]: Field(0),
    [ITEM.MIRROR]: Field(0),
    [ITEM.SCATTER]: Field(0),
    [ITEM.SOURCE]: Field(0),
    [ITEM.SPLIT]: Field(0),
    [ITEM.TARGET]: Field(0),
    [ITEM.WALL]: Field(0),
  };
}

/** Utility for testing. */
export function findItemCounts(testcase: BoardCase): Record<ITEM, Field> {
  const { board, inventory, solution } = testcase;

  // compute items (board + inventory)
  const itemsBI = {} as Record<ITEM, number>;
  ITEM_ALL.forEach((item) => {
    itemsBI[item] = 0;
  });
  inventory.forEach((item) => {
    itemsBI[item]++;
  });
  board.forEach((row) =>
    row.forEach((box) => {
      itemsBI[box.item]++;
    })
  );

  // compute items (solution)
  const itemsS = {} as Record<ITEM, number>;
  ITEM_ALL.forEach((item) => {
    itemsS[item] = 0;
  });
  solution.forEach((row) =>
    row.forEach((box) => {
      itemsS[box.item]++;
    })
  );

  // assert item counts for the tests sake
  ITEM_ALL.forEach((item) => {
    if (itemsS[item] !== itemsBI[item]) {
      throw new Error('expected item counts to match');
    }
  });

  // assign to field elements
  const items = {} as Record<ITEM, Field>;
  ITEM_ALL.forEach((item) => {
    items[item] = Field(itemsS[item]);
  });

  return items;
}
