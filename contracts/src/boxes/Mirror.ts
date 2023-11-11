import { Bool } from 'o1js';
import { Box, ITEM } from '../Box';
import { DIR } from '../utils/Direction';

/** A mirror box bounces the input laser.
 *
 * If the laser is coming diagonally w.r.t the mirror direction,
 * it should bounce off to the other direction (d+2); or,
 * a laser can face the mirror directly and it should bounce from the same
 * direction.
 *
 * There shouldn't be any other out signals.
 */
export class MirrorBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.MIRROR);
  }

  isValid(): Bool {
    // check for each direction
    return (
      DIR.ALL.map((d) => {
        // is this item looking at this direction?
        const isItemDir = this.itemDir.equals(d);
        const d_l = (d - 1) % 8;
        const d_r = (d + 1) % 8;

        // is the item valid for this direction?
        // there are multiple steps to this, shown below.

        // - the `in` and `out` at `d` should be equal
        const isValidDirect = this.ins[d].equals(this.outs[d]);

        // - the `in` at d-1 should equal `out` d+1
        const isValidRightBounce = this.ins[d_l].equals(this.outs[d_r]);

        // - the `in` at d+1 should equal `out` d-1
        const isValidLeftBounce = this.ins[d_r].equals(this.outs[d_l]);

        // - the other output signals should be 0
        const isValidOut = Array.from(
          { length: 5 }, // ignore other 3 directions: d-1, d, d+1
          (_, i) => this.outs[(d + 2 + i) % 8].equals(false)
        )
          .reduce((acc, cur) => acc.or(cur))
          .equals(false);

        // finally `and` them all
        const isValid = isValidDirect
          .and(isValidRightBounce)
          .and(isValidLeftBounce)
          .and(isValidOut);

        return isItemDir.and(isValid);
      })
        // or-reduce to get at least 1 valid
        .reduce((acc, cur) => acc.or(cur))
    );
  }
}