import { authMiddleware } from "@lib/auth/server/middleware";
import { uuid, Uuid } from "@services/common/types";
import { createServerFn } from "@tanstack/start";

import { StatusService } from "./service";
import { statusCreation, StatusCreation } from "./types";

export const createStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((s: StatusCreation) => statusCreation.parse(s))
  .handler(({ context, data }) => {
    const { userId } = context;
    const statusService = new StatusService();
    return statusService.createStatus(userId, data.giftId, data);
  });

export const getStatusesForGifts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((giftIds: Uuid[]) => giftIds.map((giftId) => uuid.parse(giftId)))
  .handler(({ data }) => {
    const statusService = new StatusService();
    return statusService.getStatusesForGifts(data);
  });
