import { authMiddleware } from "@lib/auth/server/middleware";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { UserService } from "./service";
import { createPersistenceUser } from "./types";

export const createUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (user: { authId: string; email: string; name?: string; userId: string }) =>
      createPersistenceUser.parse(user),
  )
  .handler(({ data: user }) => {
    const userService = new UserService();
    return userService.createUser(user);
  });

export const getUserByAuthId = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((authId: string) => z.string().parse(authId))
  .handler(async ({ data: authId }) => {
    const userService = new UserService();
    return userService.getUserByAuthId(authId as unknown as string);
  });
