import { Bool } from 'o1js';
import { ITEM } from '../Box';
import { EmptyBox } from './Empty';

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
