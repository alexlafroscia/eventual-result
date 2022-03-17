import { type ResultMethods } from "./methods.ts";
import { type Result } from "./result.ts";
import { EventualResult } from "./eventual.ts";
import { None, type Option, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

/**
 * Contains the success value of a `Result<T, E>`
 *
 * @template T The type of the success value
 */
export class Ok<T> implements ResultMethods<T, never> {
  readonly isOk = true;
  readonly isErr = false;

  constructor(private val: T) {}

  unwrap(): T {
    return this.val;
  }

  unwrapOr(): T {
    return this.val;
  }

  expect(_message: string): T {
    return this.val;
  }

  unwrapErr(): never {
    throw new UnwrapError("Cannot unwrap `Ok` to `Err`", this.val);
  }

  expectErr(message: string): never {
    throw new ExpectError(message, this.val);
  }

  andThen<U, E, OpResult extends Result<U, E>>(
    op: (value: T) => OpResult,
  ): OpResult {
    return op(this.val);
  }

  map<U>(op: (value: T) => U): Result<U, never> {
    return new Ok(op(this.val));
  }

  mapErr(): Ok<T> {
    return this;
  }

  mapOr<U>(_fallback: U, op: (value: T) => U): U {
    return op(this.val);
  }

  mapOrElse<U>(_fallback: () => U, op: (value: T) => U): U {
    return op(this.val);
  }

  and<E>(other: Result<T, E>): Result<T, E> {
    return other;
  }

  or<E>(_other: Result<T, E>): Result<T, E> {
    return this;
  }

  orElse<E>(_other: () => Result<T, E>): Result<T, E> {
    return this;
  }

  ok(): Option<T> {
    return new Some(this.val);
  }

  err(): Option<never> {
    return None;
  }

  eventually(): EventualResult<T, never> {
    return new EventualResult<T, never>(Promise.resolve(this));
  }

  get [Symbol.toStringTag]() {
    return "Ok";
  }
}
