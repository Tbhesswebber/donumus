import { getAuth } from "@clerk/tanstack-start/server";
// import { getUserByAuthId } from "@services/user";
import { UserService } from "@services/user/service";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { userId } = await getAuth(getWebRequest());
  if (!userId) {
    throw redirect({ to: "/sign-in/$" });
  }
  const userService = new UserService();
  const internalUser = await userService.getUserByAuthId(userId);
  const result = await next({
    context: { authId: userId, userId: internalUser.id },
  });
  return result;
});
