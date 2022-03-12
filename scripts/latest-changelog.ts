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
const changelog = parseChangelog(Deno.readTextFileSync(changelogPath));

function capitalize(input: string): string {
  const [first, ...rest] = input.split("");

  return first.toUpperCase() + rest.join("");
}

const latestRelease = changelog.releases.find((release) =>
  release.date && release.version
);

if (latestRelease) {
  const changes = [...latestRelease.changes.entries()]
    // Remove change types without entries
    .filter((
      [_type, changes],
    ) => changes.length > 0)
    // Transform into the right Markdown format
    .map(
      ([type, changes]) => {
        return `## ${capitalize(type)}\n${
          changes.map((change) => {
            return `- ${change.title}`;
          })
        }`;
      },
    )
    // Each section should have two blank lines after it
    .join("\n\n");

  console.log(changes);
}
