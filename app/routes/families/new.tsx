import { BasePage } from "@components/layout/basePage";
import { PageHeader } from "@components/layout/pageHeader";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { FamilyForm } from "../../features/families/familyForm";

export const Route = createFileRoute("/families/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <BasePage subheader={<PageHeader title="Create family" />}>
      <FamilyForm
        handleCancel={() => {
          navigate({ to: ".." }).catch(console.log);
        }}
      />
    </BasePage>
  );
}
