import { type SomeImpl } from "./some.ts";
import { type NoneImpl } from "./none.ts";

export type Option<T> = SomeImpl<T> | NoneImpl;
