import { type Args } from "./args.js";

export async function runSettled<T extends readonly unknown[] | []>(
  args: Args,
  promises: T,
): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>;
export async function runSettled<T>(
  args: Args,
  promises: Iterable<T | PromiseLike<T>>,
): Promise<PromiseSettledResult<Awaited<T>>[]>;
export async function runSettled<T>(
  args: Args,
  promises: Iterable<T | PromiseLike<T>>,
): Promise<PromiseSettledResult<Awaited<T>>[]> {
  if (args.seq) {
    const results = new Array<PromiseSettledResult<Awaited<T>>>();

    for (const promise of promises) {
      try {
        const result = await promise;
        results.push({ status: "fulfilled", value: result });
      } catch (error) {
        results.push({ status: "rejected", reason: error });
      }
    }
    return results;
  }

  return Promise.allSettled(promises);
}
