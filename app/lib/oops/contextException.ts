export class ContextException extends Error {
  name: "ContextException";

  constructor(name: string) {
    const message = `Context "${name}" must be called within a Context.Provider component`;
    super(message);
  }
}
