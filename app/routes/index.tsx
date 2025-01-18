import { assertAuth } from "@lib/auth/server/actions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => assertAuth(),
  component: Home,
  loader: ({ context }) => {
    return { userId: context.userId };
  },
});

function Home() {
  const state = Route.useLoaderData();

  return <h1>Welcome! Your ID is {state.userId}!</h1>;
}
