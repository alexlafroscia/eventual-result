import { Err, Ok, type Result as ResultWithErrorType } from "../result/mod.ts";
import { ExpectError, UnwrapError } from "../exceptions.ts";

type Result<T> = ResultWithErrorType<T, unknown>;

type MaybeAsync<T> = T | PromiseLike<T>;

export class EventualResult<T> implements Promise<Result<T>> {
  private promise: Promise<T>;

  constructor(originator: Promise<T> | (() => Promise<T>)) {
    if (typeof originator === "function") {
      this.promise = originator();
    } else {
      this.promise = originator;
    }
  }

  /** === Result Methods === */

  map<U>(op: (value: T) => U): EventualResult<U> {
    return new EventualResult(this.promise.then(
      (value) => op(value),
    ));
  }

  async mapOr<U>(fallback: U, op: (value: T) => U): Promise<U> {
    const result = await this;

    return result.mapOr(fallback, op);
  }

  andThen<U>(op: (value: T) => MaybeAsync<Result<U>>): EventualResult<U> {
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

  then<TResult1 = Result<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<T>) => MaybeAsync<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: unknown) => MaybeAsync<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(
      (value) => Ok(value),
      (error: unknown) => Err(error),
    ).then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: unknown) => MaybeAsync<TResult>)
      | undefined
      | null,
  ): Promise<Result<T> | TResult> {
    return this.then(undefined, onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<Result<T>> {
    return this.then().finally(onfinally);
  }

  get [Symbol.toStringTag]() {
    return "EventualResult";
  }
}
