import { EventualResult } from "./lib/result/eventual.ts";

// Type of `eventualError1` is inferred to be `EventualResult<unknown, unknown>` (incorrect)
const _eventualError1 = new EventualResult(Promise.reject("Oops!"));

// Type of `eventualError2` is inferred to be `EventualResult<never, unknown>` (correct)
const rejection = Promise.reject("Oops!");
const _eventualError2 = new EventualResult(rejection);

// Question: why does creating the `rejection` binding impact the type inference?
