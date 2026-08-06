import { withPropMeta } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

import { HEADING_ATOM_DEFAULT_LEVEL } from "./heading";

const headingLevelSchema = z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional();

export const headingCatalogDefinition = {
  props: z.object({
    variant: headingLevelSchema.describe(
      `Heading level (h1–h6). When omitted, ${HEADING_ATOM_DEFAULT_LEVEL} is used.`,
    ),
    defaultValue: withPropMeta(
      z
        .string()
        .optional()
        .describe("Default heading text; set in Design Studio when this prop is exposed."),
      { control: "text" },
    ),
    placeHolderText: withPropMeta(z.string().optional(), { control: "text" }),
  }),
  description:
    "Semantic heading (h1-h6). Level sets document outline only; visuals come from styling.",
  example: {
    variant: "h2",
    defaultValue: "Build faster with Content Kit",
  },
  slots: ["default"],
  allowedChildren: ["text"],
};
