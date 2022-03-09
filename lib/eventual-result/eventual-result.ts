import { Err, Ok, type Result } from "../result/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

type MaybeAsync<T> = T | PromiseLike<T>;

/**
 * An `EventualResult` is a cross between a `Promise` and a `Result`.
 *
 * Unlike a `Promise` it will never reject, and the same methods that can be
 * called on a `Result` can be called on an `EventualResult`. This allows, for
 * example, for an eventual successful result to tbe transformed without having
 * to resolve the asynchronous action first and without needing to know if the
 * result was successful up front.
 *
 * Like a `Promise`, an `EventualResult` can be resolved (using `.then` or
 * `await`) to retrieve the inner `Result`.
 */
export class EventualResult<T, E = unknown> implements Promise<Result<T, E>> {
  private promise: Promise<T>;

  constructor(originator: Promise<T> | (() => Promise<T>)) {
    if (typeof originator === "function") {
      this.promise = originator();
    } else {
      this.promise = originator;
    }
  }

  /* === Result Methods === */

  map<U>(op: (value: T) => U): EventualResult<U, E> {
    return new EventualResult(this.promise.then(
      (value) => op(value),
    ));
  }

  async mapOr<U>(fallback: U, op: (value: T) => U): Promise<U> {
    const result = await this;

    return result.mapOr(fallback, op);
  }

  andThen<U, F>(
    op: (value: T) => MaybeAsync<Result<U, F>>,
  ): EventualResult<U, F> {
    return new EventualResult(async () => {
      const result = await op(await this.promise);

      if (result.isOk) {
        return result.unwrap();
      }

      throw result.unwrapErr();
    });
  }

  /**
   * Converts the `EventualResult` back to a normal Promise again
   *
   * The `Promise` will resolve to the `Ok` value or reject with the `Err` value
   */
  async unwrap(): Promise<T> {
    try {
      return await this.promise;
    } catch (err) {
      throw new UnwrapError("Cannot unwrap `Err`", { cause: err });
    }
  }

  /**
   * Converts the `EventualResult` back to a normal Promise again
   *
   * The `Promise` will resolve to the `Ok` value or reject with the given message
   * given message
   */
  async expect(message: string): Promise<T> {
    try {
      return await this.promise;
    } catch (err) {
      throw new ExpectError(message, { cause: err });
    }
  }

  /* === Promise Methods === */

  then<TResult1 = Result<T, E>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<T, E>) => MaybeAsync<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: E) => MaybeAsync<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(
      (value) => Ok(value),
      (error: E) => Err(error),
    ).then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: unknown) => MaybeAsync<TResult>)
      | undefined
      | null,
  ): Promise<Result<T, E> | TResult> {
    return this.then(undefined, onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<Result<T, E>> {
    return this.then().finally(onfinally);
  }

  get [Symbol.toStringTag]() {
    return "EventualResult";
  }
}
