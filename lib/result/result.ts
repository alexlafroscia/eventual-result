import { Ok } from "./ok.ts";
import { Err } from "./err.ts";

export type Result<T, E> = Ok<T> | Err<E>;
