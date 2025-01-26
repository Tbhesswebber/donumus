import { Header } from "@components/layout/header";
import { NotFound } from "@components/notFound";
import { Provider } from "@components/ui/provider";
import { AuthProvider } from "@lib/auth/components/provider";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";

export const Route = createRootRoute({
  component: () => {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    );
  },
  errorComponent: ({ error }) => (
    <NotFound
      description="An unknown error has occurred.  Please report this to your admin."
      error={error}
      status="500"
      title="Unknown Error"
    />
  ),
  head: () => ({
    links: [
      { href: "/favicon.svg", rel: "shortcut icon", type: "image/svg+xml" },
    ],
    meta: [{ title: "donum(us) - beta" }],
  }),
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
