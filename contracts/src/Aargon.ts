import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Poseidon,
  Bool,
  Circuit,
  Provable,
} from 'o1js';
import { Box, BoxArray } from './Box';
import { DIR } from './utils/direction';
import { ITEM, ITEM_ALL, ItemCounts, itemsInitial } from './utils/item';

// TODO: make dimensions flexible?
const [ROWS, COLS] = [10, 10];

export class ZkAargon extends SmartContract {
  @state(Field) boardHash = State<Field>();
  @state(Field) itemHash = State<Field>();
  @state(Bool) isSolved = State<Bool>();

  init() {
    super.init();
  }

  /** Utility function to hash a board. For each box, item and itemDir is used. */
  private hashBoard(board: Box[]) {
    return Poseidon.hash(board.map((b) => [b.item, b.itemDir]).flat());
  }

  private hashItems(items: Record<ITEM, Field>) {
    return Poseidon.hash(
      ITEM_ALL.map((item) =>
        // ignore empty items
        Provable.if(Field(item).equals(ITEM.EMPTY), Field(0), items[item])
      )
    );
  }

  @method solve(board: BoxArray, solution: BoxArray) {
    Provable.log('proving boxes');
    // solution boxes should all be valid boxes
    solution.boxes.forEach((box, i) => {
      Provable.log('Proving box:', { i, item: box.item });
      box.assertBox();
    });

    // solution boxes should be connected correctly
    Provable.log('proving connections');
    solution.boxes.forEach((box, i) => {
      const connections: [number, DIR][] = [
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
        .filter((conn) => conn[0] >= 0 && conn[0] < solution.boxes.length)
        .forEach((conn) =>
          box.assertConnection(solution.boxes[conn[0]], conn[1])
        );
    });

    // on none-empty boxes, board and solution must match
    Provable.log('proving matching board and solution');
    solution.boxes.forEach((box, i) =>
      board.boxes[i].item
        // either the box is empty, in which case we ignore
        .equals(ITEM.EMPTY)
        // or, is its not empty; then it should match the box
        // at the given board
        .or(
          box.item
            .equals(board.boxes[i].item)
            .and(box.itemDir.equals(board.boxes[i].itemDir))
        )
        .assertTrue('solution & board has a box mismatch at index ' + i)
    );

    // item counts & thus their hash should be correct
    Provable.log('proving item counts');
    const items = itemsInitial();
    solution.boxes.forEach((box) => {
      ITEM_ALL.forEach(
        (item) =>
          (items[item] = items[item].add(box.item.equals(item).toField()))
      );
    });
    const itemHash = this.itemHash.getAndAssertEquals();
    this.hashItems(items).assertEquals(itemHash, 'item hashes do not match');

    // board hash should be correct
    Provable.log('proving board hash');
    const boardHash = this.boardHash.getAndAssertEquals();
    this.hashBoard(board.boxes).assertEquals(
      boardHash,
      'board hashes do not match'
    );

    // all checks passed
    this.isSolved.set(Bool(true));
  }

  /** Updates the on-chain hash with a new board, and sets `isSolved` to false. */
  @method update(board: BoxArray, items: ItemCounts) {
    this.boardHash.set(this.hashBoard(board.boxes));
    this.itemHash.set(this.hashItems(items));
    this.isSolved.set(Bool(false));
  }
}
