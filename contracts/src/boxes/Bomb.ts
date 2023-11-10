import { Bool } from 'o1js';
import { Box, ITEM } from '../Box';

/** A bomb box should have no `in` or `out` signals. */
export class BombBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.BOMB);
  }

  isValid(): Bool {
    // or-reducing the `ins` should return 0
    const noIns = this.ins.reduce((acc, cur) => acc.or(cur)).equals(false); // TODO: is this faster than `not`?
    // or-reducing the `outs` should return 0
    const noOuts = this.ins.reduce((acc, cur) => acc.or(cur)).equals(false);

    return noIns.and(noOuts);
  }
}
