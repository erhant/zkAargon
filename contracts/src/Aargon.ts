import { Field, SmartContract, state, State, method } from 'o1js';
import { Box } from './Box';

export class ZkAargon extends SmartContract {
  @state(Field) hash = State<Field>(); // TODO: hash of the board?
  // TODO: add ownership

  init() {
    super.init();
  }

  @method verify(board: Box[], solution: Box[]) {
    throw new Error('todo');
  }

  @method hashGame(board: Box[]) {
    // TODO: make owner only
    throw new Error('todo');
  }
}
