import { db } from "@db/index";
import {
  PersistenceStatusInsert,
  persistenceStatusInsert,
  statusTable,
} from "@db/schema";
import { uuid } from "@services/common/types";
import { StrictBuilder } from "builder-pattern";
import { inArray } from "drizzle-orm";

import { Status, StatusCreation, status as statusParser } from "./types";

export class StatusService {
  async createStatus(userId: string, giftId: string, status: StatusCreation) {
    const persistenceStatus = persistenceStatusInsert.parse(
      StrictBuilder<PersistenceStatusInsert>()
        .created_at(new Date())
        .created_by(userId)
        .gift_id(giftId)
        .id(crypto.randomUUID())
        .note(status.note)
        .status(status.status)
        .updated_at(new Date())
        .build(),
    );

    const [record] = await db
      .insert(statusTable)
      .values(persistenceStatus)
      .returning();

    return statusParser.parse(
      StrictBuilder<Status>()
        .createdAt(record.created_at)
        .giftId(record.gift_id)
        .id(record.id)
        .note(record.note ?? undefined)
        .status(record.status)
        .updatedAt(record.updated_at)
        .build(),
    );
  }

  async getStatusesForGift(giftId: string) {
    return this.getStatusesForGifts([giftId]);
  }

  async getStatusesForGifts(giftIds: string[]) {
    const parsedUuids = giftIds.map((giftId) => uuid.parse(giftId));
    const records = await db
      .select()
      .from(statusTable)
      .where(inArray(statusTable.gift_id, parsedUuids));

    return records.map((record) =>
      statusParser.parse(
        StrictBuilder<Status>()
          .createdAt(record.created_at)
          .giftId(record.gift_id)
          .id(record.id)
          .note(record.note ?? undefined)
          .status(record.status)
          .updatedAt(record.updated_at)
          .build(),
      ),
    );
  }
}
