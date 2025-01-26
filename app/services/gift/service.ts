import { db } from "@db/index";
import { giftTable, persistenceGiftInsert } from "@db/schema";
import { uuid } from "@services/common/types";
import { StrictBuilder } from "builder-pattern";
import { eq } from "drizzle-orm";

import { gift, Gift, GiftCreation } from "./types";

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
      .id(persistenceGift.id)
      .build();
  }

  async deleteGift(actorId: string, giftId: string): Promise<Gift> {
    const records = await db
      .delete(giftTable)
      .where(eq(giftTable.id, giftId))
      .returning();

    return records.map((record) =>
      StrictBuilder<Gift>()
        .addedBy(record.created_by)
        .createdAt(record.created_at)
        .description(record.description)
        .hidden(!!record.hidden)
        .link(record.link ?? undefined)
        .listId(record.list_id)
        .starred(!!record.starred)
        .updatedAt(record.updated_at)
        .id(record.id)
        .build(),
    )[0];
  }

  async getGiftsInList(listId: string) {
    uuid.parse(listId);
    const records = await db
      .select()
      .from(giftTable)
      .where(eq(giftTable.list_id, listId));

    return records
      .map((record) =>
        StrictBuilder<Gift>()
          .addedBy(record.created_by)
          .createdAt(record.created_at)
          .description(record.description)
          .hidden(!!record.hidden)
          .link(record.link ?? undefined)
          .listId(record.list_id)
          .starred(!!record.starred)
          .updatedAt(record.updated_at)
          .id(record.id)
          .build(),
      )
      .filter((g) => gift.safeParse(g).success);
  }

  async updateGift(actorId: string, giftId: string, gift: Gift): Promise<Gift> {
    const persistenceGift = persistenceGiftInsert.parse({
      created_at: new Date(),
      created_by: gift.addedBy,
      description: gift.description,
      hidden: gift.hidden,
      id: crypto.randomUUID(),
      link: gift.link,
      list_id: gift.listId,
      starred: gift.starred,
      updated_at: new Date(),
    });
    await db
      .update(giftTable)
      .set(persistenceGift)
      .where(eq(giftTable.id, giftId));

    return StrictBuilder<Gift>()
      .addedBy(persistenceGift.created_by)
      .createdAt(persistenceGift.created_at)
      .description(persistenceGift.description)
      .hidden(!!persistenceGift.hidden)
      .link(persistenceGift.link ?? undefined)
      .listId(persistenceGift.list_id)
      .starred(!!persistenceGift.starred)
      .updatedAt(persistenceGift.updated_at)
      .id(persistenceGift.id)
      .build();
  }
}
