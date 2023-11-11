import { Bool } from 'o1js';
import { Box, ITEM } from '../Box';
import { DIR } from '../utils/Direction';

/** A Scatter box splits the input laser.
 *
 * If the laser is coming diagonally w.r.t the scatter direction (d),
 * it should split the laser to the (d+3) and (d-3) directions;
 * or, if the laser comes from (d+3) or (d-3) corners then scatter forwards the laser at d direction.
 *
 * There shouldn't be any other out signals.
 */
export class ScatterBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.SPLIT);
  }

  isValid(): Bool {
    // check for each direction
    return (
      DIR.ALL.map((d) => {
        // is this item looking at this direction?
        const isItemDir = this.itemDir.equals(d);
        const d_l = (d - 3) % 8;
        const d_r = (d + 3) % 8;

        // is the item valid for this direction?
        // there are multiple steps to this, shown below.

        // - the `in` at `d` should split the laser
        // so the `in` at d should equal `out` d+3 and `out`d-3
        const isValidDirect = this.ins[d].equals(this.outs[d_r]).and(this.ins[d].equals(this.outs[d_l]))

        // - if the `in` at (d-3) or (d+3) is true than `out` d should be true
        const isValidCorners = this.outs[d].equals(this.outs[d_l].or(this.outs[d_r]));

        // - the other output signals should be 0 (except d, d-3, d+3)
        const isValidOut = this.outs[d-1]
          .equals(false)
          .and(this.outs[(d + 1) % 8].equals(false))
          .and(this.outs[(d + 2) % 8].equals(false))
          .and(this.outs[(d + 4) % 8].equals(false))
          .and(this.outs[(d + 6) % 8].equals(false))
          .and(this.outs[(d + 7) % 8].equals(false));

        // finally `and` them all
        const isValid = isValidDirect
          .and(isValidCorners)
          .and(isValidOut);

        return isItemDir.and(isValid);
      })
        // or-reduce to get at least 1 valid
        .reduce((acc, cur) => acc.or(cur))
    );
  }
}
