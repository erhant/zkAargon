import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Poseidon,
  Bool,
} from 'o1js';
import { Box, ITEM } from './Box';
import { DIR, DIRType } from './utils/Direction';

// TODO: add ownership?

// TODO: make dimensions flexible?
const [ROWS, COLS] = [10, 10];

export class ZkAargon extends SmartContract {
  @state(Field) boardHash = State<Field>();
  @state(Bool) isSolved = State<Bool>();

  init() {
    super.init();
  }

  /** Utility function to hash a board. For each box, item and itemDir is used. */
  private hashBoard(board: Box[]) {
    return Poseidon.hash(board.map((b) => [b.item, b.itemDir]).flat());
  }

  @method solve(board: Box[], solution: Box[]) {
    // solution boxes should all be valid boxes
    solution.forEach((box) => box.assertBox());

    // solution boxes should be connected correctly
    solution.forEach((box, i) => {
      const connections: [number, DIRType][] = [
        [i - COLS - 1, DIR.TOP_LEFT],
        [i - COLS, DIR.TOP],
        [i - COLS + 1, DIR.TOP_RIGHT],
        [i - 1, DIR.LEFT],
        [i + 1, DIR.RIGHT],
        [i + COLS - 1, DIR.BOTTOM_LEFT],
        [i + COLS, DIR.BOTTOM],
        [i + COLS + 1, DIR.BOTTOM_RIGHT],
      ];

      connections
        .filter((conn) => conn[0] >= 0 && conn[0] < solution.length)
        .forEach((conn) => box.assertConnection(solution[conn[0]], conn[1]));
    });

    // on none-empty boxes, board and solution must match
    solution.forEach((box, i) =>
      box.item
        // either the box is empty, in which case we ignore
        .equals(ITEM.EMPTY)
        // or, is its not empty; then it should match the box
        // at the given board
        .or(
          box.item
            .equals(board[i].item)
            .and(box.itemDir.equals(board[i].itemDir))
        )
        .assertTrue('solution & board has a box mismatch at index ' + i)
    );

    // board hash should be correct
    const boardHash = this.boardHash.getAndAssertEquals();
    this.hashBoard(board).assertEquals(boardHash, 'board hashes do not match');

    // all checks passed
    this.isSolved.set(Bool(true));
  }

  /** Updates the on-chain hash with a new board, and sets `isSolved` to false. */
  @method update(board: Box[]) {
    this.boardHash.set(this.hashBoard(board));
    this.isSolved.set(Bool(false));
  }
}
