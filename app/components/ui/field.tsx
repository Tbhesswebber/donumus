import { Field as ChakraField } from "@chakra-ui/react";
import * as React from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  errorText?: React.ReactNode;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
  optionalText?: React.ReactNode;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { children, errorText, helperText, label, optionalText, ...rest } =
      props;

    const style = React.useMemo(
      () => ({ "--field-label-width": "max-content", ...(rest.style ?? {}) }),
      [rest.style],
    );

    return (
      <ChakraField.Root ref={ref} {...rest} style={style}>
        {label && (
          <ChakraField.Label>
            {label}
            <ChakraField.RequiredIndicator fallback={optionalText} />
          </ChakraField.Label>
        )}
        {children}
        {helperText && (
          <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
        )}
        {errorText && (
          <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  },
);
