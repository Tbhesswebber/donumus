import { createListCollection, Flex, Input, Textarea } from "@chakra-ui/react";
import { useActionModalPortalRef } from "@components/layout/pageHeader/actionModal";
import { Checkbox } from "@components/ui/checkbox";
import { Field } from "@components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@components/ui/select";
import { isErrorFromZod } from "@lib/oops";
import { MAX_STRING_LENGTH } from "@root/commons/constants";
import { DisplayValue } from "@root/commons/types";
import { createGift } from "@services/gift";
import { Gift, GiftCreation } from "@services/gift/types";
import { FormEventHandler, useCallback, useMemo, useState } from "react";
import { ZodError, ZodIssue } from "zod";

interface ItemFormProps {
  formName?: string;
  handleSubmit?: (item: Gift) => Promise<void> | void;
  item?: Partial<Gift>;
  listOptions: DisplayValue[];
}

const defaultEmptyItem: GiftCreation = {
  description: "",
  hidden: false,
  listId: "",
  starred: false,
};

export function ItemForm({
  formName,
  handleSubmit,
  item,
  listOptions: listOptionsProp,
}: ItemFormProps) {
  const portalRef = useActionModalPortalRef(!formName);
  const [gift, setGift] = useState<Partial<GiftCreation>>({
    ...defaultEmptyItem,
    ...item,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof GiftCreation, ZodIssue[]>>
  >({});
  const listOptions = useMemo(
    () => createListCollection<DisplayValue>({ items: listOptionsProp }),
    [listOptionsProp],
  );

  const onAnyInputChange: FormEventHandler = useCallback(({ target }) => {
    let name: string, value: boolean | string;
    if (
      (target instanceof HTMLInputElement && target.type !== "checkbox") ||
      target instanceof HTMLTextAreaElement
    ) {
      ({ name, value } = target);
    }
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      ({ checked: value, name } = target);
    }

    setGift((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <Flex
      as={"form"}
      flexDirection={"column"}
      gap={6}
      id={formName}
      onChange={onAnyInputChange}
      onSubmit={(e) => {
        e.preventDefault();
        createGift({ data: gift })
          .then((v) => {
            if (handleSubmit) {
              return handleSubmit(v);
            }
          })
          .catch((e: unknown) => {
            if (isErrorFromZod(e)) {
              setErrors(
                Object.groupBy(e.issues, (issue) => issue.path.join(".")),
              );
            } else if (e instanceof ZodError) {
              console.log(e.format());
              console.log(e.flatten());
            } else {
              throw e;
            }
          });
      }}
    >
      <Field
        errorText={errors.description?.map(({ message }) => message).join("\n")}
        invalid={!!errors.description}
        label={"What item would you like to add?"}
      >
        <Input
          name="description"
          onChange={onAnyInputChange}
          value={gift.description}
        ></Input>
      </Field>
      <Field
        disabled={listOptions.items.length === 0}
        errorText={errors.listId?.map(({ message }) => message).join("\n")}
        invalid={!!errors.listId}
        label={"What list would you like to add it to?"}
        required
      >
        <SelectRoot
          collection={listOptions}
          name="listId"
          onValueChange={({ value }) => {
            setGift((prev) => ({ ...prev, listId: value.at(0) }));
          }}
          value={gift.listId ? [gift.listId] : [listOptions.items[0].value]}
        >
          <SelectTrigger>
            <SelectValueText placeholder="Select a list" />
          </SelectTrigger>
          <SelectContent portalRef={portalRef}>
            {listOptions.items.map((list) => (
              <SelectItem item={list} key={list.value}>
                {list.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Field>
      <Field label={"Link"}>
        <Input
          name="link"
          onChange={onAnyInputChange}
          value={gift.link}
        ></Input>
      </Field>
      <Field
        disabled
        flexGrow={1}
        helperText="This field is not yet persisted"
        label={"Notes"}
      >
        <Textarea maxLength={MAX_STRING_LENGTH} name="notes"></Textarea>
      </Field>
      <Flex flexDirection={"row"} justifyContent={"space-around"}>
        <Field
          errorText={errors.starred?.map(({ message }) => message).join("\n")}
          flexBasis={"fit-content"}
          invalid={!!errors.starred}
          justifyContent={"start"}
          label="Really want?"
          orientation={"horizontal"}
        >
          <Checkbox checked={gift.starred} name="starred" />
        </Field>
        <Field
          errorText={errors.hidden?.map(({ message }) => message).join("\n")}
          flexBasis={"fit-content"}
          invalid={!!errors.hidden}
          justifyContent={"start"}
          label="Hide from list owner?"
          orientation={"horizontal"}
        >
          <Checkbox checked={gift.hidden} name="hidden" />
        </Field>
      </Flex>
    </Flex>
  );
}
