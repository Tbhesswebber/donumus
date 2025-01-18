import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../../db";
import {
  persistenceUserInsert,
  persistenceUserSelect,
  userTable,
} from "../../db/schema";

export class UserService {
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
    const user = persistenceUserInsert.parse({
      auth_id: authId,
      created_at: new Date(),
      email,
      id: userId,
      name,
      updated_at: new Date(new Date().toISOString()),
    });
    return db.insert(userTable).values(user);
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
