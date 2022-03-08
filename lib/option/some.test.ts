import { assertEquals } from "../test-deps.ts";
import { Some } from "./some.ts";
import { Ok } from "../result/mod.ts";

Deno.test("#isSome", () => {
  assertEquals(Some(1).isSome(), true);
});

Deno.test("#isNone", () => {
  assertEquals(Some(1).isNone(), false);
});

Deno.test("#unwrap", () => {
  assertEquals(Some(1).unwrap(), 1);
});

Deno.test("#unwrapOr", () => {
  assertEquals(Some(1).unwrapOr(2), 1);
});

Deno.test("#unwrapOrElse", () => {
  assertEquals(Some(1).unwrapOrElse(() => 2), 1);
});

Deno.test("#expect", () => {
  assertEquals(Some(1).expect("Nope"), 1);
});

Deno.test("#andThen", () => {
  assertEquals(Some(1).andThen((val) => Some(val + 1)), Some(2));
});

Deno.test("#map", () => {
  assertEquals(Some(1).map((val) => val + 1), Some(2));
});

Deno.test("#mapOr", () => {
  assertEquals(Some(1).mapOr(0, (val) => val + 1), 2);
});

Deno.test("#mapOrElse", () => {
  assertEquals(Some(1).mapOrElse(() => 0, (val) => val + 1), 2);
});

Deno.test("#and", () => {
  assertEquals(Some(1).and(Some(2)), Some(2));
});

Deno.test("#or", () => {
  assertEquals(Some(1).or(Some(2)), Some(1));
});

Deno.test("#orElse", () => {
  assertEquals(Some(1).orElse(() => Some(2)), Some(1));
});

Deno.test("#okOr", () => {
  assertEquals(Some(1).okOr("error"), Ok(1));
});

Deno.test("#okOrElse", () => {
  assertEquals(Some(1).okOrElse(() => "error"), Ok(1));
});
