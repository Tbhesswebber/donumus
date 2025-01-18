import { z } from "zod";

export const user = z.object({
  authId: z.string().uuid(),
  createdAt: z.string().datetime(),
  email: z.string().email(),
  id: z.string().uuid(),
  name: z.string().optional(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof user>;

export const createPersistenceUser = z.object({
  authId: z.string().uuid(),
  email: z.string(),
  name: z.string().optional(),
  userId: z.string().uuid(),
});
export type CreatePersistenceUser = z.infer<typeof createPersistenceUser>;
