import type { BoxProps, InputElementProps } from "@chakra-ui/react";

import { Group, InputElement } from "@chakra-ui/react";
import * as React from "react";

export interface InputGroupProps extends BoxProps {
  children: React.ReactElement<InputElementProps>;
  endElement?: React.ReactNode;
  endElementProps?: InputElementProps;
  endOffset?: InputElementProps["paddingEnd"];
  startElement?: React.ReactNode;
  startElementProps?: InputElementProps;
  startOffset?: InputElementProps["paddingStart"];
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      children,
      endElement,
      endElementProps,
      endOffset = "6px",
      startElement,
      startElementProps,
      startOffset = "6px",
      ...rest
    } = props;

    const child =
      React.Children.only<React.ReactElement<InputElementProps>>(children);

    return (
      <Group ref={ref} {...rest}>
        {startElement && (
          <InputElement pointerEvents="none" {...startElementProps}>
            {startElement}
          </InputElement>
        )}
        {React.cloneElement(child, {
          ...(startElement && {
            ps: `calc(var(--input-height) - ${typeof startOffset === "string" ? startOffset : "0"})`,
          }),
          ...(endElement && {
            pe: `calc(var(--input-height) - ${typeof endOffset === "string" ? endOffset : "0"})`,
          }),
          ...children.props,
        })}
        {endElement && (
          <InputElement placement="end" {...endElementProps}>
            {endElement}
          </InputElement>
        )}
      </Group>
    );
  },
);
