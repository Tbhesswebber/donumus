import { Collapsible, Text } from "@chakra-ui/react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { ZodError } from "zod";

import { NotFoundProps } from ".";

export function DevNotFound({
  error,
  status,
}: Pick<NotFoundProps, "error" | "status">) {
  console.log(error instanceof Error);
  return (
    <DialogRoot defaultOpen>
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>
            {status} Error - {error?.name}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <>
            {error && (
              <Text
                as="pre"
                bg="colorPalette.subtle"
                borderRadius={8}
                colorPalette={"gray"}
                fontFamily={"mono"}
                padding={4}
              >
                {error instanceof ZodError
                  ? JSON.stringify(error.issues, null, 2)
                  : error.message}
              </Text>
            )}
            {!error && (
              <Text
                as="pre"
                bg="colorPalette.subtle"
                borderRadius={8}
                colorPalette={"gray"}
                fontFamily={"mono"}
                padding={4}
              >
                No error was provided
              </Text>
            )}
            {error && (
              <Collapsible.Root>
                <Collapsible.Trigger asChild>Call stack</Collapsible.Trigger>
                <Collapsible.Content>
                  <Text
                    as="pre"
                    bg="colorPalette.subtle"
                    borderRadius={8}
                    colorPalette={"gray"}
                    fontFamily={"mono"}
                    padding={4}
                  >
                    {error.stack}
                  </Text>
                </Collapsible.Content>
              </Collapsible.Root>
            )}
          </>
        </DialogBody>
        <DialogFooter>
          <Text textStyle="small">
            This error modal will only show in developer mode.
          </Text>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
