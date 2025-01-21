import { authMiddleware } from "@lib/auth/server/middleware";
import { createServerFn } from "@tanstack/start";

import { GiftCreation, giftCreation } from "./types";

export const createGift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((gift: Partial<GiftCreation>) => giftCreation.parse(gift))
  .handler(({ data }) => {
    console.log(data);
    return {
      ...data,
      addedBy: "foo",
      createdAt: new Date(),
      id: crypto.randomUUID(),
      updatedAt: new Date(),
    };
  });
