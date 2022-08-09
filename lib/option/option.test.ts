import { assert, assertEquals } from "../test-deps.ts";
import { type Option } from "./option.ts";
import { Some } from "./some.ts";
import { None } from "./none.ts";
import { isOk } from "../result/ok.ts";

function toOption<T>(value: T | undefined): Option<T> {
  return typeof value !== "undefined" ? new Some(value) : None;
}

// These tests call methods on the union `Option` type to ensure everything
// type-checks. Without these tests, the `Some` and `None` classes might not
// actually be compatible with one another; the shared interface that they both
// implement is not enough to guarantee that passed arguments and their types
// are satisfied in both implementations.
Deno.test("method signatures of `Ok` and `Err` align", async (t) => {
  await t.step("#unwrap", () => {
    const result = toOption(1).unwrap();

    assertEquals(result, 1);
  });

  await t.step("#unwrapOr", () => {
    const result = toOption(1).unwrapOr(2);

    assertEquals(result, 1);
  });

  await t.step("#unwrapOrElse", () => {
    const result = toOption(1).unwrapOrElse(() => 2);

    assertEquals(result, 1);
  });

  await t.step("#expect", () => {
    const result = toOption(1).expect("Nothing was provided");

    assertEquals(result, 1);
  });

  await t.step("#andThen", () => {
    const result = toOption(1).andThen((value) => new Some(value * 2));

    assertEquals(result, new Some(2));
  });

  await t.step("#map", () => {
    const result = toOption(1).map((value) => value * 2);

    assertEquals(result, new Some(2));
  });

  await t.step("#mapOr", () => {
    const result = toOption(1).mapOr(Infinity, (value) => value * 2);

    assertEquals(result, 2);
  });

  await t.step("#mapOrElse", () => {
    const result = toOption(1).mapOrElse(() => Infinity, (value) => value * 2);

    assertEquals(result, 2);
  });

  await t.step("#and", () => {
    const result = toOption(1).and(None);

    assertEquals(result, None);
  });

  await t.step("#or", () => {
    const result = toOption(1).or(None);

    assertEquals(result, new Some(1));
  });

  await t.step("#orElse", () => {
    const result = toOption(1).orElse(() => None);

    assertEquals(result, new Some(1));
  });

  await t.step("#okOr", () => {
    const result = toOption(1).okOr("Error!");

    assert(isOk(result));
  });

  await t.step("#okOrElse", () => {
    const result = toOption(1).okOrElse(() => "Error!");

    assert(isOk(result));
  });
});
