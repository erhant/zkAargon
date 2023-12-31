import { Field } from 'o1js';
import { Box, BoxArray } from '../../Box';
import { DEFAULT_DIR, DIR } from '../../utils/direction';
import { ITEM } from '../../utils/item';

/** A box type without provable types. */
export type BoardBoxType = {
  item: ITEM;
  itemDir: DIR;
};

/** An example board test case. */
export type BoardCase = {
  board: BoardBoxType[][];
  inventory: ITEM[];
  solution: BoardBoxType[][];
};

/** An example board test case. */
export type BoardCaseProvable = {
  board: BoxArray;
  items: Record<ITEM, Field>;
  solution: BoxArray;
};

export const BOMB: BoardBoxType = {
  item: ITEM.BOMB,
  itemDir: DEFAULT_DIR,
};
export const EMPTY: BoardBoxType = {
  item: ITEM.EMPTY,
  itemDir: DEFAULT_DIR,
};
export const WALL: BoardBoxType = {
  item: ITEM.WALL,
  itemDir: DEFAULT_DIR,
};
export const TARGET: BoardBoxType = {
  item: ITEM.TARGET,
  itemDir: DEFAULT_DIR,
};
