import { StrictBuilder } from "builder-pattern";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

import { db } from "../../db";
import {
  familyTable,
  persistenceFamilyInsert,
  PersistenceFamilyRoleEnum,
  persistenceFamilySelect,
  persistenceUserToFamilyInsert,
  usersToFamiliesTable,
  userTable,
} from "../../db/schema";
import {
  Family,
  familyWithMembers,
  FamilyWithMembers,
  familyWithMembership,
  FamilyWithMembership,
  member,
  Member,
} from "./types";

export class FamilyService {
  async addMemberToFamily({
    familyId,
    role = "member",
    userId,
  }: {
    familyId: string;
    role?: PersistenceFamilyRoleEnum;
    userId: string;
  }) {
    const persistenceRelationship = persistenceUserToFamilyInsert.parse({
      created_at: new Date(),
      family_id: familyId,
      id: crypto.randomUUID(),
      role,
      updated_at: new Date(),
      user_id: userId,
    });
    return await db
      .insert(usersToFamiliesTable)
      .values(persistenceRelationship);
  }

  async createFamily({
    adminId,
    name,
  }: {
    adminId: string;
    name: string;
  }): Promise<Family> {
    const id = crypto.randomUUID();
    const persistenceFamily = persistenceFamilyInsert.parse({
      created_at: new Date(),
      id,
      name,
      updated_at: new Date(),
    });
    await db.insert(familyTable).values(persistenceFamily);
    try {
      await this.addMemberToFamily({
        familyId: persistenceFamily.id,
        role: "admin",
        userId: adminId,
      });
    } catch (e) {
      if (e instanceof ZodError) {
        await this.deleteFamily({ familyId: persistenceFamily.id });
      }
      throw e;
    }

    return StrictBuilder<Family>()
      .createdAt(persistenceFamily.created_at.toISOString())
      .id(persistenceFamily.id)
      .name(persistenceFamily.name)
      .updatedAt(persistenceFamily.updated_at.toISOString())
      .build();
  }

  async deleteFamily({ familyId }: { familyId: string }) {
    return db.delete(familyTable).where(eq(familyTable.id, familyId));
  }

  async getFamiliesForUser(userId: string): Promise<FamilyWithMembership[]> {
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
  }

  async getFamily(familyId: string) {
    const family = await db
      .select()
      .from(familyTable)
      .where(eq(familyTable.id, familyId));

    return persistenceFamilySelect.parse(family[0]);
  }

  async getFamilyWithMembers(familyId: string) {
    const familyPromise = this.getFamily(familyId);
    const membersPromise = db
      .select()
      .from(usersToFamiliesTable)
      .leftJoin(userTable, eq(userTable.id, usersToFamiliesTable.user_id))
      .where(eq(usersToFamiliesTable.family_id, familyId));

    const [persistenceFamily, persistenceMembers] = await Promise.all([
      familyPromise,
      membersPromise,
    ]);

    console.log(JSON.stringify({ persistenceMembers }, null, 2));

    const members = persistenceMembers
      .map(({ users, users_to_families }) =>
        StrictBuilder<Partial<Member>>()
          .id(users?.id)
          .email(users?.email)
          .name(users?.name ?? undefined)
          .joinedAt(users_to_families.created_at.toISOString())
          .isAdmin(users_to_families.role === "admin")
          .build(),
      )
      .filter((m): m is Member => member.safeParse(m).success);

    const family = StrictBuilder<FamilyWithMembers>()
      .createdAt(persistenceFamily.created_at.toISOString())
      .id(persistenceFamily.id)
      .name(persistenceFamily.name)
      .updatedAt(persistenceFamily.updated_at.toISOString())
      .members(members)
      .build();

    return familyWithMembers.parse(family);
  }
}
