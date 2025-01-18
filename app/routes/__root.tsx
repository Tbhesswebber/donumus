import { Icon } from "@chakra-ui/react";
import { BasePage } from "@components/layout/basePage";
import { Header } from "@components/layout/header";
import { EmptyState } from "@components/ui/empty-state";
import { Provider } from "@components/ui/provider";
import { AuthProvider } from "@lib/auth/components/provider";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { FiFrown } from "react-icons/fi";

export const Route = createRootRoute({
  component: () => {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    );
  },
  notFoundComponent: () => {
    return (
      <BasePage>
        <EmptyState
          description="The page that you're looking for cannot be found"
          icon={
            <Icon>
              <FiFrown />
            </Icon>
          }
          title="Not Found"
        ></EmptyState>
      </BasePage>
    );
  },
  // @ts-expect-error -- @see https://github.com/TanStack/router/issues/1992#issuecomment-2397896356
  scripts: () =>
    import.meta.env.DEV
      ? [
          {
            children: `import RefreshRuntime from "/_build/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type`,
            type: "module",
          },
        ]
      : [],
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <Provider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
