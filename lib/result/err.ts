import { type ResultMethods } from "./methods.ts";
import { type Result } from "./result.ts";
import { None, type Option, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

export class ErrImpl<E> implements ResultMethods<never, E> {
  readonly isOk = false;
  readonly isErr = true;

  /**
   * The error being wrapped by the `Result`
   */
  private val: E;

  constructor(value: E) {
    this.val = value;
  }

  unwrap(): never {
    throw new UnwrapError("Cannot unwrap `Err`", { cause: this.val });
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

  andThen(): ErrImpl<E> {
    return this;
  }

  map(): ErrImpl<E> {
    return this;
  }

  mapErr<F>(op: (error: E) => F): ErrImpl<F> {
    return Err(op(this.val));
  }

  mapOr<U>(fallback: U, _op: (value: never) => U): U {
    return fallback;
  }

  and<T>(_other: Result<T, E>): ErrImpl<E> {
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

  get [Symbol.toStringTag]() {
    return "Err";
  }
}

export function Err<E>(value: E): ErrImpl<E> {
  return new ErrImpl(value);
}
