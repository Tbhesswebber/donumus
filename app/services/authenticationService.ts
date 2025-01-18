import { ClerkClient, createClerkClient } from "@clerk/backend";
import { privateMetadata } from "@lib/auth/common/types";

export class AuthenticationService {
  client: ClerkClient;

  constructor(
    client: ClerkClient = createClerkClient({
      publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
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
    });

    await this.client.users.updateUserMetadata(result.id, {
      privateMetadata: privateMetadata.parse({ internalId: userId }),
    });

    return { authId: result.id };
  }
}
