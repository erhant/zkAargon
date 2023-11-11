import { Bool } from 'o1js';
import { BoxFields } from '../Box';
import { DIR_ALL } from '../utils/direction';

export function isValidScatter(fields: BoxFields): Bool {
  // check for each direction
  return (
    DIR_ALL.map((d) => {
      // is this item looking at this direction?
      const isItemDir = fields.itemDir.equals(d);
      const d_l = (d - 3 + 8) % 8;
      const d_r = (d + 3) % 8;
      // is the item valid for this direction?
      // there are multiple steps to this, shown below.

      // - the `in` at `d` should split the laser
      // so the `in` at d should equal `out` d+3 and `out`d-3
      const isValidDirect = fields.ins[d]
        .equals(fields.outs[d_r])
        .and(fields.ins[d].equals(fields.outs[d_l]));

      // - if the `in` at (d-3) or (d+3) is true than `out` d should be true
      const isValidCorners = fields.outs[d].equals(
        fields.ins[d_l].or(fields.ins[d_r])
      );

      // - the other output signals should be 0 (except d, d-3, d+3)
      const isValidOut = fields.outs[(d + 1) % 8]
        .or(fields.outs[(d + 2) % 8])
        .or(fields.outs[(d + 4) % 8])
        .or(fields.outs[(d + 6) % 8])
        .or(fields.outs[(d + 7) % 8])
        .not();

      // finally `and` them all
      const isValid = isValidDirect.and(isValidCorners).and(isValidOut);

      return isItemDir.and(isValid);
    })
      // or-reduce to get at least 1 valid
      .reduce((acc, cur) => acc.or(cur))
  );
}
