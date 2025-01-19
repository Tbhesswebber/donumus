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
import { ReactNode } from "react";
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

export function ActionFormModal({
  children,
  hideCancel,
  icon: IconProp,
  label,
  submitLabel,
  title,
}: ActionFormModalProps) {
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
      <DialogContent as="form">
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        <DialogFooter flexDirection={"row-reverse"} justifyContent={"end"}>
          <Button type="submit">{submitLabel ?? "Submit"}</Button>
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
