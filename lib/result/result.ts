import { OkImpl } from "./ok.ts";
import { ErrImpl } from "./err.ts";

export type Result<T, E> = OkImpl<T> | ErrImpl<E>;
