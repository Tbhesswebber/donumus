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
import { useState } from "react";
// import { FiPlus } from "react-icons/fi";

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

// const addFamilyAction = {
//   icon: FiPlus,
//   label: "Add Family",
//   modalName: "add-family",
// };

function RouteComponent() {
  const router = useRouter();
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { families } = Route.useLoaderData();
  const isEmpty = families.length === 0;

  return (
    <BasePage subheader={<PageHeader title="Families"></PageHeader>}>
      {isEmpty && <NoFamilies />}
      <ul>
        {families.map(({ id, name }) => (
          <li>
            <Link params={{ id }} to="/families/$id">
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <DialogRoot open={shouldShowModal}>
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
                router.load({ sync: true }).catch(console.log);
              }}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </BasePage>
  );
}
