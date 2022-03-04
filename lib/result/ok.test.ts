import {
  assertEquals,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from "../test-deps.ts";
import { Ok } from "./ok.ts";
import { None, Some } from "../option/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

Deno.test("#isOk", () => {
  const ok = Ok("whatever");

  assertEquals(ok.isOk, true);
});

Deno.test("#isErr", () => {
  const ok = Ok("whatever");

  assertEquals(ok.isErr, false);
});

Deno.test("#unwrap", () => {
  const ok = Ok("whatever");

  assertEquals(ok.unwrap(), "whatever");
});

Deno.test("#expect", () => {
  const ok = Ok("whatever");

  assertEquals(
    ok.expect("My Message"),
    "whatever",
  );
});

Deno.test("#unwrapErr", () => {
  const ok = Ok("whatever");

  assertThrows(
    () => {
      ok.unwrapErr();
    },
    UnwrapError,
  );
});

Deno.test("#expectErr", () => {
  const ok = Ok("whatever");

  assertThrows(
    () => {
      ok.expectErr("My Message");
    },
    ExpectError,
    "My Message",
  );
});

Deno.test("#andThen", () => {
  const ok = Ok("whatever");
  const afterOp = ok.andThen((value) => Ok(`${value}!`));

  assertNotEquals(ok, afterOp, "The operation was performed");
});

Deno.test("#map", () => {
  const ok = Ok("whatever").map((value) => value.length);

  assertEquals(ok, Ok(8));
});

Deno.test("#mapErr", () => {
  const ok = Ok("whatever").mapErr(() => "my error");

  assertStrictEquals(ok, ok);
});

Deno.test("#mapOr", () => {
  const lengthOrDefault = Ok("whatever").mapOr(0, (value) => value.length);

  assertEquals(lengthOrDefault, 8);
});

Deno.test("#and", () => {
  const result = Ok("foo").and(Ok("bar"));

  assertEquals(result, Ok("bar"));
});

Deno.test("#ok", () => {
  const ok = Ok("whatever");

  assertEquals(ok.ok(), Some("whatever"));
});

Deno.test("err", () => {
  const ok = Ok("whatever");

  assertEquals(ok.err(), None);
});
