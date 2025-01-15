import { ClerkClient, createClerkClient } from "@clerk/backend";

import { publicMetadata } from "../lib/auth/common/types";

export class AuthenticationService {
  client: ClerkClient;

  constructor(
    client: ClerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    }),
  ) {
    this.client = client;
  }

  async inviteUser({
    email: emailAddress,
    notify,
    userId,
  }: {
    email: string;
    notify: boolean;
    userId: string;
  }) {
    const result = await this.client.invitations.createInvitation({
      emailAddress,
      notify,
      publicMetadata: publicMetadata.parse({ userId }),
    });

    return { authId: result.id };
  }
}
