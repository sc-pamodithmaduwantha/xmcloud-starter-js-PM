import {
  linkFieldSchema,
  withPropMeta,
} from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const buttonCatalogDefinition = {
  props: z.object({
    link: linkFieldSchema().describe(
      "Sitecore General Link field for the button label and optional destination.",
    ),
    className: z.string().optional().describe("Optional extra classes."),
    placeHolderText: withPropMeta(
      z
        .string()
        .optional()
        .describe("Placeholder text shown when label is empty."),
      { control: "text" },
    ),
    ariaLabel: withPropMeta(
      z
        .string()
        .optional()
        .describe("Accessible name override when the visible label is not descriptive."),
      { control: "text" },
    ),
  }),
  description:
    "Category: Media. Generic button atom for actions or navigation. Ships a default button look (cursor, filled background, size, radius) that consumers override with className; no visual variant props.",
  example: {
    link: { value: { href: "/", text: "Get started" } },
  },
  slots: [],
};

export type ButtonProps = z.infer<typeof buttonCatalogDefinition.props>;
