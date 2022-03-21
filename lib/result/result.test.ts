import { assertEquals } from "../test-deps.ts";
import { type Result } from "./result.ts";
import { Ok } from "./ok.ts";
import { Err } from "./err.ts";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return new Err("You cannot divide by `0`");
  }

  return new Ok(a / b);
}

// These tests call methods on the union `Result` type to ensure everything
// type-checks. Without these tests, the `Ok` and `Err` classes might not
// actually be compatible with one another; the shared interface that they
// both implement is not enough to guarantee that passed arguments and their
// types are satisfied in both implementations.
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

  await t.step("#andThen", async (t) => {
    await t.step("when the result is `Ok`", async (t) => {
      await t.step("and the callback returns `Ok`", () => {
        const result: Result<number, string> = divide(1, 2).andThen((result) =>
          new Ok(result * 2)
        );

        assertEquals(result, new Ok(1));
      });

      await t.step("and the callback returns `Err`", () => {
        const result = divide(1, 2).andThen(() => new Err("Oops!"));

        assertEquals(result, new Err("Oops!"));
      });

      await t.step("and the callback returns `Result`", () => {
        const result: Result<number, string> = divide(1, 2).andThen((result) =>
          divide(result, 1)
        );

        assertEquals(result, new Ok(0.5));
      });
    });

    await t.step("when the result is `Err`", async (t) => {
      await t.step("and the callback returns `Ok`", () => {
        const result: Result<number, string> = divide(1, 0).andThen((result) =>
          new Ok(result * 2)
        );

        assertEquals(result, new Err("You cannot divide by `0`"));
      });

      await t.step("and the callback returns `Err`", () => {
        const result = divide(1, 0).andThen(() => new Err("Oops!"));

        assertEquals(result, new Err("You cannot divide by `0`"));
      });

      await t.step("and the callback returns `Result`", () => {
        const result: Result<number, string> = divide(1, 0).andThen((result) =>
          divide(result, 1)
        );

        assertEquals(result, new Err("You cannot divide by `0`"));
      });
    });
  });

  await t.step("#map", () => {
    const result = divide(1, 2).map((result) => result * 0);

    assertEquals(result, new Ok(0));
  });

  await t.step("#mapErr", () => {
    const result = divide(1, 0).mapErr((err) => `${err}!`);

    assertEquals(result, new Err("You cannot divide by `0`!"));
  });

  await t.step("#mapOr", () => {
    const result = divide(1, 2).mapOr(Infinity, (result) => result * 2);

    assertEquals(result, 1);
  });

  await t.step("#mapOrElse", () => {
    const result = divide(1, 2).mapOrElse(
      () => Infinity,
      (result) => result * 2,
    );

    assertEquals(result, 1);
  });

  await t.step("#and", () => {
    const result = divide(1, 2).and(new Ok(0));

    assertEquals(result, new Ok(0));
  });

  await t.step("#or", () => {
    const result = divide(1, 2).or(new Ok(0));

    assertEquals(result, new Ok(0.5));
  });

  await t.step("#orElse", () => {
    const result = divide(1, 2).orElse(() => new Ok(0));

    assertEquals(result, new Ok(0.5));
  });

  await t.step("#ok", () => {
    const result = divide(1, 2).ok();

    assertEquals(result.unwrap(), 0.5);
  });

  await t.step("#err", () => {
    const result = divide(1, 2).err();

    assertEquals(result.isNone(), true);
  });
});

// These tests ensure that `isOk` and `isErr` actually discriminate a `Result<T, E>`
// into either an `Ok<T>` or an `Err<E>`. The "test" here are the assignments
// to narrower types within the `if`/`else` statement: this code won't compile if the
// intended behavior in the type system is not working
Deno.test("discriminating `Ok` from `Err`", async (t) => {
  const result = divide(1, 2);

  await t.step("using `#isOk`", () => {
    if (result.isOk()) {
      const _ok: Ok<number> = result;
    }
  });

  await t.step("using `#isErr`", () => {
    if (result.isErr()) {
      const _err: Err<string> = result;
    }
  });
});
