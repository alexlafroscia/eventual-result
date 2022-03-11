import { type ResultMethods } from "./methods.ts";
import { type Result } from "./result.ts";
import { EventualResult } from "./eventual.ts";
import { None, type Option, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

export class Err<E> implements ResultMethods<never, E> {
  readonly isOk = false;
  readonly isErr = true;

  constructor(private val: E) {}

  unwrap(): never {
    throw new UnwrapError("Cannot unwrap `Err`", { cause: this.val });
  }

  unwrapOr<T>(fallback: T): T {
    return fallback;
  }

  expect(message: string): never {
    throw new ExpectError(message, { cause: this.val });
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
    return Some(this.val);
  }

  eventually(): EventualResult<never, E> {
    return new EventualResult<never, E>(Promise.resolve(this));
  }

  get [Symbol.toStringTag]() {
    return "Err";
  }
}
