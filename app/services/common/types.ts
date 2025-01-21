import { z } from "zod";

export const uuid = z.string().uuid();
export type Uuid = z.infer<typeof uuid>;

export const timeTracked = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TimeTracked = z.infer<typeof timeTracked>;
