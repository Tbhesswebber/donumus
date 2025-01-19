import { Flex } from "@chakra-ui/react";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbRoot,
} from "@components/ui/breadcrumb";
import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { isValidElement, ReactElement, useMemo } from "react";
import { IconType } from "react-icons";

export interface PageHeaderProps {
  action?:
    | ReactElement
    | {
        handleClick: () => void;
        icon: IconType;
        label: string;
      };
  crumbs?: BreadcrumbLinkProps[];
  title: string;
}

export function PageHeader({
  action: actionProp,
  crumbs,
  title,
}: PageHeaderProps) {
  const action = useMemo(() => {
    if (!actionProp) {
      return null;
    } else if (isValidElement(actionProp)) {
      return actionProp;
    } else {
      const ActionIcon = actionProp.icon;

      return (
        <Button
          onClick={() => {
            console.log("hi");

            actionProp.handleClick();
          }}
          type="button"
          variant={"subtle"}
        >
          <ActionIcon />
          {actionProp.label}
        </Button>
      );
    }
  }, [actionProp]);

  return (
    <Flex as="header" direction={"column"} py="6">
      <Flex>
        <BreadcrumbRoot>
          {crumbs?.map((crumb, index) =>
            index < crumbs.length - 1 ? (
              <BreadcrumbLink {...crumb} />
            ) : (
              <BreadcrumbCurrentLink {...crumb} />
            ),
          )}
        </BreadcrumbRoot>
      </Flex>
      <Flex align="center" direction={"row"} justify="space-between">
        <Heading fontFamily="serif" level="1" size="4xl">
          {title}
        </Heading>
        {action}
      </Flex>
    </Flex>
  );
}
