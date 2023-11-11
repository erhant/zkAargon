import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  SmartContract,
  state,
  method,
  State,
  Bool,
  Provable,
} from 'o1js';
import { AllBoxes, Box, ITEM } from './Box';
import { BombBox } from './boxes/Bomb';
import { CaseType, cases } from './test/cases';
import { WallBox } from './boxes/Wall';
import { EmptyBox } from './boxes/Empty';
import { MirrorBox } from './boxes/Mirror';
import { SourceBox } from './boxes/Source';

// NOTE: interesting things about this test:
// - giving a union type to `box` in the contract causes
// it to be seen as "non provable" type?
// - giving abstract type also causes problem for `isValid` not being a function
// - looping over cases one by one is also a problem, Mina bugs out on typecheck

export class BoxTester extends SmartContract {
  init() {
    super.init();
  }

  @method validateBomb(box: BombBox) {
    box.isValid().assertTrue();
  }

  @method invalidateBomb(box: BombBox) {
    box.isValid().assertFalse();
  }

  @method validateWall(box: WallBox) {
    box.isValid().assertTrue();
  }

  @method invalidateWall(box: WallBox) {
    box.isValid().assertFalse();
  }

  @method validateEmpty(box: EmptyBox) {
    box.isValid().assertTrue();
  }

  @method invalidateEmpty(box: EmptyBox) {
    box.isValid().assertFalse();
  }

  @method validateMirror(box: MirrorBox) {
    box.isValid().assertTrue();
  }

  @method invalidateMirror(box: MirrorBox) {
    box.isValid().assertFalse();
  }

  @method validateSource(box: SourceBox) {
    box.isValid().assertTrue();
  }

  @method invalidateSource(box: SourceBox) {
    box.isValid().assertFalse();
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
    const box = new BombBox({
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
    const box = new BombBox({
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
    const box = new WallBox({
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
    const box = new WallBox({
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
    const box = new EmptyBox({
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
    const box = new EmptyBox({
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
});
