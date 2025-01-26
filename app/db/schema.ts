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

export const statusEnum = pgEnum("gift_status", [
  "gone",
  "partially_gone",
  "looking",
  "available",
]);
export const persistenceStatusEnum = createSelectSchema(statusEnum);
export type PersistenceStatusEnum = z.infer<typeof persistenceStatusEnum>;

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
  lists: many(listsToUsersTable),
}));

export const persistenceUserInsert = createInsertSchema(userTable);
export type PersistenceUserInsert = z.infer<typeof persistenceUserInsert>;
export const persistenceUserSelect = createSelectSchema(userTable);
export type PersistenceUserSelect = z.infer<typeof persistenceUserSelect>;

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
export type PersistenceFamilyInsert = z.infer<typeof persistenceFamilyInsert>;
export const persistenceFamilySelect = createSelectSchema(familyTable);
export type PersistenceFamilySelect = z.infer<typeof persistenceFamilySelect>;

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
 *     LISTS
 *
 *************************************/

export const listTable = pgTable("lists", {
  id: uuid().primaryKey().notNull(),
  last_change: timestamp().notNull(),
  name: varchar({ length: MAX_STRING_LENGTH }).notNull(),
  personal: boolean().notNull(),
  ...timestamps,
});

export const listRelations = relations(listTable, ({ many }) => ({
  users: many(listsToUsersTable),
}));

export const persistenceListInsert = createInsertSchema(listTable);
export type PersistenceListInsert = z.infer<typeof persistenceListInsert>;
export const persistenceListSelect = createSelectSchema(listTable);
export type PersistenceListSelect = z.infer<typeof persistenceListSelect>;

/*************************************
 *
 *     LISTS_TO_USERS
 *
 *************************************/

export const listsToUsersTable = pgTable("lists_to_users", {
  id: uuid().primaryKey().notNull(),
  list_id: uuid().notNull(),
  user_id: uuid().notNull(),
  ...timestamps,
});

export const listsToUsersRelations = relations(
  listsToUsersTable,
  ({ one }) => ({
    list: one(listTable, {
      fields: [listsToUsersTable.list_id],
      references: [listTable.id],
    }),
    user: one(userTable, {
      fields: [listsToUsersTable.user_id],
      references: [userTable.id],
    }),
  }),
);

export const persistenceListToUserInsert =
  createInsertSchema(listsToUsersTable);
export type PersistenceListToUserInsert = z.infer<
  typeof persistenceListToUserInsert
>;
export const persistenceListToUserSelect =
  createSelectSchema(listsToUsersTable);
export type PersistenceListToUserSelect = z.infer<
  typeof persistenceListToUserSelect
>;

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
export type PersistenceGiftInsert = z.infer<typeof persistenceGiftInsert>;
export const persistenceGiftSelect = createSelectSchema(giftTable);
export type PersistenceGiftSelect = z.infer<typeof persistenceGiftSelect>;

/*************************************
 *
 *     STATUS
 *
 *************************************/

export const statusTable = pgTable("statuses", {
  created_by: uuid().notNull(),
  gift_id: uuid().notNull(),
  id: uuid().primaryKey().notNull(),
  note: varchar({ length: MAX_STRING_LENGTH }),
  status: statusEnum().notNull(),
  ...timestamps,
});

export const persistenceStatusInsert = createInsertSchema(statusTable);
export type PersistenceStatusInsert = z.infer<typeof persistenceStatusInsert>;
export const persistenceStatusUpdate = createSelectSchema(statusTable);
export type PersistenceStatusUpdate = z.infer<typeof persistenceStatusUpdate>;
