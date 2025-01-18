import { db } from "@db/index";
import { familyTable, usersToFamiliesTable } from "@db/schema";
import { authMiddleware } from "@lib/auth/server/middleware";
import { createServerFn } from "@tanstack/start";
import { StrictBuilder } from "builder-pattern";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { FamilyWithMembership, familyWithMembership } from "./types";

export const getFamiliesForUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((userId: string) => z.string().uuid().parse(userId))
  .handler(async ({ data: userId }) => {
    const rows = await db
      .select()
      .from(usersToFamiliesTable)
      .leftJoin(familyTable, eq(usersToFamiliesTable.family_id, familyTable.id))
      .where(eq(usersToFamiliesTable.user_id, userId));

    return rows
      .map(({ families, users_to_families: usersToFamilies }) => {
        if (!families) return undefined;

        return StrictBuilder<FamilyWithMembership>()
          .createdAt(families.created_at.toISOString())
          .updatedAt(families.updated_at.toISOString())
          .name(families.name)
          .id(families.id)
          .isAdmin(usersToFamilies.role === "admin")
          .joinedAt(usersToFamilies.created_at.toISOString())
          .build();
      })
      .filter(
        (f: unknown): f is FamilyWithMembership =>
          familyWithMembership.safeParse(f).success,
      );
  });
