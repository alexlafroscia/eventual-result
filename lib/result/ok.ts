import { type Result } from "./result.ts";
import { None, type Option, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

class OkImpl<T> implements Result<T, never> {
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

  expect(_message: string): T {
    return this.val;
  }

  unwrapErr(): never {
    throw new UnwrapError("Cannot unwrap `Ok` to `Err`", { cause: this.val });
  }

  expectErr(message: string): never {
    throw new ExpectError(message, { cause: this.val });
  }

  andThen<U, E>(op: (value: T) => Result<U, E>): Result<U, E> {
    return op(this.val);
  }

  map<U>(op: (value: T) => U): Result<U, never> {
    return Ok(op(this.val));
  }

  mapErr<E = never, F = never>(_op: (value: E) => F): Result<T, never> {
    return this;
  }

  mapOr<U>(_fallback: U, op: (value: T) => U): U {
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

  get [Symbol.toStringTag]() {
    return "Ok";
  }
}

export function Ok<T>(value: T): OkImpl<T> {
  return new OkImpl(value);
}
