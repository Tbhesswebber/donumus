import { timeTracked, uuid } from "@services/common/types";
import { z } from "zod";

export const listCreation = z.object({
  name: z.string(),
  personal: z.boolean(),
});
export type ListCreation = z.infer<typeof listCreation>;

export const list = listCreation.merge(timeTracked).extend({
  id: uuid,
  lastChangeTime: z.date(),
  personal: z.boolean().default(false),
});
export type List = z.infer<typeof list>;
