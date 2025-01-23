import { authMiddleware } from "@lib/auth/server/middleware";
import { uuid } from "@services/common/types";
import { createServerFn } from "@tanstack/start";

import { ListService } from "./service";

export const getListsForUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((userId: string) => uuid.parse(userId))
  .handler(async ({ data: userId }) => {
    const listService = new ListService();
    return listService.getListsForUser(userId);
  });
