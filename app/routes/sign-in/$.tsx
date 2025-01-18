import { Center } from "@chakra-ui/react";
import { SignIn } from "@lib/auth/components";
import { assertNoAuth } from "@lib/auth/server/actions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/$")({
  beforeLoad: () => assertNoAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center mt="12">
      <SignIn />
    </Center>
  );
}
