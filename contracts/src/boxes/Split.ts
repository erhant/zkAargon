import { Bool } from 'o1js';
import { BoxFields } from '../Box';
import { DIR } from '../utils/Direction';

/** A Split box splits the input laser.
 *
 * If the laser is coming diagonally w.r.t the mirror direction,
 * it should split the laser to the (d+2) and (d-2) directions;
 * or, in other cases the laser should not propagate.
 *
 * There shouldn't be any other out signals.
 */
export function isValidSplit(fields: BoxFields): Bool {
  // check for each direction
  return (
    DIR.ALL.map((d) => {
      // is this item looking at this direction?
      const isItemDir = fields.itemDir.equals(d);
      const d_l = (d - 2) % 8;
      const d_r = (d + 2) % 8;

      // is the item valid for this direction?
      // there are multiple steps to this, shown below.

      // - the `in` at `d` should split the laser
      // so the `in` at d should equal `out` d+2 and `out`d-2
      const isValidDirect = fields.ins[d]
        .equals(fields.outs[d_r])
        .and(fields.ins[d].equals(fields.outs[d_l]));

      // - the other output signals should be 0
      // TODO: refactor
      const isValidOut = fields.outs[d]
        .equals(false)
        .and(fields.outs[(d + 1) % 8].equals(false))
        .and(fields.outs[(d + 3) % 8].equals(false))
        .and(fields.outs[(d + 4) % 8].equals(false))
        .and(fields.outs[(d + 5) % 8].equals(false))
        .and(fields.outs[(d + 7) % 8].equals(false));

      // finally `and` them all
      const isValid = isValidDirect.and(isValidOut);

      return isItemDir.and(isValid);
    })
      // or-reduce to get at least 1 valid
      .reduce((acc, cur) => acc.or(cur))
  );
}
