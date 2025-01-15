import { ClerkProvider } from "@clerk/tanstack-start";
import { dark } from "@clerk/themes";
import { useColorMode } from "@components/ui/color-mode";
import { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();

  return (
    <ClerkProvider
      appearance={{ baseTheme: colorMode === "dark" ? dark : undefined }}
    >
      {children}
    </ClerkProvider>
  );
}
