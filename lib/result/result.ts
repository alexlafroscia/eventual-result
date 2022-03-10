import { OkImpl } from "./ok.ts";
import { ErrImpl } from "./err.ts";

/**
 * Represents either a successful value (`OkImpl<T>`) or an error (`ErrImpl<E>`)
 *
 * See [`ResultMethods`]{@link import('./methods.ts').ResultMethods} for method documentation
 *
 * @template T The type of the successful value that the `Result` could contain
 * @template E The type of the error value that the `Result` could contain
 */
export type Result<T, E> = OkImpl<T> | ErrImpl<E>;
