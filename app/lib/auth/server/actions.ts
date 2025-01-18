import { getAuth } from "@clerk/tanstack-start/server";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";

export const assertAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    return { userId };
  },
);
