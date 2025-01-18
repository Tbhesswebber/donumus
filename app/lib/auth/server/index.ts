import { AuthObject } from "@clerk/backend";

export function assertUser(
  user: unknown,
): asserts user is Exclude<AuthObject, { userId: null }> {
  const castUser = user as Exclude<AuthObject, { userId: null }>;
  if (!castUser.userId) {
    const err = new Error("User is not a valid user");
    err.name = "AuthenticationError";
    throw err;
  }
}
