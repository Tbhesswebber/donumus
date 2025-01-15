import { getAuth } from "@clerk/tanstack-start/server";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { z } from "zod";

import { AuthenticationService } from "../../../services/authenticationService";
import { UserService } from "../../../services/user";

export const APIRoute = createAPIFileRoute("/api/users/invite")({
  POST: async ({ request }) => {
    const authService = new AuthenticationService();
    const userService = new UserService();
    const [body, { userId }] = await Promise.all([
      request.json() as Promise<unknown>,
      getAuth(request),
    ]);

    if (!userId) {
      return new Response(undefined, { status: 403 });
    }

    const result = invitationRequest.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.issues }), {
        status: 400,
      });
    }

    const invitedUserId = crypto.randomUUID();

    const { authId } = await authService.inviteUser({
      email: result.data.email,
      notify: result.data.notify,
      userId: invitedUserId,
    });
    await userService.createUser({
      authId,
      email: result.data.email,
      userId: invitedUserId,
    });

    return json({ message: 'Hello "/api/users/invite"!' });
  },
});

const invitationRequest = z.object({
  email: z.string().email(),
  notify: z.boolean(),
});
