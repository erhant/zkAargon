import { Bool } from 'o1js';
import { Box, ITEM } from '../Box';
import { DIR } from '../utils/Direction';

/** A box without any items should forward `ins` to `outs`. */
export class EmptyBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.EMPTY);
  }

  isValid(): Bool {
    return DIR.ALL.map((d) =>
      // `(dir + 4) mod 8` results in the opposite direction.
      this.ins[d].equals(this.outs[(d + 4) % 8])
    ).reduce((acc, cur) => acc.and(cur));
  }
}
