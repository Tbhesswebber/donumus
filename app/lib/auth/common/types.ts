import { z } from "zod";

export const publicMetadata = z.object({ userId: z.string() });
export type PublicMetadata = z.infer<typeof publicMetadata>;
