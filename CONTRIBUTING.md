# Contributing

## Changelog Management

This project has adopted the
[keep a changelog](https://keepachangelog.com/en/1.0.0/) format, so that
unreleased changes can automatically be promoted to a release's change log as
part of cutting the release.

## Cutting a Release

Releases are created based purely on `git` tags pushed to GitHub;
[`deno.land/x/`](https://deno.land/x) monitors these to automatically publish to
it's registry and a GitHub Action will create an `npm` release when tags are
pushed as well.

A script exists to update the `CHANGELOG.md` and create the `git` tag:

```sh
deno run -A ./scripts/release.ts x.x.x
```

Where `x.x.x` is the version you want to release.
