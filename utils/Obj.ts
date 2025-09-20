/**
 * Objects whose constructor is `Object`.
 *
 * - assignable: plain objects {}
 * - not assignable: primitives (string, symbol, number, bigint, boolean, undefined, null),
 *   functions and non-plain objects ([], set, map, date, etc.)
 *
 * Warning! Object.create(null) is assignable, but It's excluded by {@link Obj.isPlainObject}.
 * By definition, only objects whose constructor is `Object` are plain-objects.
 */
export type PlainObject = { [k: PropertyKey]: unknown };

export const Obj = {
  /**
   * Check whether a value is a {@link PlainObject}.
   */
  isPlainObject(value: unknown): value is PlainObject {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      value.constructor === Object
    );
  },
}