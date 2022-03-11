import { type Some } from "./some.ts";
import { type None } from "./none.ts";

export type Option<T> = Some<T> | typeof None;
