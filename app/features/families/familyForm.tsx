import { Flex, Input } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ZodError, ZodIssue } from "zod";

import { createFamily } from "./actions";
import { Family } from "./types";

interface FamilyFormProps {
  family?: Partial<Family>;
  formName?: string;
  handleCancel: () => void;
  handleSubmit?: (family: Family) => Promise<void> | void;
}

const defaultFamilyDisplayName = "Simpson";
const stableDefaultFamily = {};

export function FamilyForm({
  family: familyProp,
  formName,
  handleCancel,
  handleSubmit,
}: FamilyFormProps) {
  const navigate = useNavigate();
  const [family, setFamily] = useState<Partial<Family>>(
    familyProp ?? stableDefaultFamily,
  );
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  return (
    <Flex
      as="form"
      direction={"column"}
      gap="8"
      id={formName}
      maxW="lg"
      onSubmit={(event) => {
        event.preventDefault();
        createFamily({ data: family as Family })
          .then((family) =>
            handleSubmit
              ? handleSubmit(family)
              : navigate({
                  params: { id: family.id },
                  to: "/families/$id",
                }),
          )
          .catch((e: unknown) => {
            if (e instanceof ZodError) {
              setErrors(e.errors);
            }
            throw e;
          });
      }}
    >
      <Field
        errorText={errors
          .filter(
            (error) => error.path.length === 1 && error.path.at(0) === "name",
          )
          .map((error) => (
            <ul key={error.message}>{error.message}</ul>
          ))}
        helperText={`This will appear in the app as "${family.name ?? defaultFamilyDisplayName} Family"`}
        label="Family name"
        required
      >
        <Input
          autoComplete="off"
          name="name"
          onChange={({ target: { value } }) => {
            setFamily((prev) => ({ ...prev, name: value }));
          }}
          placeholder={defaultFamilyDisplayName}
          value={family.name}
        ></Input>
      </Field>
      {!formName && (
        <Flex direction={"row-reverse"} gap="2">
          <Button type="submit">Create</Button>
          <Button
            colorPalette={"red"}
            onClick={handleCancel}
            type="button"
            variant={"outline"}
          >
            Cancel
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
