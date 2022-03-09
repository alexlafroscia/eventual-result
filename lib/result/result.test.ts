import { assertEquals } from "../test-deps.ts";
import { type Result } from "./result.ts";
import { Ok, OkImpl } from "./ok.ts";
import { Err, ErrImpl } from "./err.ts";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err("You cannot divide by `0`");
  }

  return Ok(a / b);
}

// These tests call methods on the union `Result` type to ensure everything
// type-checks. Without these tests, the `OkImpl` and `ErrImpl` classes
// might not actually be compatible with one another; the shared interface
// that they both implement is not enough to guarantee that passed arguments
// and their types are satisfied in both implementations.
Deno.test("method signatures of `Ok` and `Err` align", async (t) => {
  await t.step("#unwrap", () => {
    const result = divide(1, 2).unwrap();

    assertEquals(result, 0.5);
  });

  await t.step("#unwrapOr", () => {
    const result = divide(1, 2).unwrapOr(Infinity);

    assertEquals(result, 0.5);
  });

  await t.step("#expect", () => {
    const result = divide(1, 2).expect("You tried to do the impossible");

    assertEquals(result, 0.5);
  });

  await t.step("#unwrapErr", () => {
    const result = divide(1, 0).unwrapErr();

    assertEquals(result, "You cannot divide by `0`");
  });

  await t.step("#expectErr", () => {
    const result = divide(1, 0).expectErr("You tried to do the possible");

    assertEquals(result, "You cannot divide by `0`");
  });

  await t.step("#andThen", () => {
    const result = divide(1, 2).andThen((result) => Ok(result * 2));

    assertEquals(result, Ok(1));
  });

  await t.step("#map", () => {
    const result = divide(1, 2).map((result) => result * 0);

    assertEquals(result, Ok(0));
  });

  await t.step("#mapErr", () => {
    const result = divide(1, 0).mapErr((err) => `${err}!`);

    assertEquals(result, Err("You cannot divide by `0`!"));
  });

  await t.step("#mapOr", () => {
    const result = divide(1, 2).mapOr(Infinity, (result) => result * 2);

    assertEquals(result, 1);
  });

  await t.step("#and", () => {
    const result = divide(1, 2).and(Ok(0));

    assertEquals(result, Ok(0));
  });

  await t.step("#or", () => {
    const result = divide(1, 2).or(Ok(0));

    assertEquals(result, Ok(0.5));
  });

  await t.step("#orElse", () => {
    const result = divide(1, 2).orElse(() => Ok(0));

    assertEquals(result, Ok(0.5));
  });

  await t.step("#ok", () => {
    const result = divide(1, 2).ok();

    assertEquals(result.unwrap(), 0.5);
  });

  await t.step("#err", () => {
    const result = divide(1, 2).err();

    assertEquals(result.isNone, true);
  });
});

// These tests ensure that `isOk` and `isErr` actually discriminate a `Result<T, E>`
// into either an `OkImpl<T>` or an `ErrImpl<E>`. The "test" here are the assignments
// to narrower types within the `if`/`else` statement: this code won't compile if the
// intended behavior in the type system is not working
Deno.test("discriminating `OkImpl` from `ErrImpl`", async (t) => {
  const result = divide(1, 2);

  await t.step("using `#isOk`", () => {
    if (result.isOk) {
      const _ok: OkImpl<number> = result;
    } else {
      const _err: ErrImpl<string> = result;
    }
  });

  await t.step("using `#isErr`", () => {
    if (result.isErr) {
      const _err: ErrImpl<string> = result;
    } else {
      const _ok: OkImpl<number> = result;
    }
  });
});
