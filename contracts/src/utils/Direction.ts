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
export enum DIR {
  TOP_LEFT,
  TOP,
  TOP_RIGHT,
  RIGHT,
  BOTTOM_RIGHT,
  BOTTOM,
  BOTTOM_LEFT,
  LEFT,
}

/** An array of all directions, from top-left clockwise. */
export const DIR_ALL = [
  DIR.TOP_LEFT,
  DIR.TOP,
  DIR.TOP_RIGHT,
  DIR.RIGHT,
  DIR.BOTTOM_RIGHT,
  DIR.BOTTOM,
  DIR.BOTTOM_LEFT,
  DIR.LEFT,
] as const;

/** Default direction, 0. */
export const DEFAULT_DIR = DIR.TOP_LEFT;
