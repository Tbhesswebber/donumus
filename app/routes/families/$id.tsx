import { List } from "@chakra-ui/react";
import { BasePage } from "@components/layout/basePage";
import { PageHeader } from "@components/layout/pageHeader";
import { BreadcrumbLinkProps } from "@components/ui/breadcrumb";
import { assertUser } from "@lib/auth/server";
import { assertAuth } from "@lib/auth/server/actions";
import { getFamilyWithMembers } from "@services/family";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/families/$id")({
  beforeLoad: () => assertAuth(),
  component: RouteComponent,
  async loader({ context, params }) {
    const { userId } = context;
    const { id: familyId } = params;
    assertUser({ userId });

    const family = await getFamilyWithMembers({ data: familyId });

    return { family };
  },
});

function RouteComponent() {
  const { family } = Route.useLoaderData();

  const crumbs = useMemo(
    (): BreadcrumbLinkProps[] => [
      { label: "My Families", to: "/families" },
      { label: family.name, params: { id: family.id }, to: "/families/$id" },
    ],
    [family.name, family.id],
  );

  return (
    <BasePage subheader={<PageHeader crumbs={crumbs} title={family.name} />}>
      <List.Root>
        {family.members.map((member) => (
          <List.Item key={member.id}>{member.name}</List.Item>
        ))}
      </List.Root>
    </BasePage>
  );
}
