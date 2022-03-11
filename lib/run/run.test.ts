import { assert, assertEquals } from "../test-deps.ts";
import { Err, EventualResult, Ok } from "../result/mod.ts";
import { run } from "./run.ts";

Deno.test("returning a value", () => {
  const result = run(() => "success");

  assertEquals(result, new Ok("success"));
});

Deno.test("throwing an error", () => {
  const result = run(() => {
    throw "failure";
  });

  assertEquals(result, new Err("failure"));
});

Deno.test("a resolving promise", async () => {
  const result = run(() => Promise.resolve("success"));

  assert(result instanceof EventualResult);
  assertEquals(await result, new Ok("success"));
});

Deno.test("a rejecting promise", async () => {
  const result = run(() => Promise.reject("failure"));

  assert(result instanceof EventualResult);
  assertEquals(await result, new Err("failure"));
});

Deno.test("an async function", async () => {
  const result = run(async function () {
    const value = await Promise.resolve("success");

    return value;
  });

  assert(result instanceof EventualResult);
  assertEquals(await result, new Ok("success"));
});
