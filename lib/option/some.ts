import { type OptionMethods } from "./methods.ts";
import { type Option } from "./option.ts";
import { Ok, type Result } from "../result/mod.ts";

/**
 * Contains the value of an `Option<T>`
 *
 * @template T The type of the present value
 */
export class Some<T> implements OptionMethods<T> {
  readonly isSome = true;

  readonly isNone = false;

  constructor(private val: T) {}

  unwrap(): T {
    return this.val;
  }

  unwrapOr(_fallback: T): T {
    return this.val;
  }

  unwrapOrElse(_fallback: () => T): T {
    return this.val;
  }

  expect(_message: string): T {
    return this.val;
  }

  andThen<U>(op: (value: T) => Option<U>): Option<U> {
    return op(this.val);
  }

  map<U>(op: (value: T) => U): Some<U> {
    return new Some(op(this.val));
  }

  mapOr<U>(_fallback: U, op: (value: T) => U): U {
    return op(this.val);
  }

  mapOrElse<U>(_fallback: () => U, op: (value: T) => U): U {
    return op(this.val);
  }

  and(other: Option<T>): Option<T> {
    return other;
  }

  or(_other: Option<T>): Option<T> {
    return this;
  }

  orElse(_other: () => Option<T>): Option<T> {
    return this;
  }

  okOr<E>(_err: E): Result<T, E> {
    return new Ok(this.val);
  }

  okOrElse<E>(_err: () => E): Result<T, E> {
    return new Ok(this.val);
  }
}
