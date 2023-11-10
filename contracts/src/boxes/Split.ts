import { Bool } from 'o1js';
import { Box, ITEM } from '../Box';
import { DIR } from '../utils/Direction';

/** A Split box splits the input laser.
 *
 * If the laser is coming diagonally w.r.t the mirror direction,
 * it should split the laser to the (d+2) and (d-2) directions; or,
 * a laser is coming from horizontally w.r.t. the mirror direction it should go directly without an intervention,
 * ; in other cases the laser should not propagate.
 *
 * There shouldn't be any other out signals.
 */
export class SplitBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.SPLIT);
  }

  isValid(): Bool {
    // check for each direction
    return (
      DIR.ALL.map((d) => {
        // is this item looking at this direction?
        const isItemDir = this.itemDir.equals(d);
        const d_l = (d - 2) % 8;
        const d_r = (d + 2) % 8;

        // is the item valid for this direction?
        // there are multiple steps to this, shown below.

        // - the `in` and `out` at `d` should split the laser
        // if no direct laser then we should not check d_l and d_r
        const notDirect = this.ins[d].not();
        const isValidDirect = notDirect.or(
          this.ins[d].and(this.outs[d_r]).and(this.outs[d_l])
        );

        // - the `in` at d-2 should equal `out` d+2
        const isValidRightThrough = this.ins[d_l].equals(this.outs[d_r]);

        // - the `in` at d+2 should equal `out` d-2
        const isValidLeftThrough = this.ins[d_r].equals(this.outs[d_l]);

        // - the other output signals should be 0
        const isValidOut = this.outs[(d + 1) % 8]
          .equals(false)
          .and(this.outs[(d + 3) % 8].equals(false))
          .and(this.outs[(d + 4) % 8].equals(false))
          .and(this.outs[(d + 5) % 8].equals(false))
          .and(this.outs[(d + 7) % 8].equals(false));

        // finally `and` them all
        const isValid = isValidDirect
          .and(isValidRightThrough)
          .and(isValidLeftThrough)
          .and(isValidOut);

        return isItemDir.and(isValid);
      })
        // or-reduce to get at least 1 valid
        .reduce((acc, cur) => acc.or(cur))
    );
  }
}
