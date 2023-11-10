import { Field, Struct, Bool } from 'o1js';
import { DIR } from './utils/Direction';

/** A box item. */
enum ITEM {
  EMPTY = 0,
  WALL = 1,
  BOMB = 2,
  TARGET = 3,
  MIRROR = 4,
  SPLIT = 5,
  SOURCE = 6,
}

// TODO: the reductions can be written once as a utility, they are repeated quite a lot

export abstract class Box extends Struct({
  ins: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  outs: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  item: Field,
  itemDir: Field,
}) {
  abstract isItem(): Bool;
  abstract isValid(): Bool;

  /** Asserts that the box direction is valid.
   * Only use with items that require direction.
   */
  isDirValid() {
    this.itemDir.lessThan(8); // there are 8 directions in total, 0-indexed
  }
}

/** A bomb box should have no `in` signals. */
export class BombBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.BOMB);
  }

  isValid(): Bool {
    // or-reducing the `ins` should return 0
    return this.ins.reduce((acc, cur) => acc.or(cur)).equals(false); // TODO: is this faster than `.not()`?
  }
}

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

/** A wall has no `out` signals. */
export class WallBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.WALL);
  }

  isValid(): Bool {
    // or-reducing the `outs` should return 0
    return this.outs.reduce((acc, cur) => acc.or(cur)).equals(false); // TODO: is this faster than `.not()`?
  }
}

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

/** A target box acts like an empty one, but must have at least one `in`. */
export class TargetBox extends EmptyBox {
  override isItem(): Bool {
    return this.item.equals(ITEM.TARGET);
  }

  isValid(): Bool {
    // should act like an empty box
    const isValidEmpty = super.isValid();

    // should have at least one `in` signal
    const isValidOrb = this.ins.reduce((acc, cur) => acc.or(cur)).equals(true);

    return isValidEmpty.and(isValidOrb);
  }
}

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

export class SplitBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.SOURCE);
  }

  isValid(): Bool {
    throw new Error('TODO: implement');
  }
}
