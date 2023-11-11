import { Bool } from 'o1js';
import { BoxFields } from '../Box';
import { isValidEmpty } from './Empty';

/** A target box acts like an empty one, but must have at least one `in`. */
export function isValidTarget(fields: BoxFields): Bool {
  // should act like an empty box
  const isEmpty = isValidEmpty(fields);

  // should have at least one `in` signal
  const isValidOrb = fields.ins.reduce((acc, cur) => acc.or(cur)).equals(true);

  return isEmpty.and(isValidOrb);
}
