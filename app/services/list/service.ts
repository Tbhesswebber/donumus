import { db } from "@db/index";
import {
  listsToUsersTable,
  listTable,
  PersistenceListInsert,
  persistenceListInsert,
  PersistenceListToUserInsert,
  persistenceListToUserInsert,
} from "@db/schema";
import { uuid, Uuid } from "@services/common/types";
import { StrictBuilder } from "builder-pattern";
import { eq } from "drizzle-orm";

import { list, List, listCreation, ListCreation } from "./types";

export class ListService {
  async createListForUser(userId: Uuid, list: ListCreation) {
    listCreation.parse(list);
    const persistenceList = persistenceListInsert.parse(
      StrictBuilder<PersistenceListInsert>()
        .created_at(new Date())
        .id(crypto.randomUUID())
        .last_change(new Date())
        .name(list.name)
        .personal(list.personal)
        .updated_at(new Date())
        .build(),
    );
    const persistedList = await db
      .insert(listTable)
      .values(persistenceList)
      .returning();
    try {
      const persistenceListToUser = persistenceListToUserInsert.parse(
        StrictBuilder<PersistenceListToUserInsert>()
          .created_at(new Date())
          .id(crypto.randomUUID())
          .list_id(persistenceList.id)
          .updated_at(new Date())
          .user_id(),
      );
      await db.insert(listsToUsersTable).values(persistenceListToUser);
    } catch (e) {
      await db.delete(listTable).where(eq(listTable.id, persistenceList.id));
      throw e;
    }
    return persistedList.at(0);
  }

  async getListsForUser(userId: Uuid) {
    const parsedUserId = uuid.parse(userId);
    const results = await db
      .select()
      .from(listsToUsersTable)
      .leftJoin(listTable, eq(listsToUsersTable.list_id, listTable.id))
      .where(eq(listsToUsersTable.user_id, parsedUserId));

    return results
      .map(({ lists: list }) => {
        if (!list) return list;
        return StrictBuilder<List>()
          .createdAt(list.created_at)
          .id(list.id)
          .lastChangeTime(list.last_change)
          .name(list.name)
          .personal(!!list.personal)
          .updatedAt(list.updated_at)
          .build();
      })
      .filter((l): l is List => list.safeParse(l).success);
  }
}
