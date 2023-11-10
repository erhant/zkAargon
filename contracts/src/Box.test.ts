import { ITEM } from './Box';
import { DIR } from './utils/Direction';
import { Field, SmartContract, state, State, method, Struct, Bool } from 'o1js';

/** BombBox test cases */
const BombBoxFailCase = {
  ins: [true, false, false, false, false, false, false, false],
  outs: [false, false, false, false, false, false, false, false],
  item: ITEM.BOMB,
  itemDir: DIR.BOTTOM,
}

const BombBoxSuccessCase = {
  ins: [false, false, false, false, false, false, false, false],
  outs: [false, false, false, false, false, false, false, false],
  item: ITEM.BOMB,
  itemDir: DIR.BOTTOM,
}

/** EmptyBox test cases */
const EmptyBoxFailCase = {
  // we have in from 0 but we dont have out at 4
  ins: [true, false, true, false, false, false, false, false],
  outs: [false, false, false, false, false, false, true, false],
  item: ITEM.EMPTY,
  itemDir: DIR.TOP,
}

const EmptyBoxSuccessCase = {
  ins: [true, false, true, false, false, false, false, false],
  outs: [false, false, false, false, true, false, true, false],
  item: ITEM.EMPTY,
  itemDir: DIR.TOP,
}

/** WallBox test cases */
const WallBoxFailCase = {
  ins: [true, false, false, false, false, false, false, false],
  outs: [false, false, false, false, false, false, true, false],
  item: ITEM.WALL,
  itemDir: DIR.TOP,
}

const WallBoxSuccessCase = {
  ins: [true, false, false, false, false, false, false, false],
  outs: [false, false, false, false, false, false, false, false],
  item: ITEM.WALL,
  itemDir: DIR.TOP,
}

/** TargetBox test cases */
const TargetBoxFailCase = {
  ins: [false, false, false, false, false, false, false, false],
  outs: [false, false, false, false, false, false, true, false],
  item: ITEM.SOURCE,
  itemDir: DIR.TOP,
}

const TargetBoxSuccessCase = {
  ins: [true, false, false, false, false, false, false, false],
  outs: [false, false, false, false, true, false, false, false],
  item: ITEM.SOURCE,
  itemDir: DIR.TOP,
}

/** SourceBox test cases */
const SourceBoxFailCase = {
  ins: [false, false, false, false, false, false, false, false],
  outs: [false, true, false, false, false, false, false, false],
  item: ITEM.SOURCE,
  itemDir: DIR.RIGHT,
}

const SourceBoxSuccessCase = {
  ins: [true, false, false, false, false, false, false, false],
  outs: [false, false, false, true, false, false, false, false],
  item: ITEM.SOURCE,
  itemDir: DIR.RIGHT,
}

/** MirrorBox test cases */
const MirrorBoxFailCase = {
  ins: [false, true, false, false, false, false, false, false],
  outs: [true, false, false, false, false, false, false, false],
  item: ITEM.MIRROR,
  itemDir: DIR.TOP_LEFT,
}

const MirrorBoxSuccessCase = {
  ins: [false, true, false, false, false, false, false, false],
  outs: [false, false, false, false, false, false, false, true],
  item: ITEM.MIRROR,
  itemDir: DIR.TOP_LEFT,
}