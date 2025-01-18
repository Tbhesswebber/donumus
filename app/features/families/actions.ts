import { authMiddleware } from "@lib/auth/server/middleware";
import { createServerFn } from "@tanstack/start";

import { FamilyService } from "../../services/family/service";
import { family, Family } from "./types";

export const createFamily = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Family) => family.parse(data))
  .handler(async ({ context, data }) => {
    const { userId } = context;
    if (!userId) {
      throw new Error("Users must be authenticated");
    }
    const { name } = data;

    const familyService = new FamilyService();
    return familyService.createFamily({ adminId: userId, name });
  });
