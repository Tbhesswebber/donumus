import { Box } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";

import { useHeaderHeight } from "./header";

interface BasePageProps extends PropsWithChildren {
  subheader?: ReactNode;
}

export function BasePage({ children, subheader }: BasePageProps) {
  const headerHeight = useHeaderHeight();
  return (
    <Box
      as="main"
      maxWidth={"8xl"}
      minHeight={`calc(100vh - ${headerHeight}px)`}
      mt={subheader ? undefined : "4"}
      mx="auto"
      px="12"
    >
      {!!subheader && subheader}
      <Box>{children}</Box>
    </Box>
  );
}
