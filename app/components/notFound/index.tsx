import { BasePage } from "@components/layout/basePage";
import { Fragment, lazy } from "react";

export interface NotFoundProps {
  description: string;
  error?: Error;
  status: "400" | "404" | "500";
  title?: string;
}

const DevNotFound = lazy(() =>
  import("./dev").then((module) => ({
    default: import.meta.env.DEV ? module.DevNotFound : Fragment,
  })),
);

export function NotFound({ error, status }: NotFoundProps) {
  return (
    <BasePage>
      Not found - {status}
      <DevNotFound error={error} status={status} />
    </BasePage>
  );
}
