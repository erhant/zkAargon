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
