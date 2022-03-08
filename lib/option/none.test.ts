import { assertEquals, assertThrows } from "../test-deps.ts";
import { Some } from "./some.ts";
import { None } from "./none.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";
import { Err } from "../result/err.ts";

Deno.test("#isSome", () => {
  assertEquals(None.isSome(), false);
});

Deno.test("#isNone", () => {
  assertEquals(None.isNone(), true);
});

Deno.test("#unwrap", () => {
  assertThrows(() => None.unwrap(), UnwrapError);
});

Deno.test("#unwrapOr", () => {
  assertEquals(None.unwrapOr(2), 2);
});

Deno.test("#unwrapOrElse", () => {
  assertEquals(None.unwrapOrElse(() => 2), 2);
});

Deno.test("#expect", () => {
  assertThrows(() => None.expect("My Error"), ExpectError, "My Error");
});

Deno.test("andThen", () => {
  assertEquals(None.map((val: number) => Some(val + 1)), None);
});

Deno.test("#map", () => {
  assertEquals(None.map((val: number) => val + 1), None);
});

Deno.test("#mapOr", () => {
  assertEquals(None.mapOr(0, (val: number) => val + 1), 0);
});

Deno.test("#mapOrElse", () => {
  assertEquals(None.mapOrElse(() => 0, (val: number) => val + 0), 0);
});

Deno.test("#and", () => {
  assertEquals(None.and(None), None);
});

Deno.test("#or", () => {
  assertEquals(None.or(None), None);
});

Deno.test("#orElse", () => {
  assertEquals(None.orElse(() => None), None);
});

Deno.test("#okOr", () => {
  assertEquals(None.okOr("error"), Err("error"));
});

Deno.test("#okOrElse", () => {
  assertEquals(None.okOrElse(() => "error"), Err("error"));
});
