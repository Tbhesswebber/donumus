import { Bleed, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Link } from "@components/ui/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@lib/auth/components";

export function Header() {
  return (
    <Bleed
      backgroundColor={"AppWorkspace"}
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
          </SignedIn>
        </Flex>
        <SignedIn>
          <Flex>
            <UserButton />
            <SignOutButton redirectUrl="/">
              <Button variant={"ghost"}>Sign Out</Button>
            </SignOutButton>
          </Flex>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button variant={"ghost"}>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </Flex>
    </Bleed>
  );
}
