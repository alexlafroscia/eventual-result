import {
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from "../test-deps.ts";
import { isOk, Ok } from "./ok.ts";
import { isErr } from "./err.ts";
import { EventualResult } from "./eventual.ts";
import { None, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

Deno.test("isOk", () => {
  const ok = new Ok("whatever");

  assertEquals(isOk(ok), true);
});

Deno.test("isErr", () => {
  const ok = new Ok("whatever");

  assertEquals(isErr(ok), false);
});

Deno.test("#unwrap", () => {
  const ok = new Ok("whatever");

  assertEquals(ok.unwrap(), "whatever");
});

Deno.test("#unwrap", () => {
  const ok = new Ok("whatever");

  assertEquals(ok.unwrapOr(), "whatever");
});

Deno.test("#expect", () => {
  const ok = new Ok("whatever");

  assertEquals(
    ok.expect("My Message"),
    "whatever",
  );
});

Deno.test("#unwrapErr", () => {
  const ok = new Ok("whatever");

  assertThrows(
    () => {
      ok.unwrapErr();
    },
    UnwrapError,
  );
});

Deno.test("#expectErr", () => {
  const ok = new Ok("whatever");

  assertThrows(
    () => {
      ok.expectErr("My Message");
    },
    ExpectError,
    "My Message",
  );
});

Deno.test("#andThen", () => {
  const ok = new Ok("whatever");
  const afterOp = ok.andThen((value) => new Ok(`${value}!`));

  assertNotEquals(ok, afterOp, "The operation was performed");
});

Deno.test("#map", () => {
  const ok = new Ok("whatever").map((value) => value.length);

  assertEquals(ok, new Ok(8));
});

Deno.test("#mapErr", () => {
  const ok = new Ok("whatever").mapErr();

  assertStrictEquals(ok, ok);
});

Deno.test("#mapOr", () => {
  const lengthOrDefault = new Ok("whatever").mapOr(0, (value) => value.length);

  assertEquals(lengthOrDefault, 8);
});

Deno.test("#mapOrElse", () => {
  const lengthOrDefault = new Ok("whatever").mapOrElse(
    () => 0,
    (value) => value.length,
  );

  assertEquals(lengthOrDefault, 8);
});

Deno.test("#and", () => {
  const result = new Ok("foo").and(new Ok("bar"));

  assertEquals(result, new Ok("bar"));
});

Deno.test("#or", () => {
  const result = new Ok("foo").or(new Ok("bar"));

  assertEquals(result, new Ok("foo"));
});

Deno.test("#orElse", () => {
  const result = new Ok("foo").orElse(() => new Ok("bar"));

  assertEquals(result, new Ok("foo"));
});

Deno.test("#ok", () => {
  const ok = new Ok("whatever");

  assertEquals(ok.ok(), new Some("whatever"));
});

Deno.test("#err", () => {
  const ok = new Ok("whatever");

  assertEquals(ok.err(), None);
});

Deno.test("#eventually", async () => {
  const eventual: EventualResult<string, never> = new Ok("whatever")
    .eventually();

  assertEquals(await eventual, new Ok("whatever"));
});
