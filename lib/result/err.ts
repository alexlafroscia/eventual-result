import { type Result } from "./result.ts";
import { EventualResult } from "./eventual.ts";
import { None, type Option, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

/**
 * Contains the error value of a `Result<T, E>`
 *
 * @template E The type of the error value
 */
export class Err<E> implements Result<never, E> {
  constructor(private val: E) {}

  unwrap(): never {
    throw new UnwrapError("Cannot unwrap `Err`", this.val);
  }

  unwrapOr<T>(fallback: T): T {
    return fallback;
  }

  expect(message: string): never {
    throw new ExpectError(message, this.val);
  }

  unwrapErr(): E {
    return this.val;
  }

  expectErr(_message: string): E {
    return this.val;
  }

  andThen(): Err<E> {
    return this;
  }

  map(): Err<E> {
    return this;
  }

  mapErr<F>(op: (error: E) => F): Err<F> {
    return new Err(op(this.val));
  }

  mapOr<U>(fallback: U, _op: (value: never) => U): U {
    return fallback;
  }

  mapOrElse<U>(fallback: () => U, _op: (value: never) => U): U {
    return fallback();
  }

  and<T>(_other: Result<T, E>): Err<E> {
    return this;
  }

  or<T, F>(other: Result<T, F>): Result<T, F> {
    return other;
  }

  orElse<T, F>(other: (val: E) => Result<T, F>): Result<T, F> {
    return other(this.val);
  }

  ok(): Option<never> {
    return None;
  }

  err(): Option<E> {
    return new Some(this.val);
  }

  eventually(): EventualResult<never, E> {
    return new EventualResult<never, E>(Promise.resolve(this));
  }

  get [Symbol.toStringTag]() {
    return "Err";
  }
}

/**
 * Determines whether a `Result<T, E>` is `Err<E>`
 */
export function isErr<E>(result: Result<unknown, E>): result is Err<E> {
  return result instanceof Err;
}
