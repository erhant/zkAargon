import { ITEM } from '../Box';
import { DIR, DIRType } from '../utils/Direction';

export const cases: Record<
  ITEM,
  {
    // prettier-ignore
    ins: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean],
    // prettier-ignore
    outs: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean],
    item: ITEM;
    itemDir: DIRType;
    shouldPass: boolean;
  }[]
> = {
  [ITEM.BOMB]: [
    {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.BOMB,
      itemDir: DIR.BOTTOM,
      shouldPass: false,
    },
    {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.BOMB,
      itemDir: DIR.BOTTOM,
      shouldPass: true,
    },
  ],
  [ITEM.EMPTY]: [
    {
      // we have in from 0 but we dont have out at 4
      ins: [true, false, true, false, false, false, false, false],
      outs: [false, false, false, false, false, false, true, false],
      item: ITEM.EMPTY,
      itemDir: DIR.TOP,
      shouldPass: false,
    },
    {
      ins: [true, false, true, false, false, false, false, false],
      outs: [false, false, false, false, true, false, true, false],
      item: ITEM.EMPTY,
      itemDir: DIR.TOP,
      shouldPass: true,
    },
  ],
  [ITEM.WALL]: [
    {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, true, false],
      item: ITEM.WALL,
      itemDir: DIR.TOP,
      shouldPass: false,
    },
    {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, false],
      item: ITEM.WALL,
      itemDir: DIR.TOP,
      shouldPass: true,
    },
  ],
  [ITEM.TARGET]: [
    {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, true, false],
      item: ITEM.SOURCE,
      itemDir: DIR.TOP,
      shouldPass: false,
    },
    {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, false, true, false, false, false],
      item: ITEM.SOURCE,
      itemDir: DIR.TOP,
      shouldPass: true,
    },
  ],
  [ITEM.SOURCE]: [
    {
      ins: [false, false, false, false, false, false, false, false],
      outs: [false, true, false, false, false, false, false, false],
      item: ITEM.SOURCE,
      itemDir: DIR.RIGHT,
      shouldPass: false,
    },
    {
      ins: [true, false, false, false, false, false, false, false],
      outs: [false, false, false, true, false, false, false, false],
      item: ITEM.SOURCE,
      itemDir: DIR.RIGHT,
      shouldPass: true,
    },
  ],
  [ITEM.MIRROR]: [
    {
      ins: [false, true, false, false, false, false, false, false],
      outs: [true, false, false, false, false, false, false, false],
      item: ITEM.MIRROR,
      itemDir: DIR.TOP_LEFT,
      shouldPass: false,
    },
    {
      ins: [false, true, false, false, false, false, false, false],
      outs: [false, false, false, false, false, false, false, true],
      item: ITEM.MIRROR,
      itemDir: DIR.TOP_LEFT,
      shouldPass: true,
    },
  ],
  [ITEM.DIAGONAL]: [
    // TODO: later
  ],
  [ITEM.SPLIT]: [
    // TODO: later
  ],
  [ITEM.SCATTER]: [
    // TODO: later
  ],
};
