import { Field, SmartContract, state, State, method } from 'o1js';

export class ZkAargon extends SmartContract {
  @state(Field) hash = State<Field>(); // TODO: hash?

  init() {
    super.init();
  }

  @method update() {
    // TODO: ?
  }
}
