import { Bleed, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Link } from "@components/ui/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@lib/auth/components";
import { useRouterState } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";

const headerId = "global-nav";

export function Header() {
  const route = useRouterState();

  return (
    <Bleed
      backgroundColor={"AppWorkspace"}
      id={headerId}
      position={"sticky"}
      top={0}
      zIndex={50}
    >
      <Flex
        align="center"
        direction={"row"}
        justify="space-between"
        maxWidth={"8xl"}
        mx="auto"
        px="12"
        py="4"
      >
        <Flex gap={"8"}>
          <Heading as="p" size="2xl">
            <Link to="/">Donum.us</Link>
          </Heading>
          <SignedIn>
            <Flex alignItems={"end"} as="nav" gap={"4"}>
              <Link to="/families">My Families</Link>
            </Flex>
            <Flex alignItems={"end"} as="nav" gap={"4"}>
              <Link to="/me/list">My List</Link>
            </Flex>
          </SignedIn>
        </Flex>
        <SignedIn>
          <Flex>
            <UserButton />
          </Flex>
        </SignedIn>
        <SignedOut>
          {route.location.pathname === "/sign-in" ? (
            <Button disabled variant={"ghost"}>
              Sign In
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button variant={"ghost"}>Sign In</Button>
            </SignInButton>
          )}
        </SignedOut>
      </Flex>
    </Bleed>
  );
}

export function useHeaderHeight() {
  const [headerSize, setHeaderSize] = useState<number>(0);

  useLayoutEffect(() => {
    const $header = document.getElementById(headerId);
    if ($header) {
      setHeaderSize($header.offsetHeight);
    }
  }, []);

  return headerSize;
}
