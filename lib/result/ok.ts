import { type ResultMethods } from "./methods.ts";
import { type Result } from "./result.ts";
import { EventualResult } from "./eventual.ts";
import { None, type Option, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

export class OkImpl<T> implements ResultMethods<T, never> {
  readonly isOk = true;
  readonly isErr = false;

  /**
   * The value being wrapped by the `Result`
   */
  private val: T;

  constructor(value: T) {
    this.val = value;
  }

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
    throw new UnwrapError("Cannot unwrap `Ok` to `Err`", { cause: this.val });
  }

  expectErr(message: string): never {
    throw new ExpectError(message, { cause: this.val });
  }

  andThen<U, E, OpResult extends Result<U, E>>(
    op: (value: T) => OpResult,
  ): OpResult {
    return op(this.val);
  }

  map<U>(op: (value: T) => U): Result<U, never> {
    return Ok(op(this.val));
  }

  mapErr(): OkImpl<T> {
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
    return Some(this.val);
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

export function Ok<T>(value: T): OkImpl<T> {
  return new OkImpl(value);
}
