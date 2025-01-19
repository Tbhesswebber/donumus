import { List } from "@chakra-ui/react";
import { BasePage } from "@components/layout/basePage";
import { PageHeader } from "@components/layout/pageHeader";
import { ActionFormModal } from "@components/layout/pageHeader/actionModal";
import { Link } from "@components/ui/link";
import { NoFamilies } from "@features/families/emptyState";
import { FamilyForm } from "@features/families/familyForm";
import { assertUser } from "@lib/auth/server";
import { assertAuth } from "@lib/auth/server/actions";
import { getFamiliesForUser } from "@services/family";
import { getUserByAuthId } from "@services/user";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FiPlus } from "react-icons/fi";

export const Route = createFileRoute("/families/")({
  beforeLoad: () => assertAuth(),
  component: RouteComponent,
  async loader({ context }) {
    const { userId } = context;

    assertUser({ userId });

    const internalUser = await getUserByAuthId({ data: userId });
    const families = await getFamiliesForUser({ data: internalUser.id });
    return { families };
  },
});

const familyFormName = "family-form";

function RouteComponent() {
  const router = useRouter();
  const { families } = Route.useLoaderData();
  const isEmpty = families.length === 0;

  return (
    <BasePage
      subheader={
        // <PageHeader action={addFamilyAction} title="Families"></PageHeader>
        <PageHeader
          action={
            <ActionFormModal
              formName={familyFormName}
              icon={FiPlus}
              label="Add Family"
              submitLabel="Create"
              title="Create a family"
            >
              <FamilyForm
                formName={familyFormName}
                handleCancel={() => {
                  console.log("cancel");
                }}
                handleSubmit={() => {
                  router.load({ sync: false }).catch(console.log);
                }}
              />
            </ActionFormModal>
          }
          title="Families"
        ></PageHeader>
      }
    >
      {isEmpty && <NoFamilies />}
      <List.Root>
        {families.map(({ id, name }) => (
          <List.Item key={id}>
            <Link params={{ id }} to="/families/$id">
              {name} Family
            </Link>
          </List.Item>
        ))}
      </List.Root>
    </BasePage>
  );
}
