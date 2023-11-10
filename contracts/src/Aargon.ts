import { Field, SmartContract, state, State, method } from 'o1js';
import { Box } from './Box';

export class ZkAargon extends SmartContract {
  @state(Field) hash = State<Field>(); // TODO: hash of the board?

  init() {
    super.init();
  }

  @method verify(board: Box[]) {
    // TODO: reduce over box validnes
  }
}
