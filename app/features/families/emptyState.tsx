import { Center } from "@chakra-ui/react";
import { EmptyState } from "@components/ui/empty-state";
import { LinkButton } from "@components/ui/linkButton";
import { FiUsers } from "react-icons/fi";

export function NoFamilies() {
  return (
    <Center pt="12">
      <EmptyState
        description="Create a family or reach out to the admin of your family to be added."
        icon={<FiUsers />}
        title="You aren't part of any families"
      >
        <LinkButton size={"xs"} to="/families/new">
          Create new family
        </LinkButton>
      </EmptyState>
    </Center>
  );
}
