# `eventual-result`

> A `Result` and `Option` implementation that works with `Promise`

## Installation

This package is authored using [Deno](https://deno.land) and can be found on
[`deno.land`](https://deno.land/x/eventual_result):

```ts
import { type Result } from "https://deno.land/x/eventual_result/mod.ts";
```

For consumption through `npm` (or other Node package managers),
[a compatible package][npm-pkg] is generated through
[`dnt`](https://github.com/denoland/dnt):

```bash
npm install eventual-result
```

## Usage

For the full documentation of this package, check out the hosted documentation
on [`doc.deno.land`][docs].

### `Option`

An `Option` represents a value that can be present (`Some`), but might not be
(`None`):

```typescript
type Person = {
  id: number;
  name: string;
};

function findPerson(id: number): Option<Person> {
  if (store.people.has({ id })) {
    return new Some(store.people.get({ id }));
  } else {
    return None;
  }
}
```

### `Result`

A `Result` represents a value that could be represent either a successful result
(`Ok`) or an error that occurred instead (`Err)`:

```typescript
type Person = {
  name: string;
  age: number;
};

function createAdult(name: string, age: number): Result<Person, string> {
  if (age < 18) {
    return new Err(`${age} is too young to be an adult`);
  } else {
    return new Ok({ name, age });
  }
}
```

### `EventualResult`

An `EventualResult` is a cross between a `Promise` and a `Result`. Unlike a
`Promise` it will never reject, and the same methods that can be called on a
`Result` can be called on an `EventualResult`. Like a `Promise`, an
`EventualResult` can be resolved (using `.then` or `await`) to retrieve the
inner `Result`.

## Why Another `Result` Implementation?

There are _many_ other libraries that implement these patterns; a few sources of
inspiration include [`ts-results`](https://github.com/vultix/ts-results) and
[`oxide.ts`](https://github.com/traverse1984/oxide.ts). These libraries share a
problem, however: they do nothing to help you manage asynchronous code.

Since the dawn of ES6, `Promise` and `async`/`await` have become critical parts
of working on a modern JavaScript or TypeScript application. While `Result`
provides a great way to model a potential success or failure for a synchronous
action, needing to use something like `Promise<Result>` to model an asynchronous
action can get you into trouble:

<details>
  <summary>Example: handling a <code>Promise&lt;Result&gt;</code></summary>
  <p>

Let's suppose that we want to read a file asynchronously and then validate it to
produce a `Result`. That might look something like this:

```typescript
import { readFile } from "node:fs/promises";

declare function isValid(content: string): boolean;

function validateFile(content: string): Result<string, string> {
  if (isValid(content)) {
    return Ok(content);
  } else {
    return Err("The file content is not valid");
  }
}

async function readValidFile(path: string): Promise<Result<string, string>> {
  const content = await readFile(path);

  return validateFile(content);
}

// Let's say that `path/to/file.txt` points to a location that does not exist
const potentiallyValidFile = await readValidFile("path/to/file.txt");
```

What happens here? An exception will be thrown! Even though we want to be using
`Result` to model an error state, `readFile` doesn't know anything about that;
the `await`ed promise rejects and an exception is thrown.

</p></details>

This example shows how using `Promise` and `Result` together can cause errors,
because our `Result` does nothing to help us with the rejected `Promise`. This
isn't impossible to solve though: we can use `try`/`catch` to ensure a reject
`Promise` results in an `Err`:

<details>
  <summary>Example: handling a <code>Promise&lt;Result&gt;</code> and catching exceptions</summary>
  <p>

Let's improve on our last example by ensuring that an error from `readFile`
doesn't cause `readValidFile` to result in a rejected `Promise`!

```typescript
import { readFile } from "node:fs/promises";

declare function isValid(content: string): boolean;

function validateFile(content: string): Result<string, string> {
  if (isValid(content)) {
    return new Ok(content);
  } else {
    return new Err("The file content is not valid");
  }
}

async function readValidFile(path: string): Promise<Result<string, string>> {
  try {
    const content = await readFile(path);

    return validateFile(content);
  } catch (e: unknown) {
    return new Err(String(e));
  }
}

// Let's say that `path/to/file.txt` points to a location that does not exist
const potentiallyValidFile = await readValidFile("path/to/file.txt");
```

What happens this time? Rather than throwing an exception, we get a resolution
to an `Err`. Success!

But... can we do better? What are some problems with the code above?

- Having to defensively wrap every asynchronous function in a `try`/`catch`
  doesn't feel good. While we _do_ want to be exhaustive about handling errors,
  we _don't_ want to have to write defensive code. Additionally, when you are
  working in a codebase that has adopted the `Result` pattern, these locations
  where `try`/`catch` are required to wrap third-party code really stand out.
- We lose the top-to-bottom readability of the `readValidFile` function. The
  error handling for `readFile` is way down at the bottom instead of being
  anywhere near the actual function call.

What might a solution to these problems look like?

</p></details>

Enter `EventualResult`! This class provides us an alternative way to represent
an eventual value that may result in a success or failure that, rather than
competing with `Result`, is compatible with it.

<details>
  <summary>Example: handling an <code>EventualResult</code></summary>
  <p>

Let's look at the same example, but this time making use of an `EventualResult`
instead of a `Promise<Result>`:

```typescript
import { readFile } from "node:fs/promises";

declare function isValid(content: string): boolean;

function validateFile(content: string): Result<string, string> {
  if (isValid(content)) {
    return new Ok(content);
  } else {
    return new Err("The file content is not valid");
  }
}

function readValidFile(path: string): EventualResult<string> {
  return new EventualResult(readFile(path)).andThen((content) =>
    validateFile(content)
  );
}

// Let's say that `path/to/file.txt` points to a location that does not exist
const eventualPotentiallyValidFile = readValidFile("path/to/file.txt");
```

What has changed?

1. We no longer need specific `try`/`catch` wrapping around `readFile`; by
   passing it through `EventualResult`, we no longer end up with a `Promise`
   that can reject. If an error during the file read occurs, the
   `EventualResult` will resolve to an `Err`.
2. We don't need any conditional logic when validating the file that handles
   what to do when the file read failed. `EventualResult` implements most of the
   same methods that `Result` does, we can lean on our existing knowledge about
   working with `Result` to only validate the contents if the file read
   _eventually_ results in an `Ok`.

</p></details>

The end result is writing less defensive code that extends the predictability of
`Result` with the eventual resolution of `Promise`.

[docs]: https://doc.deno.land/https://deno.land/x/eventual_result/mod.ts
[npm-pkg]: https://www.npmjs.com/package/eventual-result
