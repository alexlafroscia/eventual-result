import { assertExists } from "std/testing/asserts.ts";
import * as mod from "./mod.ts";

Deno.test("module exports", () => {
  assertExists(mod.EventualResult, "Exports `EventualResult`");

  assertExists(mod.Ok, "Exports `Ok`");
  assertExists(mod.Err, "Exports `Err`");

  assertExists(mod.isOk, "Exports `isOk`");
  assertExists(mod.isErr, "Exports `isErr`");

  assertExists(mod.anyResult, "Exports `anyResult`");
  assertExists(mod.allResults, "Exports `allResults`");

  assertExists(mod.Some, "Exports `Some`");
  assertExists(mod.None, "Exports `None`");

  assertExists(mod.isSome, "Exports `isSome`");
  assertExists(mod.isNone, "Exports `isNone`");

  assertExists(mod.UnwrapError, "Exports `UnwrapError`");
  assertExists(mod.ExpectError, "Exports `ExpectError`");
});
