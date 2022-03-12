import { Err, EventualResult, Ok } from "../../lib/mod.ts";

type AllRunOptions = Parameters<typeof Deno.run>[0];
type RunOptions =
  & Omit<AllRunOptions, "stdin" | "stderr" | "stdout">
  & Required<Pick<AllRunOptions, "cmd">>;

type Output = {
  stdout: string;
  stderr: string;
};

/**
 * Run a shell command
 */
export function run(
  options: RunOptions,
): EventualResult<Output, Output> {
  return new EventualResult(async () => {
    const p = Deno.run({
      ...options,
      // stdin: "null",
      stderr: "piped",
      stdout: "piped",
    });

    const result = await p.status();
    const decoder = new TextDecoder();

    const stdout = decoder.decode(await p.output());
    const stderr = decoder.decode(await p.stderrOutput());

    if (result.success) {
      return new Ok({ stdout, stderr });
    } else {
      return new Err({ stdout, stderr });
    }
  });
}
