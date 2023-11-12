import { ZkAargon } from './Aargon';

import { PrivateKey, PublicKey, Mina, AccountUpdate } from 'o1js';
import { caseToProvable } from './utils/board';
import { SMALL_EXAMPLE } from './test/board';
import { BoardCaseProvable } from './test/board/common';

describe('Aargon', () => {
  let zkApp: ZkAargon,
    zkAppPrivateKey: PrivateKey,
    zkAppAddress: PublicKey,
    sender: PublicKey,
    senderKey: PrivateKey;

  let smallCase: BoardCaseProvable;

  beforeEach(async () => {
    let Local = Mina.LocalBlockchain({ proofsEnabled: false });
    Mina.setActiveInstance(Local);
    sender = Local.testAccounts[0].publicKey;
    senderKey = Local.testAccounts[0].privateKey;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ZkAargon(zkAppAddress);

    // test cases
    smallCase = caseToProvable(SMALL_EXAMPLE);
  });

  it('accepts small example', async () => {
    await deploy(
      zkApp,
      zkAppPrivateKey,
      smallCase.board,
      smallCase.items,
      sender,
      senderKey
    );

    let isSolved = zkApp.isSolved.get().toBoolean();
    expect(isSolved).toBe(false);

    if (smallCase === undefined) throw Error('cannot happen');
    let tx = await Mina.transaction(sender, () => {
      zkApp.solve(smallCase.board, smallCase.solution);
    });
    await tx.prove();
    await tx.sign([senderKey]).send();

    isSolved = zkApp.isSolved.get().toBoolean();
    expect(isSolved).toBe(true);
  });
});

async function deploy(
  zkApp: ZkAargon,
  zkAppPrivateKey: PrivateKey,
  board: BoardCaseProvable['board'],
  inventory: BoardCaseProvable['items'],
  sender: PublicKey,
  senderKey: PrivateKey
) {
  let tx = await Mina.transaction(sender, () => {
    AccountUpdate.fundNewAccount(sender);
    zkApp.deploy();
    zkApp.update(board, inventory);
  });
  await tx.prove();
  // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
  await tx.sign([zkAppPrivateKey, senderKey]).send();
}
