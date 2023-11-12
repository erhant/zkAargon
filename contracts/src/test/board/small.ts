import { DIR } from '../../utils/direction';
import { ITEM } from '../../utils/item';
import { BOMB, BoardCase, EMPTY, TARGET, WALL } from './common';

/** Small example with few items. Expected to pass. */
export const SMALL_EXAMPLE: BoardCase = {
  solution: [
    // prettier-ignore
    [EMPTY, { item: ITEM.MIRROR, itemDir: DIR.BOTTOM_RIGHT }, { item: ITEM.MIRROR, itemDir: DIR.BOTTOM_LEFT }],
    [EMPTY, { item: ITEM.SOURCE, itemDir: DIR.TOP }, EMPTY],
    [BOMB, WALL, TARGET],
  ],
  inventory: [ITEM.MIRROR, ITEM.MIRROR],
  board: [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, { item: ITEM.SOURCE, itemDir: DIR.TOP }, EMPTY],
    [BOMB, WALL, TARGET],
  ],
};
