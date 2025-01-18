import { Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
// import { useNavigate } from "@tanstack/react-router";
// import { useCallback } from "react";
import { IconType } from "react-icons";

import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbRoot,
} from "../ui/breadcrumb";

interface PageHeaderProps {
  action?: {
    handleClick: () => void;
    icon: IconType;
    label: string;
  };
  crumbs?: BreadcrumbLinkProps[];
  title: string;
}

export function PageHeader({ action, crumbs, title }: PageHeaderProps) {
  // const navigate = useNavigate();
  const ActionIcon = action?.icon;
  // const handleClick = useCallback(() => {
  //   navigate({ search: { modal: action?.modalName } }).catch((e: unknown) => {
  //     console.log(e);
  //   });
  // }, [navigate, action?.modalName]);

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

        {!!action && (
          <Button
            onClick={() => {
              console.log("hi");

              action.handleClick();
            }}
            type="button"
            variant={"subtle"}
          >
            {!!ActionIcon && <ActionIcon />}
            {action.label}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
