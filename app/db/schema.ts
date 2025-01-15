import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const userTable = pgTable("users", {
  auth_id: uuid().notNull().unique(),
  created_at: timestamp().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: uuid().primaryKey().notNull().unique(),
  name: varchar({ length: 255 }),
  updated_at: timestamp().notNull(),
});

export const persistenceUserInsert = createInsertSchema(userTable);
