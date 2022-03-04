# `eventual-result`

> A `Result` and `Option` implementation that works with `Promise`

## Why Another `Result` Implementation?

There are _many_ other libraries that implement these patterns; a few sources of inspiration include [`ts-results`](https://github.com/vultix/ts-results) and [`oxide.ts`](https://github.com/traverse1984/oxide.ts). These libraries share a problem, however: they do nothing to help you manage asynchronous code.

Since the dawn of ES6, `Promise` and `async`/`await` have become critical parts of working on a modern JavaScript or TypeScript applications. While `Result` provides a great way to model a potential success or failure for a synchronous action, needing to use something like `Promise<Result>` to model an asynchronous action means you actually have _two_ different ways that an error can occur: the `Promise` can reject, _or_ the `Result` can be an `Err`.

<details>
  <summary>Example: handling a <code>Promise&lt;Result&gt;</code></summary>
  <p>

Let's suppose that we want to read a file asynchronously and then validate it to produce a `Result`. That might look something like this:

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

async function readFile(path: string): Promise<Result<string, string>> {
  try {
    const content = await readFile(path);

    return validateFile(content);
  } catch (e: unknown) {
    return Err(String(e));
  }
}
```

It may be hard to recognize at first, but there are now two _entirely_ different ways of handling errors in the code above! First, the `try`/`catch` handles an error while reading the file and has to manually transform that into an `Err`. Second, `validateFile` could itself return an `Err` that represents a file that was successfully read but was, for other reasons, invalid.

</p></details>

Enter `EventualResult`! This class provides us an alternative way to represent an eventual value that may result in a success or failure that, rather than competing with `Result`, is compatible with it.

<details>
  <summary>Example: handling an <code>EventualResult</code></summary>
  <p>

Let's look at the same example, but this time making use of an `EventualResult` instead of a `Promise<Result>`:

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

function readFile(path: string): EventualResult<string> {
  return new EventualResult(readFile(path)).andThen((content) =>
    validateFile(content)
  );
}
```

What has changed?

1. We no longer need specific `try`/`catch` wrapping of the file read; by passing it through `EventualResult`, we no longer end up with a `Promise` that _can_ reject. If an error during the file read occurs, the `EventualResult` will resolve to an `Err`
2. We don't need any conditional logic when validating the file that handles what to do when the file read failed; because `EventualResult` implements most of the same methods that `Result` does, we can use our existing knowledge of `andThen` to only validate the contents if the file read _eventually_ results in an `Ok`

</p></details>

The end result is writing less defensive code that extends the predictability of `Result` with the eventual resolution of `Promise`.
