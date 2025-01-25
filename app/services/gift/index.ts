import { authMiddleware } from "@lib/auth/server/middleware";
import { uuid, Uuid } from "@services/common/types";
import { createServerFn } from "@tanstack/start";

import { GiftService } from "./service";
import { Gift, GiftCreation, giftCreation, gift as giftParser } from "./types";

export const createGift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((gift: Partial<GiftCreation>) => giftCreation.parse(gift))
  .handler(({ context: { userId }, data: gift }) => {
    const giftService = new GiftService();
    return giftService.createGift(userId, gift);
  });

export const updateGift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((gift: Partial<Gift>) => giftParser.parse(gift))
  .handler(({ context: { userId }, data: gift }) => {
    const giftService = new GiftService();
    return giftService.updateGift(userId, gift.id, gift);
  });

export const deleteGift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((giftId: Uuid) => uuid.parse(giftId))
  .handler(({ context: { userId }, data: giftId }) => {
    const giftService = new GiftService();
    return giftService.deleteGift(userId, giftId);
  });
