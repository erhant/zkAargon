import { Bool } from 'o1js';
import { BoxFields } from '../Box';

/**
 * A bomb box should have no `in` or `out` signals.
 *
 * Item direction is irrelevant.
 */
export function isValidBomb(fields: BoxFields): Bool {
  // or-reducing the `ins` should return 0
  const noIns = fields.ins.reduce((acc, cur) => acc.or(cur)).not(); // same as equals false

  // or-reducing the `outs` should return 0
  const noOuts = fields.ins.reduce((acc, cur) => acc.or(cur)).not(); // same as equals false

  return noIns.and(noOuts);
}
