import { db } from "@db/index";
import { giftTable, persistenceGiftInsert } from "@db/schema";
import { StrictBuilder } from "builder-pattern";

import { Gift, GiftCreation } from "./types";

export class GiftService {
  async createGift(creatorId: string, gift: GiftCreation): Promise<Gift> {
    const persistenceGift = persistenceGiftInsert.parse({
      created_at: new Date(),
      created_by: creatorId,
      description: gift.description,
      hidden: gift.hidden,
      id: crypto.randomUUID(),
      link: gift.link,
      list_id: gift.listId,
      starred: gift.starred,
      updated_at: new Date(),
    });
    await db.insert(giftTable).values(persistenceGift);

    return StrictBuilder<Gift>()
      .addedBy(persistenceGift.created_by)
      .createdAt(persistenceGift.created_at)
      .description(persistenceGift.description)
      .hidden(!!persistenceGift.hidden)
      .link(persistenceGift.link ?? undefined)
      .listId(persistenceGift.list_id)
      .starred(!!persistenceGift.starred)
      .updatedAt(persistenceGift.updated_at)
      .build();
  }
}
