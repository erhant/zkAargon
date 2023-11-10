import { SmartContract, method } from 'o1js';

export class BoxTester extends SmartContract {
  init() {
    super.init();
  }

  @method validate(box: Box) {
    // TODO: validate boxes for test
  }
}
