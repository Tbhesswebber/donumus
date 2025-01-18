import { uuid } from "@services/common/types";
import { user } from "@services/user/types";
import { z } from "zod";

export const family = z.object({
  createdAt: z.string().datetime(),
  id: uuid,
  name: z.string().nonempty(),
  updatedAt: z.string().datetime(),
});
export type Family = z.infer<typeof family>;

export const membershipPartial = z.object({
  isAdmin: z.boolean(),
  joinedAt: z.string().datetime(),
});
export type MembershipPartial = z.infer<typeof membershipPartial>;

export const member = user
  .pick({ email: true, id: true, name: true })
  .merge(membershipPartial);
export type Member = z.infer<typeof member>;

export const familyWithMembership = family.merge(membershipPartial);
export type FamilyWithMembership = z.infer<typeof familyWithMembership>;

export const familyWithMembers = family.extend({
  members: member.array(),
});
export type FamilyWithMembers = z.infer<typeof familyWithMembers>;
