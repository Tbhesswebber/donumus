import { z } from "zod";

export const family = z.object({
  createdAt: z.string().datetime(),
  id: z.string().uuid(),
  name: z.string().nonempty(),
  updatedAt: z.string().datetime(),
});
export type Family = z.infer<typeof family>;

export const familyWithMembership = family.extend({
  isAdmin: z.boolean(),
  joinedAt: z.string().datetime(),
});
export type FamilyWithMembership = z.infer<typeof familyWithMembership>;
