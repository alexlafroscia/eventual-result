import { assertEquals } from "../test-deps.ts";
import { Some } from "./some.ts";
import { Ok } from "../result/mod.ts";

Deno.test("#isSome", () => {
  assertEquals(new Some(1).isSome, true);
});

Deno.test("#isNone", () => {
  assertEquals(new Some(1).isNone, false);
});

Deno.test("#unwrap", () => {
  assertEquals(new Some(1).unwrap(), 1);
});

Deno.test("#unwrapOr", () => {
  assertEquals(new Some(1).unwrapOr(2), 1);
});

Deno.test("#unwrapOrElse", () => {
  assertEquals(new Some(1).unwrapOrElse(() => 2), 1);
});

Deno.test("#expect", () => {
  assertEquals(new Some(1).expect("Nope"), 1);
});

Deno.test("#andThen", () => {
  assertEquals(new Some(1).andThen((val) => new Some(val + 1)), new Some(2));
});

Deno.test("#map", () => {
  assertEquals(new Some(1).map((val) => val + 1), new Some(2));
});

Deno.test("#mapOr", () => {
  assertEquals(new Some(1).mapOr(0, (val) => val + 1), 2);
});

Deno.test("#mapOrElse", () => {
  assertEquals(new Some(1).mapOrElse(() => 0, (val) => val + 1), 2);
});

Deno.test("#and", () => {
  assertEquals(new Some(1).and(new Some(2)), new Some(2));
});

Deno.test("#or", () => {
  assertEquals(new Some(1).or(new Some(2)), new Some(1));
});

Deno.test("#orElse", () => {
  assertEquals(new Some(1).orElse(() => new Some(2)), new Some(1));
});

Deno.test("#okOr", () => {
  assertEquals(new Some(1).okOr("error"), new Ok(1));
});

Deno.test("#okOrElse", () => {
  assertEquals(new Some(1).okOrElse(() => "error"), new Ok(1));
});
