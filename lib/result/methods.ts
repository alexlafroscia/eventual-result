import { type Option } from "../option/mod.ts";
import { type Result } from "./result.ts";
import { type EventualResult } from "./eventual.ts";

/**
 * `Result` is a type that represents either success (`Ok`) or failure (`Err`)
 */
export interface ResultMethods<T, E> {
  /**
   * Is `true` is the result is `Ok`
   */
  readonly isOk: boolean;

  /**
   * Is `true` is the result is `Err`
   */
  readonly isErr: boolean;

  /**
   * Returns the inner value if the `Result` is an `Ok`
   *
   * Throws an `UnwrapError` if the `Result` is an `Err`
   */
  unwrap(): T;

  /**
   * Returns the inner value if the `Result` is an `Ok`
   *
   * Otherwise, returns the fallback value
   */
  unwrapOr(fallback: T): T;

  /**
   * Returns the inner value if the `Result` is an `Ok`
   *
   * Throws an `ExpectError` with the given message if the `Result` is an `Err`
   */
  expect(message: string): T;

  /**
   * Returns the inner value if the `Result` is an `Err`
   *
   * Throws an `UnwrapError` if the `Result` is an `Ok`
   */
  unwrapErr(): E;

  /**
   * Returns the inner value if the `Result` is an `Err`
   *
   * Throws an `ExpectError` with the given message if the `Result` is an `Ok`
   */
  expectErr(message: string): E;

  /**
   * Transforms an `Ok` of one value into an `Ok` of another value
   *
   * If the `Result` is instead an `Err`, the `Err` is just passed along
   *
   * This can be used for control flow by allowing you to operate on just `Ok`
   * values while safely ignoring `Err`s
   */
  andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by apply the function to an `Ok` value
   *
   * If the result is instead an `Err`, the value is not touched.
   *
   * This function can be used to compose the results of two functions.
   */
  map<U>(op: (value: T) => U): Result<U, E>;

  /**
   * Maps a `Result<T, E> to `Result<T, F>` by apply the function to an `Err` value
   *
   * If the result is instead an `Ok`, the value is not touched.
   *
   * This function can be used to create a new `Result` with a different `Err` representation.
   */
  mapErr<F>(op: (error: E) => F): Result<T, F>;

  /**
   * Returns the provided default if `Err`, otherwise applies the function to the contained
   * value of `Ok`.
   */
  mapOr<U>(fallback: U, op: (value: T) => U): U;

  /**
   * Returns the result of the `fallback` operation if `Err`, otherwise applies the `op`
   * to the contained value of `Ok`.
   */
  mapOrElse<U>(fallback: () => U, op: (value: T) => U): U;

  /**
   * Returns `other` if the result is `Ok`, otherwise returns itself
   */
  and(other: Result<T, E>): Result<T, E>;

  /**
   * Returns `other` if the result is `Err`, otherwise returns itself
   */
  or(other: Result<T, E>): Result<T, E>;

  /**
   * Returns the returned value of `other` if the result is `Err`, otherwise
   * returns itself
   *
   * This might be used instead of `#or` if the alternative is costly to compute,
   * since the `other` function is only evaluated if needed.
   */
  orElse(other: () => Result<T, E>): Result<T, E>;

  /**
   * Converts from `Result<T, E>` to `Option<T>`
   *
   * If the `Result` is an `Err`, the value is discarded
   */
  ok(): Option<T>;

  /**
   * Converts from `Result<T, E>` to `Option<E>`
   *
   * If the `Result` is an `Ok`, the value is discarded
   */
  err(): Option<E>;

  /**
   * Converts from `Result<T, E>` to `EventualResult<T, E>` so that
   * asynchronous actions can be applied to a `Result<T, E>`
   */
  eventually(): EventualResult<T, E>;
}
