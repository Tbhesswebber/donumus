import { z } from "zod";

export const family = z.object({ name: z.string().nonempty() });

export type Family = z.infer<typeof family>;
