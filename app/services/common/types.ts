import { z } from "zod";

export const uuid = z.string().uuid();
export type Uuid = z.infer<typeof uuid>;
