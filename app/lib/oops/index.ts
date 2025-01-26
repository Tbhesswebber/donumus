import { ZodError } from "zod";

export function isErrorFromZod<T>(value: unknown): value is ZodError<T> {
  return value instanceof Error && value.name === "ZodError";
}
