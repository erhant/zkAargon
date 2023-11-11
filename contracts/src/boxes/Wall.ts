import { Bool } from 'o1js';
import { BoxFields } from '../Box';

/** A wall has no `out` signals. */
export function isValidWall(fields: BoxFields): Bool {
  // or-reducing the `outs` should return 0
  return fields.outs.reduce((acc, cur) => acc.or(cur)).equals(false); // TODO: is this faster than `.not()`?
}
