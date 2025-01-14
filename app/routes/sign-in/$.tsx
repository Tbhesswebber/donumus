import { SignIn } from "@lib/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/$")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignIn />;
}
