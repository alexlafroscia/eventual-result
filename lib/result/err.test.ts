import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "../test-deps.ts";
import { Err } from "./err.ts";
import { None, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

Deno.test("#isOk", () => {
  const err = Err("whatever");

  assertEquals(err.isOk, false);
});

Deno.test("#isErr", () => {
  const err = Err("whatever");

  assertEquals(err.isErr, true);
});

Deno.test("#unwrap", () => {
  const err = Err("whatever");

  assertThrows(() => {
    err.unwrap();
  }, UnwrapError);
});

Deno.test("#expect", () => {
  const err = Err("whatever");

  assertThrows(
    () => {
      err.expect("My Message");
    },
    ExpectError,
    "My Message",
  );
});

Deno.test("unwrapErr", () => {
  const err = Err("whatever");

  assertEquals(err.unwrapErr(), "whatever");
});

Deno.test("#expectErr", () => {
  const err = Err("whatever");

  assertEquals(err.expectErr("My Message"), "whatever");
});

Deno.test("#andThen", () => {
  const err = Err("whatever");
  const afterOp = err.andThen(() => Err("A different error"));

  assertStrictEquals(err, afterOp, "The operation was not performed");
});

Deno.test("#map", () => {
  const err = Err("whatever").map((value: string) => value.length);

  assertStrictEquals(err, err);
});

Deno.test("#mapErr", () => {
  const err = Err("whatever").mapErr((value) => `${value}!`);

  assertEquals(err, Err("whatever!"));
});

Deno.test("#mapOr", () => {
  const lengthOrDefault = Err("whatever").mapOr(
    0,
    (value: string) => value.length,
  );

  assertEquals(lengthOrDefault, 0);
});

Deno.test("#and", () => {
  const err = Err("foo");
  const result = err.and(Err("bar"));

  assertStrictEquals(result, err);
});

Deno.test("#or", () => {
  const err = Err("foo");
  const result = err.or(Err("bar"));

  assertEquals(result, Err("bar"));
});

Deno.test("#orElse", () => {
  const err = Err("foo");
  const result = err.orElse(() => Err("bar"));

  assertEquals(result, Err("bar"));
});

Deno.test("#ok", () => {
  const err = Err("whatever");

  assertEquals(err.ok(), None);
});

Deno.test("#err", () => {
  const err = Err("whatever");

  assertEquals(err.err(), Some("whatever"));
});
