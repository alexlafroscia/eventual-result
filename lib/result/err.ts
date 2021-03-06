import { type Result } from "./result.ts";
import { type Ok } from "./ok.ts";
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

  isOk(): this is Ok<never> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

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

  or<T>(other: Result<T, E>): Result<T, E> {
    return other;
  }

  orElse<T>(other: () => Result<T, E>): Result<T, E> {
    return other();
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
