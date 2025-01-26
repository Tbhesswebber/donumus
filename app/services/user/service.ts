import { ListService } from "@services/list/service";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../../db";
import {
  persistenceUserInsert,
  persistenceUserSelect,
  userTable,
} from "../../db/schema";

export class UserService {
  constructor(private listService = new ListService()) {}

  async createUser({
    authId,
    email,
    name,
    userId,
  }: {
    authId: string;
    email: string;
    name?: string;
    userId: string;
  }) {
    const persistenceUser = persistenceUserInsert.parse({
      auth_id: authId,
      created_at: new Date(),
      email,
      id: userId,
      name,
      updated_at: new Date(new Date().toISOString()),
    });
    const user = await db.insert(userTable).values(persistenceUser).returning();
    await this.listService.createListForUser(userId, {
      name: user[0].name ?? user[0].email,
      personal: true,
    });
  }

  async getUserByAuthId(authId: string) {
    z.string().parse(authId);
    const rows = await db
      .select()
      .from(userTable)
      .where(eq(userTable.auth_id, authId));
    return persistenceUserSelect.parse(rows[0]);
  }
}
