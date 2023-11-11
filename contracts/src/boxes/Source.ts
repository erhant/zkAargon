import { Bool, Field } from 'o1js';
import { BoxFields } from '../Box';
import { DIR_ALL } from '../utils/direction';

/**
 * A source box has a single `out` signal at the
 * direction that the source is looking at.
 * It does not have any other `out` signals.
 *
 * Item direction is the direction at which the laser is
 * outputted from source.
 */
export function isValidSource(fields: BoxFields): Bool {
  // check for each direction
  return (
    DIR_ALL.map((d) => Field(d))
      .map((df) => {
        // is this item looking at this direction?
        const isItemDir = fields.itemDir.equals(df);

        // is the item valid for this direction?
        // check `out` is 1 at the direction, and 0 everywhere else
        const isValid = fields.outs
          .map((_, i) => fields.outs[i].equals(df.equals(i)))
          .reduce((acc, cur) => acc.and(cur));

        return isItemDir.and(isValid);
      })
      // or-reduce to get at least 1 valid
      .reduce((acc, cur) => acc.or(cur))
  );
}
