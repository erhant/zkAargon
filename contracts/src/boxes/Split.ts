import { Bool } from 'o1js';
import { BoxFields } from '../Box';
import { DIR_ALL } from '../utils/direction';

/**
 * A Split box splits the input laser in perpendicular fashion.
 *
 * If the laser is coming diagonally w.r.t the mirror direction,
 * it should split the laser to the (d+2) and (d-2) directions;
 * or, in other cases the laser should not propagate.
 *
 * There shouldn't be any other out signals.
 *
 * The item direction is the direction at which the laser is expected to
 * come from for the split.
 */
export function isValidSplit(fields: BoxFields): Bool {
  // check for each direction
  return (
    DIR_ALL.map((d) => {
      // is this item looking at this direction?
      const isItemDir = fields.itemDir.equals(d);
      const d_l = (d - 2 + 8) % 8;
      const d_r = (d + 2) % 8;

      // is the item valid for this direction?
      // there are multiple steps to this, shown below.

      // - the `in` at `d` should split the laser
      // so the `in` at d should equal `out` d+2 and `out`d-2
      const isValidDirectLeft = fields.ins[d].equals(fields.outs[d_l]);
      const isValidDirectRight = fields.ins[d].equals(fields.outs[d_r]);
      const isValidDirect = isValidDirectLeft.and(isValidDirectRight);

      // - the other output signals should be 0 (except d-2, d+2)
      const isValidOut = fields.outs[d]
        .or(fields.outs[(d + 1) % 8])
        //              (d + 2) is skipped
        .or(fields.outs[(d + 3) % 8])
        .or(fields.outs[(d + 4) % 8])
        .or(fields.outs[(d + 5) % 8])
        //              (d + 6) is skipped
        .or(fields.outs[(d + 7) % 8])
        .not();

      // finally `and` them all
      const isValid = isValidDirect.and(isValidOut);

      return isItemDir.and(isValid);
    })
      // or-reduce to get at least 1 valid
      .reduce((acc, cur) => acc.or(cur))
  );
}
