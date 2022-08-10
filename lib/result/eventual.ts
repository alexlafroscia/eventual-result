import { type Result } from "./result.ts";
import { Ok } from "./ok.ts";
import { Err } from "./err.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

type MaybeAsync<T> = T | PromiseLike<T>;

type ValueOrResult<T, E> = Result<T, E> | T;

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
 *
 * The provided `Promise` can either resolve to a "normal" value, a `Result`, or
 * can reject to some error; all of these cases are handled.
 */
export class EventualResult<T, E = unknown> implements Promise<Result<T, E>> {
  private promise: Promise<T>;

  constructor(
    originator:
      | (() => Promise<ValueOrResult<T, E>>)
      | Promise<ValueOrResult<T, E>>,
  ) {
    try {
      const promise = typeof originator === "function"
        ? originator()
        : originator;

      // Handle the promise resolving to a `Result`
      this.promise = promise.then((result) => {
        // If it's an `Ok` then we can unwrap it
        if (result instanceof Ok) {
          return result.unwrap();
        }

        // If it's an `Err` then it should throw the inner error
        if (result instanceof Err) {
          throw result.unwrapErr();
        }

        // Otherwise we can just pass it through
        return result;
      });
    } catch (e) {
      this.promise = Promise.reject(e);
    }
  }

  /* === Result Methods === */

  /**
   * Converts the `EventualResult` to a `Promise`
   *
   * The `Promise` will resolve to the `Ok` value or reject with the `Err` value
   */
  async unwrap(): Promise<T> {
    try {
      return await this.promise;
    } catch (err) {
      throw new UnwrapError("Cannot unwrap `Err`", err);
    }
  }

  /**
   * Converts the `EventualResult` to a `Promise`
   *
   * The `Promise` will resolve to the `Ok` value if possible, falling back to
   * the given `fallback` value in case of an `Err`
   */
  async unwrapOr(fallback: T): Promise<T> {
    try {
      return await this.promise;
    } catch {
      return fallback;
    }
  }

  /**
   * Resolves to the underlying error if `EventualResult` rejects
   *
   * Returns a rejecting `Promise` if the `EventualResult` represents a success
   */
  async unwrapErr(): Promise<E> {
    try {
      // Resolve the promise to see if it results in an error
      await this.promise;

      // If that "passed", we shouldn't be able to unwrap to an error
      throw new UnwrapError(
        "Cannot unwrap resolving `EventualResult` to `Err`",
      );
    } catch (e) {
      // If we re-caught the error we just threw, throw it again
      if (e instanceof UnwrapError) {
        throw e;
      }

      // Otherwise, return the error
      return e;
    }
  }

  /**
   * Converts the `EventualResult` to a `Promise`
   *
   * The `Promise` will resolve to the `Ok` value or reject with the given
   * message
   */
  async expect(message: string): Promise<T> {
    try {
      return await this.promise;
    } catch (err) {
      throw new ExpectError(message, err);
    }
  }

  /**
   * Transforms an `EventualResult<T>` into an `EventualResult<U>`
   */
  map<U>(op: (value: T) => MaybeAsync<U>): EventualResult<U, E> {
    return new EventualResult(this.promise.then(
      (value) => op(value),
    ));
  }

  /**
   * Transforms an `EventualResult<T, E>` into an `EventualResult<T, F>`
   */
  mapErr<F>(op: (value: E) => MaybeAsync<F>): EventualResult<T, F> {
    return new EventualResult(this.promise.catch(
      async (value) => Promise.reject(await op(value)),
    ));
  }

  /**
   * Transforms an `EventualResult<T>` into a `Promise<U>`
   *
   * If the `EventualResult` is eventually `Ok`, the callback is applied to it
   * and the `Promise` resolves to the result.
   *
   * If the `EventualResult` is eventually `Err`, the `Promise` resolves to the
   * fallback value.
   */
  async mapOr<U>(fallback: U, op: (value: T) => MaybeAsync<U>): Promise<U> {
    const result = await this;

    return result.mapOr(fallback, op);
  }

  /**
   * Transforms an `EventualResult<T>` into a `Promise<U>`
   *
   * If the `EventualResult` is eventually `Ok`, the callback is applied to it
   * and the `Promise` resolves to the result.
   *
   * If the `EventualResult` is eventually `Err`, the `Promise` resolves to the
   * fallback value.
   */
  async mapOrElse<U>(
    fallback: () => MaybeAsync<U>,
    op: (value: T) => MaybeAsync<U>,
  ): Promise<U> {
    const result = await this;

    return result.mapOrElse(fallback, op);
  }

  /**
   * Transforms an `EventualResult<T>` into an `EventualResult<U>`
   *
   * The provided operation is only applied if the `EventualResult` is
   * eventually `Ok`.
   *
   * The operation can synchronous or asynchronously return a new `Result` for
   * the resulting `EventualResult` to wrap.
   */
  andThen<U, F>(
    op: (value: T) => MaybeAsync<Result<U, F>>,
  ): EventualResult<U, F> {
    return new EventualResult(async () => {
      return op(await this.promise);
    });
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
      (value) => new Ok(value),
      (error: E) => new Err(error),
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
