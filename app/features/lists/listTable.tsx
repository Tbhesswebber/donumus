import { Center, Table, VisuallyHidden } from "@chakra-ui/react";
import { Checkbox } from "@components/ui/checkbox";

interface Gift {
  description: string;
  id: string;
  name: string;
}

interface ListTableProps {
  gifts: Gift[];
  handleGiftSelect: (gift: Gift, checked: boolean) => void;
  name: string;
  selectedGifts: string[];
}

const columns: (keyof Gift)[] = ["name", "description"];

export function ListTable({
  gifts,
  handleGiftSelect,
  selectedGifts,
}: ListTableProps) {
  return (
    <>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader htmlWidth={"24px"}>
              <VisuallyHidden>Select</VisuallyHidden>
            </Table.ColumnHeader>
            {columns.map((column) => (
              <Table.ColumnHeader key={column} textTransform={"capitalize"}>
                {column}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gifts.map((gift) => {
            const selected = selectedGifts.includes(gift.id);
            return (
              <Table.Row
                key={gift.id}
                onClick={() => {
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
                {columns.map((column) => (
                  <Table.Cell key={`${column}-${gift.id}`}>
                    {gift[column]}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
}
