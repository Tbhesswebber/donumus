import { ClerkProvider } from "@clerk/tanstack-start";
import { Provider } from "@components/ui/provider";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import * as React from "react";

export const Route = createRootRoute({
  component: () => {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    );
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html>
        <head>
          <Meta />
        </head>
        <body>
          <Provider>{children}</Provider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  );
}
