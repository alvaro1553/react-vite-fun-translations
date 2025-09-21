import { Env } from "./Env";

/**
 * Throw an Error if `condition` is falsy, stripping the message from production.
 *
 * The message is built concatenating `msg` and `values` using {@link JSON.stringify} for each value.
 */
export function invariant(condition: unknown, msg?: string, ...values: unknown[]): asserts condition {
  if (condition) {
    return;
  }

  let message = 'Invariant';

  if (Env.NO_PROD && msg !== undefined) {
    message += `: ${msg} ${values.map(v => JSON.stringify(v)).join(' ')}`
  }

  throw new Error(message)
}