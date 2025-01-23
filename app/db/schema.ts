import { MAX_STRING_LENGTH } from "@root/commons/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/*************************************
 *
 *     COMMONS
 *
 *************************************/

const timestamps = {
  created_at: timestamp().notNull(),
  updated_at: timestamp().notNull(),
};

/*************************************
 *
 *     ENUMS
 *
 *************************************/

export const familyRoleEnum = pgEnum("family_role", ["admin", "member"]);

export const persistenceFamilyRoleEnum = createSelectSchema(familyRoleEnum);
export type PersistenceFamilyRoleEnum = z.infer<
  typeof persistenceFamilyRoleEnum
>;

/*************************************
 *
 *     USERS
 *
 *************************************/

export const userTable = pgTable("users", {
  auth_id: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: uuid().primaryKey().notNull().unique(),
  name: varchar({ length: 255 }),
  ...timestamps,
});

export const userRelations = relations(userTable, ({ many }) => ({
  families: many(usersToFamiliesTable),
}));

export const persistenceUserInsert = createInsertSchema(userTable);
export const persistenceUserSelect = createSelectSchema(userTable);

/*************************************
 *
 *     FAMILIES
 *
 *************************************/

export const familyTable = pgTable("families", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const familyRelations = relations(familyTable, ({ many }) => ({
  members: many(usersToFamiliesTable),
}));

export const persistenceFamilyInsert = createInsertSchema(familyTable);
export const persistenceFamilySelect = createSelectSchema(familyTable);

/*************************************
 *
 *     USERS_TO_FAMILIES
 *
 *************************************/

export const usersToFamiliesTable = pgTable(
  "users_to_families",
  {
    family_id: uuid()
      .notNull()
      .references(() => familyTable.id),
    id: uuid().primaryKey().notNull(),
    role: familyRoleEnum().notNull(),
    ...timestamps,

    user_id: uuid().references(() => userTable.id),
  },
  (t) => [uniqueIndex("family_to_user_index").on(t.family_id, t.user_id)],
);

export const usersToFamiliesRelations = relations(
  usersToFamiliesTable,
  ({ one }) => ({
    family: one(familyTable, {
      fields: [usersToFamiliesTable.family_id],
      references: [familyTable.id],
    }),
    user: one(userTable, {
      fields: [usersToFamiliesTable.user_id],
      references: [userTable.id],
    }),
  }),
);

export const persistenceUserToFamilyInsert =
  createInsertSchema(usersToFamiliesTable);
export const persistenceUserToFamilySelect =
  createSelectSchema(usersToFamiliesTable);

/*************************************
 *
 *     GIFTS
 *
 *************************************/

export const giftTable = pgTable("gifts", {
  created_by: uuid().notNull(),
  description: varchar({ length: MAX_STRING_LENGTH }).notNull(),
  hidden: boolean(),
  id: uuid().primaryKey().notNull(),
  link: varchar({ length: MAX_STRING_LENGTH }),
  list_id: uuid().notNull(),
  starred: boolean(),
  ...timestamps,
});

export const persistenceGiftInsert = createInsertSchema(giftTable);
export const persistenceGiftSelect = createSelectSchema(giftTable);
