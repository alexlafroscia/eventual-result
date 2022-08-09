import { type Option } from "./option.ts";
import { Err, type Result } from "../result/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

class NoneImpl implements Option<never> {
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

  andThen(): NoneImpl {
    return this;
  }

  map(): NoneImpl {
    return this;
  }

  mapOr<U>(fallback: U): U {
    return fallback;
  }

  mapOrElse<U>(fallback: () => U): U {
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
    return new Err(err);
  }

  okOrElse<E>(err: () => E): Result<never, E> {
    return new Err(err());
  }
}

/**
 * Represents no value in an `Option<T>`
 */
export const None = new NoneImpl();

/**
 * Determines whether an `Option<T>` is `None`
 */
export function isNone(option: Option<unknown>): option is NoneImpl {
  return option === None;
}
