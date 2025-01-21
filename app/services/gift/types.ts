import { MAX_STRING_LENGTH } from "@root/commons/constants";
import { timeTracked, uuid } from "@services/common/types";
import { z } from "zod";

export const giftCreation = z.object({
  description: z.string().nonempty().max(MAX_STRING_LENGTH),
  hidden: z.boolean(),
  link: z.string().url().optional(),
  listId: uuid,
  starred: z.boolean(),
});
export type GiftCreation = z.infer<typeof giftCreation>;

export const gift = z
  .object({
    addedBy: uuid,
  })
  .merge(timeTracked)
  .merge(giftCreation);
export type Gift = z.infer<typeof gift>;
