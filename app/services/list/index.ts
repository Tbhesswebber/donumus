import { ListWithGifts } from "@features/lists/types";
import { authMiddleware } from "@lib/auth/server/middleware";
import { uuid } from "@services/common/types";
import { GiftService } from "@services/gift/service";
import { createServerFn } from "@tanstack/start";

import { ListService } from "./service";

export const getListsForUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((userId: string) => uuid.parse(userId))
  .handler(async ({ data: userId }) => {
    const listService = new ListService();
    return listService.getListsForUser(userId);
  });

export const getHydratedListsForUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((userId: string) => uuid.parse(userId))
  .handler(async ({ data: userId }): Promise<ListWithGifts[]> => {
    const listService = new ListService();
    const giftService = new GiftService();

    const lists = await listService.getListsForUser(userId);
    const listsWithGifts = await Promise.all(
      lists.map(async (list) => {
        const gifts = await giftService.getGiftsInList(list.id);
        return { ...list, gifts };
      }),
    );

    return listsWithGifts;
  });
