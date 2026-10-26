import { textFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const numberCatalogDefinition = {
  props: z.object({
    value: z.number().optional().describe("Initial number shown in the input."),
    label: textFieldSchema().describe(
      "Sitecore Single-Line Text field for the visible label.",
    ),
    className: z.string().optional().describe("Optional extra classes."),
    min: z.number().optional().describe("Inclusive minimum allowed value."),
    max: z.number().optional().describe("Inclusive maximum allowed value."),
    decimalsAllowed: z
      .boolean()
      .optional()
      .describe(
        "When false, values are constrained to integers (step 1, no decimal key input). Defaults to true.",
      ),
  }),
  description:
    "Typography: numeric entry. The input value is a number. The label comes from a text field and is shown only when that field has a value.",
  example: {
    value: 3,
    label: { value: "Quantity" },
    min: 1,
    max: 99,
    decimalsAllowed: false,
  },
  slots: [],
};

export type NumberProps = z.infer<typeof numberCatalogDefinition.props>;
