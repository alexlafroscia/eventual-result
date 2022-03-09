import { assertEquals } from "../test-deps.ts";
import { Ok } from "./ok.ts";
import { Err } from "./err.ts";
import { all, any } from "./aggregators.ts";

Deno.test("all", async (t) => {
  await t.step("when all results are Ok", () => {
    const result = all([
      Ok(1),
      Ok(2),
    ]);

    assertEquals(result, Ok([1, 2]));
  });

  await t.step("when a result in an Err", () => {
    const result = all([
      Ok(1),
      Err("Uh oh!"),
    ]);

    assertEquals(result, Err("Uh oh!"));
  });
});

Deno.test("any", async (t) => {
  await t.step("when all results are Err", () => {
    const result = any([
      Err("Uh oh!"),
      Err("This one too!"),
    ]);

    assertEquals(result, Err(["Uh oh!", "This one too!"]));
  });

  await t.step("when a result in an Ok", () => {
    const result = any([
      Ok(1),
      Err("Uh oh!"),
    ]);

    assertEquals(result, Ok(1));
  });
});
