import { Field, Struct, Bool } from 'o1js';
import { DIR, DIRType } from './utils/Direction';

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

// TODO: the reductions can be written once as a utility, they are repeated quite a lot

// TODO: is item can be implemented within `Box`, with item type as a constructor param?
// but that needs everything to be implemented in construcotr and passed to Struct and stuff

/**
 * A Box is the unit entity in the game, where the game is composed of `N x M` boxes.
 *
 * One can assume that if all boxes are valid, the game has a valid solution.
 */
export abstract class Box extends Struct({
  ins: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  outs: [Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool],
  item: Field,
  itemDir: Field,
}) {
  /** Returns `true` w.r.t item type. */
  abstract isItem(): Bool;

  /** Returns `true` if the laser configuration is valid w.r.t item. */
  abstract isValid(): Bool;

  /** Connects this box to another box at the given direction. */
  connect(other: Box, dir: DIRType) {
    // this is a simpler method, we only care about `out` of the other box
    this.ins[dir].assertEquals(other.outs[(dir + 4) % 8]);
  }

  validate(boxes: Box[]) {
    // TODO: ?
  }
}
