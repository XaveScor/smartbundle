import { type Args } from "./args.js";

export type Task<T> = () => T | PromiseLike<T>;

export async function runSettled<T>(
  args: Args,
  tasks: Iterable<Task<T>>,
): Promise<PromiseSettledResult<Awaited<T>>[]> {
  if (args.seq) {
    const results = new Array<PromiseSettledResult<Awaited<T>>>();

    for (const task of tasks) {
      try {
        const result = await task();
        results.push({ status: "fulfilled", value: result });
      } catch (error) {
        results.push({ status: "rejected", reason: error });
      }
    }
    return results;
  }

  return Promise.allSettled([...tasks].map((task) => task()));
}
