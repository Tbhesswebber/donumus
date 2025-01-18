import { List } from "@chakra-ui/react";
import { BasePage } from "@components/layout/basePage";
import { PageHeader } from "@components/layout/pageHeader";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from "@components/ui/dialog";
import { Link } from "@components/ui/link";
import { NoFamilies } from "@features/families/emptyState";
import { FamilyForm } from "@features/families/familyForm";
import { assertUser } from "@lib/auth/server";
import { assertAuth } from "@lib/auth/server/actions";
import { getFamiliesForUser } from "@services/family";
import { getUserByAuthId } from "@services/user";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

function RouteComponent() {
  const router = useRouter();
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { families } = Route.useLoaderData();
  const isEmpty = families.length === 0;

  const addFamilyAction = useMemo(
    () => ({
      handleClick: () => {
        setShouldShowModal(true);
      },
      icon: FiPlus,
      label: "Add Family",
    }),
    [],
  );

  return (
    <BasePage
      subheader={
        <PageHeader action={addFamilyAction} title="Families"></PageHeader>
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
      <DialogRoot
        onOpenChange={(e) => {
          setShouldShowModal(e.open);
        }}
        open={shouldShowModal}
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader>Create a family</DialogHeader>
          <DialogBody>
            <FamilyForm
              handleCancel={() => {
                setShouldShowModal(false);
              }}
              handleSubmit={() => {
                setShouldShowModal(false);
                router.load({ sync: false }).catch(console.log);
              }}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </BasePage>
  );
}
