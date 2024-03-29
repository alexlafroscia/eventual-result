import { type Result } from "./result.ts";
import { isOk, Ok } from "./ok.ts";
import { Err, isErr } from "./err.ts";

/**
 * Combine an iterable of `Result<T, E>` into a single `Result<T[], E>`
 *
 * If each member of the iterable is `Ok`, then a single `Result` is
 * returned that contains an array of all `Ok` values.
 *
 * If any member is an `Err`, then that member is returned.
 */
export function all<T, E>(results: Iterable<Result<T, E>>): Result<T[], E> {
  const collection = [];

  for (const result of results) {
    if (isOk(result)) {
      collection.push(result.unwrap());
    }

    if (isErr(result)) {
      return result;
    }
  }

  return new Ok(collection);
}

/**
 * Combine an iterable of `Result<T, E>` into a single `Result<T, E[]>`
 *
 * The first `Ok` member of the iterable will be returned.
 *
 * If each member of the iterable is `Err`, then a single `Result` is
 * returned that contains an array of all `Err` values.
 */
export function any<T, E>(results: Iterable<Result<T, E>>): Result<T, E[]> {
  const collection = [];

  for (const result of results) {
    if (isErr(result)) {
      collection.push(result.unwrapErr());
    }

    if (isOk(result)) {
      return result;
    }
  }

  return new Err(collection);
}
