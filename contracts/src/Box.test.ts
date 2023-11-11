import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  SmartContract,
  method,
  Bool,
} from 'o1js';
import { Box } from './Box';
import { cases } from './test/boxes';
import { ITEM } from './utils/item';

// TODO: interesting things about this test:
// - giving a union type to `box` in the contract causes
// it to be seen as "non provable" type?
// - giving abstract type also causes problem for `isValid` not being a function
// - looping over cases one by one is also a problem, Mina bugs out on typecheck

export class BoxTester extends SmartContract {
  init() {
    super.init();
  }

  @method validateBomb(box: Box) {
    box.validBomb().assertTrue();
  }

  @method invalidateBomb(box: Box) {
    box.validBomb().assertFalse();
  }

  @method validateEmpty(box: Box) {
    box.validEmpty().assertTrue();
  }

  @method invalidateEmpty(box: Box) {
    box.validEmpty().assertFalse();
  }

  @method validateMirror(box: Box) {
    box.validMirror().assertTrue();
  }

  @method invalidateMirror(box: Box) {
    box.validMirror().assertFalse();
  }

  @method validateScatter(box: Box) {
    box.validScatter().assertTrue();
  }

  @method invalidateScatter(box: Box) {
    box.validScatter().assertFalse();
  }

  @method validateSource(box: Box) {
    box.validSource().assertTrue();
  }

  @method invalidateSource(box: Box) {
    box.validSource().assertFalse();
  }

  @method validateSplit(box: Box) {
    box.validSplit().assertTrue();
  }

  @method invalidateSplit(box: Box) {
    box.validSplit().assertFalse();
  }

  @method validateTarget(box: Box) {
    box.validTarget().assertTrue();
  }

  @method invalidateTarget(box: Box) {
    box.validTarget().assertFalse();
  }

  @method validateWall(box: Box) {
    box.validWall().assertTrue();
  }

  @method invalidateWall(box: Box) {
    box.validWall().assertFalse();
  }
}

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('Box', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: BoxTester;

  beforeAll(async () => {
    if (proofsEnabled) await BoxTester.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new BoxTester(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `BoxTester` smart contract', async () => {
    await localDeploy();
  });

  it('should validate bomb box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.BOMB].pass;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.validateBomb(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should invalidate bomb box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.BOMB].fail;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.invalidateBomb(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should validate wall box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.WALL].pass;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.validateWall(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should invalidate wall box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.WALL].fail;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.invalidateWall(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should validate empty box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.EMPTY].pass;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.validateEmpty(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should invalidate empty box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.EMPTY].fail;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.invalidateEmpty(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should validate source box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.SOURCE].pass;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.validateSource(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should invalidate source box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.SOURCE].fail;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.invalidateSource(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should validate split box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.SPLIT].pass;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.validateSplit(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should invalidate split box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.SPLIT].fail;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.invalidateSplit(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should validate scatter box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.SCATTER].pass;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.validateScatter(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });

  it('should invalidate scatter box', async () => {
    await localDeploy();

    const testcase = cases[ITEM.SCATTER].fail;
    const box = new Box({
      ins: testcase.ins.map((i) => Bool(i)),
      outs: testcase.outs.map((o) => Bool(o)),
      item: Field(testcase.item),
      itemDir: Field(testcase.itemDir),
    });

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.invalidateScatter(box);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });
});
