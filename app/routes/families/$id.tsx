import { assertAuth } from "@lib/auth/server/actions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/families/$id")({
  beforeLoad: () => assertAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/families/$id"!</div>;
}
