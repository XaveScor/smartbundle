export class BuildError extends Error {
  constructor(public error: string) {
    super(error);
  }
}
