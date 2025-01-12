type Hierarchy = Array<PromiseSettledResult<any> | Hierarchy>;

export function promiseSettledResultErrors<H extends Hierarchy>(results: H) {
  const errors: Array<any> = [];
  for (const result of results) {
    if (Array.isArray(result)) {
      errors.push(promiseSettledResultErrors(result));
    } else if (result.status === "rejected") {
      errors.push(result.reason);
    }
  }
  return errors.flat(Infinity);
}
