import { Bool, Field } from 'o1js';
import { Box, ITEM } from '../Box';
import { DIR } from '../utils/Direction';

/**
 * A source box has a single `out` signal at the
 * direction that the source is looking at. It does not have
 * any other `out` signals.
 */
export class SourceBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.SOURCE);
  }

  isValid(): Bool {
    // check for each direction
    return (
      DIR.ALL.map((d) => Field(d))
        .map((df) => {
          // is this item looking at this direction?
          const isItemDir = this.itemDir.equals(df);

          // is the item valid for this direction?
          // check `out` is 1 at the direction, and 0 everywhere else
          const isValid = this.outs
            .map((_, i) => this.outs[i].equals(df.equals(i)))
            .reduce((acc, cur) => acc.and(cur));

          return isItemDir.and(isValid);
        })
        // or-reduce to get at least 1 valid
        .reduce((acc, cur) => acc.or(cur))
    );
  }
}
