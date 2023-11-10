import { Bool } from 'o1js';
import { Box, ITEM } from '../Box';

/** A wall has no `out` signals. */
export class WallBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.WALL);
  }

  isValid(): Bool {
    // or-reducing the `outs` should return 0
    return this.outs.reduce((acc, cur) => acc.or(cur)).equals(false); // TODO: is this faster than `.not()`?
  }
}
