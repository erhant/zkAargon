import { Bool } from 'o1js';
import { BoxFields } from '../Box';
import { DIR } from '../utils/Direction';

/** A box without any items should forward `ins` to `outs`. */
export function isValidEmpty(fields: BoxFields): Bool {
  return DIR.ALL.map((d) =>
    // `(dir + 4) mod 8` results in the opposite direction.
    fields.ins[d].equals(fields.outs[(d + 4) % 8])
  ).reduce((acc, cur) => acc.and(cur));
}
