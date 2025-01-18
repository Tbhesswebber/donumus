import { Flex, Input } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ZodError, ZodIssue } from "zod";

import { createFamily } from "./actions";
import { Family } from "./types";

interface FamilyFormProps extends Partial<Family> {
  handleCancel: () => void;
  handleSubmit?: (family: Family) => Promise<void> | void;
}

const defaultFamilyDisplayName = "Simpson";

export function FamilyForm({
  handleCancel,
  handleSubmit,
  name,
}: FamilyFormProps) {
  const [familyName, setFamilyName] = useState(name ?? "");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  return (
    <Flex as="form" direction={"column"} gap="8" maxW="lg">
      <Field
        errorText={errors
          .filter(
            (error) => error.path.length === 1 && error.path.at(0) === "name",
          )
          .map((error) => (
            <ul key={error.message}>{error.message}</ul>
          ))}
        helperText={`This will appear in the app as "${familyName || defaultFamilyDisplayName} Family"`}
        label="Family name"
        required
      >
        <Input
          autoComplete="off"
          name="name"
          onChange={({ target: { value } }) => {
            setFamilyName(value);
          }}
          placeholder={defaultFamilyDisplayName}
          value={familyName}
        ></Input>
      </Field>
      <Flex direction={"row-reverse"} gap="2">
        <Button
          onClick={(event) => {
            event.preventDefault();
            createFamily({ data: { name: familyName } })
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
          type="submit"
        >
          Create
        </Button>
        <Button
          colorPalette={"red"}
          onClick={handleCancel}
          type="button"
          variant={"outline"}
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
}
