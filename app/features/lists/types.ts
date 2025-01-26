import { gift } from "@services/gift/types";
import { list } from "@services/list/types";
import { status } from "@services/status/types";
import { z } from "zod";

export const listWithGifts = list.extend({ gifts: z.array(gift) });
export type ListWithGifts = z.infer<typeof listWithGifts>;

export const giftWithStatus = gift.extend({ statuses: z.array(status) });
export type GiftWithStatus = z.infer<typeof giftWithStatus>;

export const listWithGiftsAndStatus = list.extend({
  gifts: z.array(giftWithStatus),
});
export type ListWithGiftsAndStatus = z.infer<typeof listWithGiftsAndStatus>;
