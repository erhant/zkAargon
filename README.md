# zkAargon

**zkAargon** is a toned-down remake of the 1999 game [Aargon](https://www.mobygames.com/game/3980/aargon/), for the [ZKHACK Istanbul hackathon](https://zkistanbul.com), where the objective is to prove a correct solution to a given puzzle, without revealing the solution.

## About the Game

[Aargon](https://www.mobygames.com/game/3980/aargon/) is a puzzle-game from 1999, where players are faced with challenges that include lasers and mirrors. The player is supposed to place correct items within a 2D board, such that the lasers are reflected, blocked, and combined with these to hit certain targets.

The number items that the player can place is given in the sidebar, and the game is usually played via dragging and dropping these items into correct places, and rotating them if need be.

Due to the time limits and the circuit complexities, our game is a toned-down version of the original Aargon game, in the following sense:

- The original game includes multiple colored lasers, for a total of 7 colors. Our game has a single colored laser.
- The original game allows items to stay in inventory, allowing for shorter solutions; in our game, all items must be used (related to board commitment, explained below).
- The original game includes many more items, some related to colors and some with more advanced mirroring capabilities. Our game contains 7 items:
  - **[Empty](./contracts/src/boxes/Empty.ts)**: An empty box, lasers simply propagate through.
  - **[Bomb](./contracts/src/boxes/Bomb.ts)**: No laser should touch this item.
  - **[Mirror](./contracts/src/boxes/Mirror.ts)**: A simple reflecting mirror.
  - **[Scatter](./contracts/src/boxes/Scatter.ts)**: A more advanced item where the laser can be split diagonally in two.
  - **[Split](./contracts/src/boxes/Split.ts)**: Another advanced item where the laser is split perpendicularly in two.
  - **[Target](./contracts/src/boxes/Target.ts)**: This item must have a laser going through itself, it is technically the objective. There can be multiple items.
  - **[Wall](./contracts/src/boxes/Wall.ts)**: No laser can pass through the wall.

The game board is shown as a 2D grid, where we refer to each cell as a "box". The player also has an inventory. specific to each puzzle, where they can only use the given items.

## Designing the Circuit

The entire game circuit has three parts:

- Proving boxes are valid.
- Proving correct items are used for the solution.
- Proving that the solution matches the board.

### Proving the Boxes

One major result of using a single laser color is that the entire game can be proven **almost** to be valid if all boxes are valid on their own. To prove correctness of a box, we treat the box as a struct that has 8 directions:

```c
topleft---top---topright
|                   |
left     item     right
|                   |
botleft---bot---botright
```

With these directions numbered from 0 to 7 starting at `topleft` and ending at `left`, we define the following:

- `ins`: 8 `Bool`s that indicate a laser going **in** to the box.
- `outs`: 8 `Bool`s that indicate a laser going **out** from the box.
- `item`: A field element representing the item id within the box.
- `itemDir`: A field element representing the direction that the item faces towards within the box.

With these definitions, we can prove the validity of each type of box. For example, a `Wall` box can not have any outgoing lasers, so we can simply `or` all the `outs` signals and expect the result to be `false`.

In the case of a `Wall`, the item direction does not matter; but, for items such as `Mirror`, we have to check the validity for each item direction, logically `and`ed by the actual item direction.

After proving all boxes, we must prove that their connections are correct; that is, the `out` laser of a box must be `in` to another box.

### Proving the Items

The player is given a set of items to play with, and the proof must adhere to this inventory. To prove this, the number of total items are hashed at the start. This assumes that all items MUST be used from the inventory to solve the puzzle, admittely a drawback for the gaming experience.

While validating the solution, all items are accumulated in a dictionary, and the item counts are hashed in a fixed order to obtain a single hash. This hash is compared to the original hash.

### Proving the Board

Similar to the Sudoku example, we must prove that the board matches the solution. For that, we check the non-empty items in the given board, and compare them to the same boxes in the solution.

## Usage

TODO: describe

## Testing

TODO: describe
