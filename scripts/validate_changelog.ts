import {
  dirname,
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.129.0/path/mod.ts";
import {
  parser as parseChangelog,
} from "https://deno.land/x/changelog@v2.0.1/mod.ts";

const rootPath = resolve(dirname(fromFileUrl(import.meta.url)), "../");
const changelogPath = resolve(rootPath, "./CHANGELOG.md");

// If parsing the changelog works, we're good
parseChangelog(Deno.readTextFileSync(changelogPath));
