import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
  Button,
  Flex,
  Kbd,
} from "@chakra-ui/react";
import { BasePage } from "@components/layout/basePage";
import { PageHeader } from "@components/layout/pageHeader";
import { ActionFormModal } from "@components/layout/pageHeader/actionModal";
import { ItemForm } from "@features/lists/itemForm";
import { ListTable } from "@features/lists/listTable";
import { assertAuth } from "@lib/auth/server/actions";
import { DisplayValue } from "@root/commons/types";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

export const Route = createFileRoute("/me/list")({
  beforeLoad: () => assertAuth(),
  component: RouteComponent,
  loader() {
    const gifts1 = [
      {
        description: "foo bar baz",
        id: crypto.randomUUID(),
        name: "foo",
        status: "available",
      },
    ];
    const gifts2 = [
      {
        description: "foo bar baz",
        id: crypto.randomUUID(),
        name: "foo",
        status: "available",
      },
    ];
    const list1 = { gifts: gifts1, id: crypto.randomUUID(), name: "Tanner" };
    const list2 = {
      gifts: gifts2,
      id: crypto.randomUUID(),
      name: "Tanner and Tori",
    };

    return { lists: [list1, list2] };
  },
});

const newItemFormName = "new-item";

function RouteComponent() {
  const { lists } = Route.useLoaderData();
  const router = useRouter();
  const [selection, setSelection] = useState<string[]>([]);
  const hasSelection = selection.length > 0;

  const listOptions = useMemo(
    () =>
      lists.map(({ id, name }): DisplayValue => ({ label: name, value: id })),
    [lists],
  );

  return (
    <BasePage
      subheader={
        <PageHeader
          action={
            <ActionFormModal
              formName={newItemFormName}
              icon={FiPlus}
              label={"New Item"}
              title="Create item"
            >
              <ItemForm
                formName={newItemFormName}
                handleSubmit={() => {
                  router.load({ sync: false }).catch(console.log);
                }}
                item={{ listId: listOptions[0].value }}
                listOptions={listOptions}
              />
            </ActionFormModal>
          }
          title="My List"
        ></PageHeader>
      }
    >
      <Flex direction={"column"} gap={16} grow={1}>
        {lists.map((list) => (
          <ListTable
            gifts={list.gifts}
            handleGiftSelect={(gift, checked) => {
              setSelection((prev) =>
                checked
                  ? [...prev, gift.id]
                  : selection.filter((id) => id !== gift.id),
              );
            }}
            key={list.id}
            name={list.name}
            selectedGifts={selection}
          />
        ))}
      </Flex>
      <ActionBarRoot
        closeOnInteractOutside={false}
        onOpenChange={(e) => {
          setSelection((prev) => (e.open ? prev : []));
        }}
        open={hasSelection}
      >
        <ActionBarContent
          bottom={8}
          left={"50%"}
          position={"fixed"}
          transform={"translateX(-50%)"}
        >
          <ActionBarSelectionTrigger>
            {selection.length} selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button disabled size="sm" variant="outline">
            Mark "gone" <Kbd>G</Kbd>
          </Button>
          <Button disabled size="sm" variant="outline">
            Mark "looking" <Kbd>L</Kbd>
          </Button>
          <Button
            onClick={() => {
              setSelection([]);
            }}
            size="sm"
            variant="outline"
          >
            Deselect all <Kbd>Esc</Kbd>
          </Button>
        </ActionBarContent>
      </ActionBarRoot>
    </BasePage>
  );
}
