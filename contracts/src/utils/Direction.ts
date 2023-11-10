type DirectionValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** A direction of a box.
 *
 * ```c
 * topleft---top---topright
 * |                   |
 * left               right
 * |                   |
 * botleft---bot---botright
 * ```
 */
export class DIR {
  static TOP_LEFT = 0 as const;
  static TOP = 1 as const;
  static TOP_RIGHT = 2 as const;
  static RIGHT = 3 as const;
  static BOTTOM_RIGHT = 4 as const;
  static BOTTOM = 5 as const;
  static BOTTOM_LEFT = 6 as const;
  static LEFT = 7 as const;

  /** Shorthand to get all directions as an array. */
  static ALL = [
    DIR.TOP_LEFT,
    DIR.TOP,
    DIR.TOP_RIGHT,
    DIR.RIGHT,
    DIR.BOTTOM_RIGHT,
    DIR.BOTTOM,
    DIR.BOTTOM_LEFT,
    DIR.LEFT,
  ] as const;

  /** Iterator over direction values. */
  static *[Symbol.iterator]() {
    yield DIR.TOP_LEFT;
    yield DIR.TOP;
    yield DIR.TOP_RIGHT;
    yield DIR.RIGHT;
    yield DIR.BOTTOM_RIGHT;
    yield DIR.BOTTOM;
    yield DIR.BOTTOM_LEFT;
    yield DIR.LEFT;
  }

  /** Map a direction to an opposite direction */
  static opposite(dir: DirectionValues) {
    return {
      [DIR.TOP_LEFT]: DIR.BOTTOM_RIGHT,
      [DIR.TOP]: DIR.BOTTOM,
      [DIR.TOP_RIGHT]: DIR.BOTTOM_LEFT,
      [DIR.RIGHT]: DIR.LEFT,
      [DIR.BOTTOM_RIGHT]: DIR.TOP_LEFT,
      [DIR.BOTTOM]: DIR.TOP,
      [DIR.BOTTOM_LEFT]: DIR.TOP_RIGHT,
      [DIR.LEFT]: DIR.RIGHT,
    }[dir];
  }
}
