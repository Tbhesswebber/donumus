import { z } from "zod";

export const DisplayValue = z.object({
  label: z.string().nonempty(),
  value: z.string().uuid(),
});
export type DisplayValue = z.infer<typeof DisplayValue>;
