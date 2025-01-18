import { EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  description?: string;
  icon?: React.ReactNode;
  title: string;
}

export function EmptyState(props: EmptyStateProps) {
  const { children, description, icon, title, ...rest } = props;
  return (
    <ChakraEmptyState.Root {...rest}>
      <ChakraEmptyState.Content>
        {icon && (
          <ChakraEmptyState.Indicator>{icon}</ChakraEmptyState.Indicator>
        )}
        {description ? (
          <VStack textAlign="center">
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
            <ChakraEmptyState.Description>
              {description}
            </ChakraEmptyState.Description>
          </VStack>
        ) : (
          <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
        )}
        {children}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
}
