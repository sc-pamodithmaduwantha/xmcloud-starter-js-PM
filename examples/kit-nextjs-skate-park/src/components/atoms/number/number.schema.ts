import { z } from "zod";

export const numberCatalogDefinition = {
  props: z.object({
    label: z
      .string()
      .min(1, "Label is required for accessibility.")
      .describe("Visible label associated with the field."),
    min: z.number().optional().describe("Inclusive minimum allowed value."),
    max: z.number().optional().describe("Inclusive maximum allowed value."),
    decimalsAllowed: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        "When false, values are constrained to integers (step 1, no decimal key input).",
      ),
  }),
  description:
    "Typography: numeric entry with configurable min/max range and optional integer-only mode. Label is nested for accessible association; focus order and native spin-button / arrow-key behavior support keyboard use.",
  example: {
    label: "Quantity",
    min: 1,
    max: 99,
    decimalsAllowed: false,
  },
  slots: ["default"],
};
