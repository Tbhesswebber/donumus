import { Box } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";

interface BasePageProps extends PropsWithChildren {
  subheader?: ReactNode;
}

export function BasePage({ children, subheader }: BasePageProps) {
  return (
    <Box
      as="main"
      maxWidth={"8xl"}
      mt={subheader ? undefined : "4"}
      mx="auto"
      px="12"
    >
      {!!subheader && subheader}
      <Box>{children}</Box>
    </Box>
  );
}
