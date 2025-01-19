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
import { ListTable } from "@features/lists/listTable";
import { assertAuth } from "@lib/auth/server/actions";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
    const list2 = { gifts: gifts2, id: crypto.randomUUID(), name: "Tanner" };

    return { lists: [list1, list2] };
  },
});

function RouteComponent() {
  const { lists } = Route.useLoaderData();
  const [selection, setSelection] = useState<string[]>([]);
  const hasSelection = selection.length > 0;

  return (
    <BasePage subheader={<PageHeader title="My List"></PageHeader>}>
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
