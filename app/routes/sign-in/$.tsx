import { SignIn } from "@lib/auth/components";
import { useUser } from "@lib/auth/components/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/sign-in/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const user = useUser();

  useEffect(() => {
    if (user.isLoaded) {
      navigate({ replace: true, to: "/families" }).catch(() => undefined);
    }
  });

  return <SignIn />;
}
