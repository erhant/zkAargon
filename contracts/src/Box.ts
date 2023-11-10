import { Field, SmartContract, state, State, method, Struct, Bool } from 'o1js';
import { DIR } from './utils/Direction';
import { Bool, Bool, Bool } from 'o1js/dist/node/lib/bool';

/** A box item. */
enum ITEM {
  EMPTY = 0,
  WALL = 1,
  BOMB = 2,
  ORB = 3,
  MIRROR = 4,
  SPLIT = 5,
}

export abstract class Box extends Struct({
  ins: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  outs: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  item: Field,
  itemDir: Field,
}) {
  abstract isItem(): Bool;
  abstract isValid(): Bool;

  /** Asserts that the box direction is valid. */
  isDirValid() {
    this.itemDir.lessThan(8); // there are 8 directions in total, 0-indexed
  }

  /** A wall box should have no `out` signals. */
  private validWall() {
    const isItem = this.item.equals(ITEM.WALL);
    const isValid = 
    return isItem.and(isValid);
  }
}

/** A bomb box should have no `in` signals. */
export class BombBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.BOMB);
  }

  isValid(): Bool {
    return this.ins.reduce((acc, cur) => acc.or(cur));
  }
}

/** A box without any items should forward `ins` to `outs`. */
export class EmptyBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.EMPTY);
  }

  isValid(): Bool {
    return DIR.ALL.map((d) =>
      // TODO: can do modular arithmetic here too, opposite = (dir + 4) % 8
      this.ins[d].equals(this.outs[DIR.opposite(d)])
    ).reduce((acc, cur) => acc.or(cur));
  }
}

export class WallBox extends Box {
  isItem(): Bool {
    return this.item.equals(ITEM.WALL);
  }
  
  isValid(): Bool {
    return this.outs.reduce((acc, cur) => acc.or(cur));
  }
}
