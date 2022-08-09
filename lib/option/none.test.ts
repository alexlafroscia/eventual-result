import { assertEquals, assertThrows } from "../test-deps.ts";
import { isSome } from "./some.ts";
import { isNone, None } from "./none.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";
import { Err } from "../result/err.ts";

Deno.test("isSome", () => {
  assertEquals(isSome(None), false);
});

Deno.test("isNone", () => {
  assertEquals(isNone(None), true);
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

Deno.test("#andThen", () => {
  assertEquals(None.andThen(), None);
});

Deno.test("#map", () => {
  assertEquals(None.map(), None);
});

Deno.test("#mapOr", () => {
  assertEquals(None.mapOr(0), 0);
});

Deno.test("#mapOrElse", () => {
  assertEquals(None.mapOrElse(() => 0), 0);
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
  assertEquals(None.okOr("error"), new Err("error"));
});

Deno.test("#okOrElse", () => {
  assertEquals(None.okOrElse(() => "error"), new Err("error"));
});
