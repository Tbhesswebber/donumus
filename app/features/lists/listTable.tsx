import {
  Center,
  Flex,
  Icon,
  IconButton,
  Table,
  TableCellProps,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Checkbox } from "@components/ui/checkbox";
import { formatTimeRelative } from "@lib/fmt/date";
import { deleteGift } from "@services/gift";
import { Gift } from "@services/gift/types";
import { useRouter } from "@tanstack/react-router";
import { FiEdit3 as FiEdit, FiTrash } from "react-icons/fi";

interface ListTableProps {
  gifts: Gift[];
  handleGiftEdit: (gift: Gift) => Promise<void> | void;
  handleGiftSelect: (gift: Gift, checked: boolean) => void;
  name: string;
  selectedGifts: string[];
}

const columns: (TableCellProps & { column: keyof Gift; label: string })[] = [
  { column: "description", label: "Description" },
  {
    column: "updatedAt",
    label: "Last Updated",
    textAlign: "end",
    width: "fit-content",
  },
];

export function ListTable({
  gifts,
  handleGiftEdit,
  handleGiftSelect,
  selectedGifts,
}: ListTableProps) {
  const router = useRouter();

  return (
    <>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader htmlWidth={"24px"}>
              <VisuallyHidden>Select</VisuallyHidden>
            </Table.ColumnHeader>
            {columns.map(({ column, label, ...props }) => (
              <Table.ColumnHeader
                key={column}
                {...props}
                textTransform={"capitalize"}
              >
                {label}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader htmlWidth={"24px"}>
              <VisuallyHidden>Gift Actions</VisuallyHidden>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gifts.map((gift) => {
            const selected = selectedGifts.includes(gift.id);
            return (
              <Table.Row
                key={gift.id}
                onClick={(e) => {
                  if (
                    e.target instanceof Element &&
                    ["a", "button", "input", "svg"].includes(
                      e.target.tagName.toLowerCase(),
                    )
                  ) {
                    return null;
                  }
                  console.dir(e.target);
                  handleGiftSelect(gift, !selected);
                }}
              >
                <Table.Cell>
                  <Center>
                    <Checkbox
                      aria-label="Select row"
                      checked={selected}
                      onCheckedChange={(changes) => {
                        handleGiftSelect(
                          gift,
                          changes.checked === "indeterminate"
                            ? false
                            : changes.checked,
                        );
                      }}
                    />
                  </Center>
                </Table.Cell>
                {columns.map(({ column, label, ...props }) => (
                  <Table.Cell key={`${column}-${gift.id}`} {...props}>
                    {renderValue(gift[column])}
                  </Table.Cell>
                ))}
                <Table.Cell>
                  <Flex direction="row" gap={4}>
                    <IconButton
                      colorPalette={"blue"}
                      onClick={(e) => {
                        e.stopPropagation();
                        return handleGiftEdit(gift);
                      }}
                      rounded={"full"}
                      variant={"ghost"}
                    >
                      <Icon>
                        <FiEdit />
                      </Icon>
                    </IconButton>
                    {/* Leaving the below for now - I don't know if we want to have both hard and soft delete */}
                    {/* <IconButton
                      onClick={() => {
                        handleGiftArchive(gift);
                      }}
                      rounded={"full"}
                      variant={"ghost"}
                    >
                      <Icon>
                        <FiArchive />
                      </Icon>
                    </IconButton> */}
                    <IconButton
                      colorPalette={"red"}
                      onClick={() => {
                        return deleteGift({ data: gift.id })
                          .then(() => router.load({ sync: false }))
                          .catch((e: unknown) => {
                            console.log(e);
                          });
                      }}
                      rounded={"full"}
                      variant={"ghost"}
                    >
                      <Icon>
                        <FiTrash />
                      </Icon>
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
}

function renderValue(value: Gift[keyof Gift]) {
  if (!value || typeof value === "boolean") return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return formatTimeRelative(value);
}
