import { z } from "zod";

export const privateMetadata = z.object({ internalId: z.string() });
export type PrivateMetadata = z.infer<typeof privateMetadata>;
