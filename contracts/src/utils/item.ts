import { Field, Struct } from 'o1js';
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

export function itemsInitial(): ItemCounts {
  return new ItemCounts({
    [ITEM.BOMB]: Field(0),
    [ITEM.EMPTY]: Field(0),
    [ITEM.MIRROR]: Field(0),
    [ITEM.SCATTER]: Field(0),
    [ITEM.SOURCE]: Field(0),
    [ITEM.SPLIT]: Field(0),
    [ITEM.TARGET]: Field(0),
    [ITEM.WALL]: Field(0),
  });
}

/** Utility for testing. */
export function findItemCounts(testcase: BoardCase): ItemCounts {
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
    // console.log({ a: itemsS[item], i: item, b: itemsBI[item] });
    if (item === ITEM.EMPTY) return;
    if (itemsS[item] !== itemsBI[item]) {
      throw new Error('expected non-empty item counts to match');
    }
  });

  // assign to field elements
  const items = itemsInitial();
  ITEM_ALL.forEach((item) => {
    items[item] = Field(itemsS[item]);
  });

  return items;
}

export class ItemCounts extends Struct({
  [ITEM.BOMB]: Field,
  [ITEM.EMPTY]: Field,
  [ITEM.MIRROR]: Field,
  [ITEM.SCATTER]: Field,
  [ITEM.SOURCE]: Field,
  [ITEM.SPLIT]: Field,
  [ITEM.TARGET]: Field,
  [ITEM.WALL]: Field,
}) {}
