import { DialogFooter, DialogTrigger, Icon } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { ContextException } from "@lib/oops/contextException";
import { createContext, ReactNode, RefObject, useContext, useRef } from "react";
import { IconType } from "react-icons";

interface ActionFormModalProps {
  children: ReactNode;
  formName: string;
  hideCancel?: boolean;
  icon: IconType;
  label: string;
  submitLabel?: string;
  title: string;
}

const ActionModalPortalContext = createContext<
  RefObject<HTMLDivElement | null> | undefined
>(undefined);

export function ActionFormModal({
  children,
  formName,
  hideCancel,
  icon: IconProp,
  label,
  submitLabel,
  title,
}: ActionFormModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <DialogRoot>
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button variant={"subtle"}>
          <Icon>
            <IconProp></IconProp>
          </Icon>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent ref={ref}>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ActionModalPortalContext.Provider value={ref}>
            {children}
          </ActionModalPortalContext.Provider>
        </DialogBody>
        <DialogFooter flexDirection={"row-reverse"} justifyContent={"end"}>
          <Button form={formName} type="submit">
            {submitLabel ?? "Submit"}
          </Button>
          {!hideCancel && (
            <DialogActionTrigger asChild>
              <Button colorPalette={"red"} type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogActionTrigger>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export function useActionModalPortalRef(
  optional?: boolean,
): RefObject<HTMLDivElement> {
  const value = useContext(ActionModalPortalContext);
  if (value === undefined && !optional) {
    throw new ContextException("ActionModalPortalContext");
  }
  return value as RefObject<HTMLDivElement>;
}
