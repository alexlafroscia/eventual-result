import { type Option } from "./option.ts";
import { Err, type Result } from "../result/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

class NoneImpl implements Option<never> {
  readonly isSome = false;
  readonly isNone = true;

  unwrap(): never {
    throw new UnwrapError("Cannot unwrap `None`");
  }

  unwrapOr<T>(fallback: T): T {
    return fallback;
  }

  unwrapOrElse<T>(fallback: () => T): T {
    return fallback();
  }

  expect(message: string): never {
    throw new ExpectError(message);
  }

  andThen<T, U>(_op: (value: T) => Option<U>): NoneImpl {
    return this;
  }

  map<T, U>(_op: (value: T) => U): NoneImpl {
    return this;
  }

  mapOr<T, U>(fallback: U, _op: (value: T) => U): U {
    return fallback;
  }

  mapOrElse<T, U>(fallback: () => U, _op: (value: T) => U): U {
    return fallback();
  }

  and<T>(_other: Option<T>): NoneImpl {
    return this;
  }

  or<T>(other: Option<T>): Option<T> {
    return other;
  }

  orElse<T>(other: () => Option<T>): Option<T> {
    return other();
  }

  okOr<E>(err: E): Result<never, E> {
    return Err(err);
  }

  okOrElse<E>(err: () => E): Result<never, E> {
    return Err(err());
  }
}

export const None = new NoneImpl();
