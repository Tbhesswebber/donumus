import { db } from "../db";
import { persistenceUserInsert, userTable } from "../db/schema";

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
      created_at: new Date().toISOString(),
      email,
      id: userId,
      name,
      updated_at: new Date().toISOString(),
    });
    return db.insert(userTable).values(user);
  }
}
