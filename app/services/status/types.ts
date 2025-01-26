import { timeTracked, uuid } from "@services/common/types";
import { z } from "zod";

export const statusMessage = z.enum([
  "available",
  "looking",
  "partially_gone",
  "gone",
]);
export type StatusMessage = z.infer<typeof statusMessage>;

export const statusCreation = z.object({
  giftId: z.string(),
  note: z.string().optional(),
  status: statusMessage,
});
export type StatusCreation = z.infer<typeof statusCreation>;

export const status = statusCreation.merge(timeTracked).extend({
  createdAt: z.date(),
  id: uuid,
  updatedAt: z.date(),
});
export type Status = z.infer<typeof status>;
