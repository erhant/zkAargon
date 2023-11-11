import { Field, Struct, Bool } from 'o1js';
import { DIR, DIRType } from './utils/Direction';
import { isValidBomb } from './boxes/Bomb';
import { isValidEmpty } from './boxes/Empty';
import { isValidMirror } from './boxes/Mirror';
import { isValidSource } from './boxes/Source';
import { isValidSplit } from './boxes/Split';
import { isValidTarget } from './boxes/Target';
import { isValidWall } from './boxes/Wall';

/** A box item. */
export enum ITEM {
  EMPTY,
  WALL,
  BOMB,
  TARGET,
  MIRROR,
  DIAGONAL,
  SOURCE,
  SPLIT,
  SCATTER,
}

export type BoxFields = {
  ins: Bool[];
  outs: Bool[];
  item: Field;
  itemDir: Field;
};

// TODO: the reductions can be written once as a utility, they are repeated quite a lot

// TODO: is item can be implemented within `Box`, with item type as a constructor param?
// but that needs everything to be implemented in construcotr and passed to Struct and stuff

/**
 * A Box is the unit entity in the game, where the game is composed of `N x M` boxes.
 *
 * One can assume that if all boxes are valid, the game has a valid solution.
 */
export class Box extends Struct({
  ins: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  outs: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  item: Field,
  itemDir: Field,
}) {
  validBomb(): Bool {
    return isValidBomb({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.BOMB));
  }

  validEmpty(): Bool {
    return isValidEmpty({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.EMPTY));
  }

  validMirror(): Bool {
    return isValidMirror({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.MIRROR));
  }

  validSource(): Bool {
    return isValidSource({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.SOURCE));
  }

  validSplit(): Bool {
    return isValidSplit({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.SPLIT));
  }

  validTarget(): Bool {
    return isValidTarget({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.TARGET));
  }

  validWall(): Bool {
    return isValidWall({
      ins: this.ins,
      outs: this.outs,
      item: this.item,
      itemDir: this.itemDir,
    }).and(this.item.equals(ITEM.WALL));
  }

  /** Connects this box to another box at the given direction. */
  connect(other: Box, dir: DIRType) {
    // this is a simpler method, we only care about `out` of the other box
    this.ins[dir].assertEquals(other.outs[(dir + 4) % 8]);
  }
}
