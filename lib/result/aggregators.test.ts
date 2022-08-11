import { assertEquals } from "std/testing/asserts.ts";
import { Ok } from "./ok.ts";
import { Err } from "./err.ts";
import { all, any } from "./aggregators.ts";

Deno.test("all", async (t) => {
  await t.step("when all results are Ok", () => {
    const result = all([
      new Ok(1),
      new Ok(2),
    ]);

    assertEquals(result, new Ok([1, 2]));
  });

  await t.step("when a result in an Err", () => {
    const result = all([
      new Ok(1),
      new Err("Uh oh!"),
    ]);

    assertEquals(result, new Err("Uh oh!"));
  });
});

Deno.test("any", async (t) => {
  await t.step("when all results are Err", () => {
    const result = any([
      new Err("Uh oh!"),
      new Err("This one too!"),
    ]);

    assertEquals(result, new Err(["Uh oh!", "This one too!"]));
  });

  await t.step("when a result in an Ok", () => {
    const result = any([
      new Ok(1),
      new Err("Uh oh!"),
    ]);

    assertEquals(result, new Ok(1));
  });
});
