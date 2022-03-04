import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

// Ensure `npm` directory is empty
await emptyDir("./npm");

await build({
  entryPoints: ["./lib/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  // Does not feel necessary, given there are no dependencies the tool needs to swap
  test: false,
  // Disable type-checking of the output lib; can't get `Error#cause` working
  typeCheck: false,
  // package.json properties
  package: {
    name: "eventual-result",
    // Strip the `v` from the tag
    version: Deno.args[0]?.replace(/^v/, ""),
    description:
      "A `Result` and `Option` implementation that works with `Promise`",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/alexlafroscia/eventual-result.git",
    },
    bugs: {
      url: "https://github.com/alexlafroscia/eventual-result/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
// Deno.copyFileSync("README.md", "npm/README.md");
