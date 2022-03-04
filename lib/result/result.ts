import { type Option } from "../option/mod.ts";

export interface Result<T, E> {
  // Result state
  readonly isOk: boolean;
  readonly isErr: boolean;

  unwrap(): T;
  expect(message: string): T;

  unwrapErr(): E;
  expectErr(message: string): E;

  /**
   * Calls op if the result is Ok, otherwise returns the Err value of self.
   *
   * This function can be used for control flow based on Result values.
   */
  andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;

  map<U>(op: (value: T) => U): Result<U, E>;
  mapErr<F>(op: (error: E) => F): Result<T, F>;
  mapOr<U>(fallback: U, op: (value: T) => U): U;

  and(other: Result<T, E>): Result<T, E>;

  or(other: Result<T, E>): Result<T, E>;
  orElse(other: () => Result<T, E>): Result<T, E>;

  ok(): Option<T>;
  err(): Option<E>;

  [Symbol.toStringTag]: string;
}
