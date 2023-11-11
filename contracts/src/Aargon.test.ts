import { ZkAargon } from './Aargon';

import { PrivateKey, PublicKey, Mina, AccountUpdate } from 'o1js';

// TODO: test

describe('Aargon', () => {
  let zkApp: ZkAargon,
    zkAppPrivateKey: PrivateKey,
    zkAppAddress: PublicKey,
    sudoku: number[][],
    sender: PublicKey,
    senderKey: PrivateKey;

  beforeEach(async () => {
    let Local = Mina.LocalBlockchain({ proofsEnabled: false });
    Mina.setActiveInstance(Local);
    sender = Local.testAccounts[0].publicKey;
    senderKey = Local.testAccounts[0].privateKey;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ZkAargon(zkAppAddress);
  });

  it('accepts small example', async () => {
    await deploy(zkApp, zkAppPrivateKey, sudoku, sender, senderKey);

    let isSolved = zkApp.isSolved.get().toBoolean();
    expect(isSolved).toBe(false);

    if (solution === undefined) throw Error('cannot happen');
    let tx = await Mina.transaction(sender, () => {
      let zkApp = new ZkAargon(zkAppAddress);
      // zkApp.submitSolution(Sudoku.from(sudoku), Sudoku.from(solution!));
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
  sudoku: number[][],
  sender: PublicKey,
  senderKey: PrivateKey
) {
  let tx = await Mina.transaction(sender, () => {
    AccountUpdate.fundNewAccount(sender);
    zkApp.deploy();
    zkApp.update(Sudoku.from(sudoku));
  });
  await tx.prove();
  // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
  await tx.sign([zkAppPrivateKey, senderKey]).send();
}
