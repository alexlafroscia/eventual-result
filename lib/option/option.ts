import { type Some } from "./some.ts";
import { type None } from "./none.ts";
import { type Result } from "../result/mod.ts";

export interface Option<T> {
  isSome(): this is Some<T>;
  isNone(): this is typeof None;

  unwrap(): T;
  unwrapOr(fallback: T): T;
  unwrapOrElse(fallback: () => T): T;

  expect(message: string): T;

  andThen<U>(op: (value: T) => Option<U>): Option<U>;

  map<U>(op: (value: T) => U): Option<U>;
  mapOr<U>(fallback: U, op: (value: T) => U): U;
  mapOrElse<U>(fallback: () => U, op: (value: T) => U): U;

  and(other: Option<T>): Option<T>;

  or(other: Option<T>): Option<T>;
  orElse(other: () => Option<T>): Option<T>;

  okOr<E>(err: E): Result<T, E>;
  okOrElse<E>(err: () => E): Result<T, E>;
}
