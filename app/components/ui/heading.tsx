import {
  Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps,
} from "@chakra-ui/react";

interface HeadingProps extends Omit<ChakraHeadingProps, "as"> {
  level: "1" | "2" | "3" | "4" | "5" | "6";
}

type HeadingTag = `h${HeadingProps["level"]}`;

export function Heading({ level, ...props }: HeadingProps) {
  const as: HeadingTag = `h${level}`;
  return <ChakraHeading {...props} as={as}></ChakraHeading>;
}
