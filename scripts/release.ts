import {
  dirname,
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.129.0/path/mod.ts";
import { parse as parseArgs } from "https://deno.land/std@0.120.0/flags/mod.ts";
import {
  type Changelog,
  parser as parseChangelog,
  type Release,
} from "https://deno.land/x/changelog@v2.0.1/mod.ts";

import { run } from "./utils/deno-run.ts";
import {
  Err,
  isOk,
  None,
  Ok,
  type Option,
  type Result,
  Some,
} from "../lib/mod.ts";

/**
 * Get the version number to release from the CLI arguments
 */
function getDesiredVersion(): Result<string, string> {
  const [version] = parseArgs(Deno.args)._;

  if (version) {
    return new Ok(String(version));
  } else {
    return new Err("A version number must be provided");
  }
}

/**
 * Get the `Release` containing un-released changes
 */
function getPendingRelease(changelog: Changelog): Option<Release> {
  const release = changelog.releases.find((release) => {
    if (release.date) {
      return false;
    }

    return !release.version;
  });

  return release ? new Some(release) : None;
}

const rootPath = resolve(dirname(fromFileUrl(import.meta.url)), "../");
const changelogPath = resolve(rootPath, "./CHANGELOG.md");
const changelog = parseChangelog(Deno.readTextFileSync(changelogPath));

const result = await getDesiredVersion()
  .andThen((version) => {
    console.log(`Creating release for v${version}`);

    return getPendingRelease(changelog)
      .okOr("There are no unreleased changes")
      .map<[string, Release]>((unreleased) => [version, unreleased]);
  })
  .map(([version, unreleased]) => {
    // Set desired version and current date
    unreleased.setVersion(version);
    unreleased.setDate(new Date());
  })
  .map(() => {
    console.log("Writing the changelog...");

    Deno.writeTextFileSync(changelogPath, changelog.toString());
  })
  .eventually()
  .map(() => {
    console.log("Formatting the changelog...");

    return run({
      cmd: ["deno", "fmt", changelogPath],
      cwd: rootPath,
    });
  })
  .map(() => {
    console.log("Staging changes...");

    return run({
      cmd: ["git", "add", "-A"],
      cwd: rootPath,
    });
  })
  .map(() => {
    console.log("Creating release commit...");

    return run({
      cmd: [
        "git",
        "commit",
        "-m",
        `Release v${getDesiredVersion().unwrap()}`, // `.unwrap` here is clunky but passing state through callbacks sucks
      ],
      cwd: rootPath,
    });
  })
  .map(() => {
    console.log("Tagging release...");

    return run({
      cmd: [
        "git",
        "tag",
        `v${getDesiredVersion().unwrap()}`, // `.unwrap` here is clunky but passing state through callbacks sucks
      ],
      cwd: rootPath,
    });
  });

if (isOk(result)) {
  console.log("Done!");
} else {
  console.error(result.unwrapErr());
  Deno.exit(1);
}
