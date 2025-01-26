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
import { GiftWithStatus, ListWithGiftsAndStatus } from "@features/lists/types";
import { assertAuth } from "@lib/auth/server/actions";
import { DisplayValue } from "@root/commons/types";
import { gift } from "@services/gift/types";
import { getHydratedListsForUser } from "@services/list";
import { List } from "@services/list/types";
import { createStatus, getStatusesForGifts } from "@services/status";
import { getUserByAuthId } from "@services/user";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { z } from "zod";

export const pageParams = z
  .object({
    modal: z.boolean().optional(),
  })
  .merge(gift.partial());
export type PageParams = z.infer<typeof pageParams>;

export const Route = createFileRoute("/me/list")({
  /* eslint-disable perfectionist/sort-objects -- For typescript to help us with file routes, these need to be in a specific order */
  validateSearch: (params: PageParams): PageParams => {
    const { data } = pageParams.safeParse(params);
    return data?.modal ? data : {};
  },
  beforeLoad: () => assertAuth(),
  component: RouteComponent,
  loader: async ({
    context,
  }): Promise<{ lists: (List & { gifts: GiftWithStatus[] })[] }> => {
    const { id } = await getUserByAuthId({ data: context.userId });
    const listsWithoutStatuses = await getHydratedListsForUser({
      data: id,
    });

    const lists = await Promise.all(
      listsWithoutStatuses.map(
        async (list): Promise<ListWithGiftsAndStatus> => {
          const statuses = await getStatusesForGifts({
            data: list.gifts.map(({ id }) => id),
          });
          const giftIdToStatusMap = Object.groupBy(statuses, (s) => s.giftId);
          const gifts = list.gifts.map(
            ({ id, ...rest }): GiftWithStatus => ({
              id,
              ...rest,
              statuses: giftIdToStatusMap[id] ?? [],
            }),
          );
          return { ...list, gifts };
        },
      ),
    );

    return { lists };
  },
  /* eslint-enable perfectionist/sort-objects */
});

const newItemFormName = "new-item";

function RouteComponent() {
  const router = useRouter();
  const { lists } = Route.useLoaderData();
  const { modal, ...gift } = Route.useSearch();
  const [selection, setSelection] = useState<string[]>([]);
  const hasSelection = selection.length > 0;

  const listOptions = useMemo(
    () =>
      lists.map(({ id, name }): DisplayValue => ({ label: name, value: id })),
    [lists],
  );
  const defaultFormItem = useMemo(
    () => ({
      listId: listOptions[0].value,
      ...gift,
    }),
    [gift, listOptions],
  );

  return (
    <BasePage
      subheader={
        <PageHeader
          action={
            <ActionFormModal
              formName={newItemFormName}
              handleClose={() => router.navigate({ search: {}, to: "." })}
              icon={FiPlus}
              label={"New Item"}
              open={!!modal}
              title={gift.id ? "Update item" : "Create item"}
            >
              <ItemForm
                formName={newItemFormName}
                handleSubmit={() => {
                  router.load({ sync: false }).catch(console.log);
                }}
                item={defaultFormItem}
                listOptions={listOptions}
              />
            </ActionFormModal>
          }
          title={lists.length === 1 ? "My List" : "My Lists"}
        ></PageHeader>
      }
    >
      <Flex direction={"column"} gap={16} grow={1}>
        {lists.map((list) => (
          <ListTable
            gifts={list.gifts}
            handleGiftEdit={(gift) => {
              return router.navigate({
                search: { modal: true, ...gift },
                to: "/me/list",
              });
            }}
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
          <ActionBarSelectionTrigger whiteSpace={"nowrap"}>
            {selection.length} selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button
            onClick={() =>
              Promise.all(
                selection.map((giftId) =>
                  createStatus({ data: { giftId, status: "gone" } }),
                ),
              ).then(() => router.load())
            }
            size="sm"
            variant="outline"
          >
            Mark "gone" <Kbd>G</Kbd>
          </Button>
          <Button
            onClick={() =>
              Promise.all(
                selection.map((giftId) =>
                  createStatus({ data: { giftId, status: "gone" } }),
                ),
              ).then(() => router.load())
            }
            size="sm"
            variant="outline"
          >
            Mark "partially gone" <Kbd>G</Kbd>
          </Button>
          <Button
            onClick={() =>
              Promise.all(
                selection.map((giftId) =>
                  createStatus({ data: { giftId, status: "looking" } }),
                ),
              ).then(() => router.load())
            }
            size="sm"
            variant="outline"
          >
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
