import { Field, SmartContract, state, State, method, Struct, Bool } from 'o1js';
import { DIR } from './utils/Direction';

export class Box extends Struct({
  ins: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  outs: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  item: Field,
  itemDir: Field,
}) {
  /** Asserts that the box is valid. */
  private assertBox() {
    this.itemDir.lessThan(8); // there are 8 directions in total
  }

  /** A bomb box should have no `in` signals. */
  private validBomb() {
    const isItem = this.item.equals(ITEM.BOMB);
    const isValid = this.ins.reduce((acc, cur) => acc.or(cur));
    return isItem.and(isValid);
  }

  /** A wall box should have no `out` signals. */
  private validWall() {
    const isItem = this.item.equals(ITEM.WALL);
    const isValid = this.outs.reduce((acc, cur) => acc.or(cur));
    return isItem.and(isValid);
  }

  /** A box without any items should forward `ins` to `outs`. */
  private validNone() {
    const isItem = this.item.equals(ITEM.NONE);
    const isValid = DIR.ALL.map((d) =>
      // TODO: can do modular arithmetic here too, opposite = (dir + 4) % 8
      this.ins[d].equals(this.outs[DIR.opposite(d)])
    ).reduce((acc, cur) => acc.or(cur));
    return isItem.and(isValid);
  }

  /** A box with a mirror should bounce the laser w.r.t item direction. */
  private validMirror() {
    DIR.ALL.map((itemDir) => {
      // TODO: check bounce for all items
    });
  }

  /** A box with a split should split a laser w.r.t item direction. */
  private validSplit() {
    DIR.ALL.map((itemDir) => {
      // TODO: check split for all items
    });
  }
}

export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method update() {
    const currentState = this.num.getAndAssertEquals();
    const newState = currentState.add(2);
    this.num.set(newState);
  }
}
