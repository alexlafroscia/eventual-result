import { type Option } from "../option/mod.ts";
import { Ok } from "./ok.ts";
import { Err } from "./err.ts";

/**
 * `Result` is a type that represents either success (`Ok`) or failure (`Err`)
 */
export abstract class Result<T, E> {
  /**
   * Combine an iterable of `Result<T, E>` into a single `Result<T[], E>`
   *
   * If each member of the iterable is `Ok`, then a single `Result` is
   * returned that contains an array of all `Ok` values.
   *
   * If any member is an `Err`, then that member is returned.
   */
  static all<T, E>(results: Iterable<Result<T, E>>): Result<T[], E> {
    const collection = [];

    for (const result of results) {
      if (result.isOk()) {
        collection.push(result.unwrap());
      } else {
        // @ts-expect-error the `T` generics do not align (single vs array) but it doesn't matter
        return result;
      }
    }

    return Ok(collection);
  }

  /**
   * Combine an iterable of `Result<T, E>` into a single `Result<T, E[]>`
   *
   * The first `Ok` member of the iterable will be returned.
   *
   * If each member of the iterable is `Err`, then a single `Result` is
   * returned that contains an array of all `Err` values.
   */
  static any<T, E>(results: Iterable<Result<T, E>>): Result<T, E[]> {
    const collection = [];

    for (const result of results) {
      if (result.isErr()) {
        collection.push(result.unwrapErr());
      } else {
        // @ts-expect-error the `E` generics do not align (single vs array) but it doesn't matter
        return result;
      }
    }

    return Err(collection);
  }

  /**
   * Returns `true` is the result is `Ok`
   */
  abstract isOk(): boolean;

  /**
   * Returns `true` is the result is `Err`
   */
  abstract isErr(): boolean;

  /**
   * Returns the inner value if the `Result` is an `Ok`
   *
   * Throws an `UnwrapError` if the `Result` is an `Err`
   */
  abstract unwrap(): T;

  /**
   * Returns the inner value if the `Result` is an `Ok`
   *
   * Throws an `ExpectError` with the given message if the `Result` is an `Err`
   */
  abstract expect(message: string): T;

  /**
   * Returns the inner value if the `Result` is an `Err`
   *
   * Throws an `UnwrapError` if the `Result` is an `Ok`
   */
  abstract unwrapErr(): E;

  /**
   * Returns the inner value if the `Result` is an `Err`
   *
   * Throws an `ExpectError` with the given message if the `Result` is an `Ok`
   */
  abstract expectErr(message: string): E;

  /**
   * Transforms an `Ok` of one value into an `Ok` of another value
   *
   * If the `Result` is instead an `Err`, the `Err` is just passed along
   *
   * This can be used for control flow by allowing you to operate on just `Ok`
   * values while safely ignoring `Err`s
   */
  abstract andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Maps a `Result<T, E> to `Result<U, E>` by apply the function to an `Ok` value
   *
   * If the result is instead an `Err`, the value is not touched.
   *
   * This function can be used to compose the results of two functions.
   */
  abstract map<U>(op: (value: T) => U): Result<U, E>;

  /**
   * Maps a `Result<T, E> to `Result<T, F>` by apply the function to an `Err` value
   *
   * If the result is instead an `Ok`, the value is not touched.
   *
   * This function can be used to create a new `Result` with a different `Err` representation.
   */
  abstract mapErr<F>(op: (error: E) => F): Result<T, F>;

  /**
   * Returns the provided default if `Err`, otherwise applies the function to the contained
   * value of `Ok`.
   */
  abstract mapOr<U>(fallback: U, op: (value: T) => U): U;

  /**
   * Returns `other` if the result is `Ok`, otherwise returns itself
   */
  abstract and(other: Result<T, E>): Result<T, E>;

  /**
   * Returns `other` if the result is `Err`, otherwise returns itself
   */
  abstract or(other: Result<T, E>): Result<T, E>;

  /**
   * Returns the returned value of `other` if the result is `Err`, otherwise
   * returns itself
   *
   * This might be used instead of `#or` if the alternative is costly to compute,
   * since the `other` function is only evaluated if needed.
   */
  abstract orElse(other: () => Result<T, E>): Result<T, E>;

  /**
   * Converts from `Result<T, E>` to `Option<T>`
   *
   * If the `Result` is an `Err`, the value is discarded
   */
  abstract ok(): Option<T>;

  /**
   * Converts from `Result<T, E>` to `Option<E>`
   *
   * If the `Result` is an `Ok`, the value is discarded
   */
  abstract err(): Option<E>;
}
