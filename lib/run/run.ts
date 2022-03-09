import {
  Err,
  EventualResult,
  Ok,
  type Result as ResultWithErrorType,
} from "../result/mod.ts";

type Result<T> = ResultWithErrorType<T, unknown>;

/**
 * Run the given function and convert the return value into a `Result` or an `EventualResult`
 *
 * If a synchronous callback is given, a `Result` is returned. It wraps either the return-
 * value of the function or any exception thrown during execution.
 *
 * If an asychronous callback is given -- or a synchronous one that returns a `Promise` --
 * then an `EventualResult` is returned
 */
export function run<T>(producer: () => Promise<T>): EventualResult<T>;
export function run<T>(producer: () => T): Result<T>;
export function run<T>(
  producer: () => T | Promise<T>,
): Result<T> | EventualResult<T> {
  try {
    const value = producer();

    if (value instanceof Promise) {
      return new EventualResult(value);
    } else {
      return Ok(value);
    }
  } catch (e: unknown) {
    return Err(e);
  }
}
