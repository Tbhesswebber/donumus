import { Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
// import { useNavigate } from "@tanstack/react-router";
// import { useCallback } from "react";
import { IconType } from "react-icons";

interface PageHeaderProps {
  action?: {
    icon: IconType;
    label: string;
    modalName: string;
  };
  title: string;
}

export function PageHeader({ action, title }: PageHeaderProps) {
  // const navigate = useNavigate();
  const ActionIcon = action?.icon;
  // const handleClick = useCallback(() => {
  //   navigate({ search: { modal: action?.modalName } }).catch((e: unknown) => {
  //     console.log(e);
  //   });
  // }, [navigate, action?.modalName]);

  return (
    <Flex align="center" direction={"row"} justify="space-between" py="6">
      <Heading fontFamily="serif" level="1" size="4xl">
        {title}
      </Heading>

      {!!action && (
        <Button
          onClick={() => {
            console.log("hi");
          }}
          type="button"
          variant={"subtle"}
        >
          {!!ActionIcon && <ActionIcon />}
          {action.label}
        </Button>
      )}
    </Flex>
  );
}
