import { ITEM } from '../Box';
import { DIR, DIRType } from '../utils/Direction';

export type CaseType = {
  // prettier-ignore
  ins: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean],
  // prettier-ignore
  outs: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean],
  item: ITEM;
  itemDir: DIRType;
};
export const cases: Record<number, Record<'pass' | 'fail', CaseType>> = {
  [ITEM.BOMB]: {
    fail: {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.BOMB,
      itemDir: DIR.BOTTOM,
    },
    pass: {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.BOMB,
      itemDir: DIR.BOTTOM,
    },
  },
  [ITEM.EMPTY]: {
    pass: {
      ins: [true, false, true, false, false, false, false, false],
      outs: [false, false, false, false, true, false, true, false],
      item: ITEM.EMPTY,
      itemDir: DIR.TOP,
    },
    fail: {
      // we have in from 0 but we dont have out at 4
      ins: [true, false, true, false, false, false, false, false],
      outs: [false, false, false, false, false, false, true, false],
      item: ITEM.EMPTY,
      itemDir: DIR.TOP,
    },
  },
  [ITEM.WALL]: {
    pass: {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.WALL,
      itemDir: DIR.TOP,
    },
    fail: {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, true, false],
      item: ITEM.WALL,
      itemDir: DIR.TOP,
    },
  },
  [ITEM.TARGET]: {
    fail: {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, true, false],
      item: ITEM.SOURCE,
      itemDir: DIR.TOP,
    },
    pass: {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, true, false, false, false],
      item: ITEM.SOURCE,
      itemDir: DIR.TOP,
    },
  },
  [ITEM.SOURCE]: {
    fail: {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, true, false, false, false, false, false, false],
      item: ITEM.SOURCE,
      itemDir: DIR.RIGHT,
    },
    pass: {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, true, false, false, false, false],
      item: ITEM.SOURCE,
      itemDir: DIR.RIGHT,
    },
  },
  [ITEM.MIRROR]: {
    fail: {
      ins: [false, true, false, false, false, false, false, false],
      outs: [true, false, false, false, false, false, false, false],
      item: ITEM.MIRROR,
      itemDir: DIR.TOP_LEFT,
    },
    pass: {
      ins: [false, true, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, true],
      item: ITEM.MIRROR,
      itemDir: DIR.TOP_LEFT,
    },
  },

  [ITEM.SPLIT]: {
    fail: {
      ins: [false, false, false, true, false, false, false, false],
      outs: [false, false, false, false, false, false, false, true],
      item: ITEM.SPLIT,
      itemDir: DIR.TOP,
    },
    pass: {
      ins: [false, true, false, false, false, false, false, false],
      outs: [false, false, false, true, false, false, false, true],
      item: ITEM.SPLIT,
      itemDir: DIR.TOP,
    },
  },
  [ITEM.SCATTER]: {
    fail: {
      ins: [false, true, false, false, false, false, false, false],
      outs: [false, false, false, false, true, false, false, false],
      item: ITEM.SCATTER,
      itemDir: DIR.TOP,
    },
    pass: {
      ins: [false, true, false, false, false, false, false, false],
      outs: [false, false, false, false, true, false, true, false],
      item: ITEM.SCATTER,
      itemDir: DIR.TOP,
    },
  },
  // TODO: BELOW ARE DUMMY
  [ITEM.DIAGONAL]: {
    fail: {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.BOMB,
      itemDir: DIR.BOTTOM,
    },
    pass: {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.BOMB,
      itemDir: DIR.BOTTOM,
    },
  },
};
