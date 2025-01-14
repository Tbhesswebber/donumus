import { getAuth } from "@clerk/tanstack-start/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";

const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await getAuth(getWebRequest());

  if (!userId) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    throw redirect({
      to: "/sign-in/$",
    });
  }

  return { userId };
});

export const Route = createFileRoute("/")({
  beforeLoad: async () => await authStateFn(),
  component: Home,
  loader: ({ context }) => {
    return { userId: context.userId };
  },
});

function Home() {
  const state = Route.useLoaderData();

  return <h1>Welcome! Your ID is {state.userId}!</h1>;
}
