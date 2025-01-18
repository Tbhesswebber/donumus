import { Link, LinkProps } from "@tanstack/react-router";
import { ReactNode } from "react";

import { Button, ButtonProps } from "./button";

interface LinkButtonProps
  extends Omit<ButtonProps, "children" | "mask">,
    Omit<LinkProps, "children" | "mask"> {
  children: ReactNode;
}

export function LinkButton(props: LinkButtonProps) {
  return <Button {...props} as={Link} />;
}
