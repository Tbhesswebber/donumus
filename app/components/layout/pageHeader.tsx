import { Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { isValidElement, ReactElement, useMemo } from "react";
// import { useNavigate } from "@tanstack/react-router";
// import { useCallback } from "react";
import { IconType } from "react-icons";

import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbRoot,
} from "../ui/breadcrumb";

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
    if (isActionProp(actionProp)) {
      if (isValidElement(actionProp)) {
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
    }
    return null;
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

function isActionProp(
  value: unknown,
): value is Required<PageHeaderProps>["action"] {
  return (
    typeof value === "function" ||
    ["label", "icon", "handleClick"].every(
      (key) =>
        key in
        (value as Exclude<
          PageHeaderProps["action"],
          ((...args: unknown[]) => unknown) | undefined
        >),
    )
  );
}
