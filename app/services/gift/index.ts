import { authMiddleware } from "@lib/auth/server/middleware";
import { createServerFn } from "@tanstack/start";

import { GiftService } from "./service";
import { GiftCreation, giftCreation } from "./types";

export const createGift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((gift: Partial<GiftCreation>) => giftCreation.parse(gift))
  .handler(({ context: { userId }, data: gift }) => {
    const giftService = new GiftService();
    return giftService.createGift(userId, gift);
  });
