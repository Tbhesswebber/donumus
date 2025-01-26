import { NotFound } from "@components/notFound";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    defaultErrorComponent: ({ error }) => (
      <NotFound
        description="An unknown error has occurred.  Please report this to your admin."
        error={error}
        status="500"
        title="Unknown Error"
      />
    ),
    defaultNotFoundComponent: () => (
      <NotFound
        description="An unknown error has occurred.  Please report this to your admin."
        status="500"
        title="Unknown Error"
      />
    ),
    routeTree,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
