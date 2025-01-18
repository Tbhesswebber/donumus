import { Link as ChakraLink } from "@chakra-ui/react";
import {
  Link as RawLink,
  LinkProps as RawLinkProps,
} from "@tanstack/react-router";
import { ReactNode } from "react";

interface LinkProps extends RawLinkProps {
  children: ReactNode;
}

export function Link({ children, ...props }: LinkProps) {
  return (
    <ChakraLink asChild>
      <RawLink {...props}>{children}</RawLink>
    </ChakraLink>
  );
}
