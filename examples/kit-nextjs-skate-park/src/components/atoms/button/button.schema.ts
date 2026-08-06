import { withPropMeta } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

const variantSchema = z
  .enum(["default", "outline", "ghost", "link"])
  .optional();
const sizeSchema = z
  .enum(["default", "lg", "sm", "xs", "icon", "icon-lg", "icon-sm", "icon-xs"])
  .optional();
const colorSchemeSchema = z
  .enum(["default", "secondary", "success", "danger"])
  .optional();

const targetSchema = z.enum(["_self", "_blank", "_parent", "_top"]).optional();

export const buttonCatalogDefinition = {
  props: z.object({
    displayName: withPropMeta(
      z
        .string()
        .optional()
        .describe("Display name / label text shown inside the button."),
      { control: "text" },
    ),
    placeHolderText: withPropMeta(
      z
        .string()
        .optional()
        .describe("Placeholder text shown when label is empty."),
      { control: "text" },
    ),
    variant: variantSchema.describe("Default / Outline / Ghost / Link"),
    size: sizeSchema.describe(
      "lg / default / sm / xs / icon / icon-lg / icon-sm / icon-xs",
    ),
    colorScheme: colorSchemeSchema.describe(
      "Default / Secondary / Success / Danger",
    ),
    href: withPropMeta(
      z
        .string()
        .optional()
        .describe(
          "When provided, button acts as a link (internal or external URL).",
        ),
      { control: "text" },
    ),
    target: targetSchema.describe("Link target when href is set."),
    rel: withPropMeta(
      z
        .string()
        .optional()
        .describe("Rel attribute when href is set (e.g. noopener noreferrer)."),
      { control: "text" },
    ),
    ariaLabel: withPropMeta(
      z
        .string()
        .optional()
        .describe(
          "Accessible name override (recommended for icon-only buttons).",
        ),
      { control: "text" },
    ),
  }),
  description:
    "Category: Media. Button atom that triggers an action or navigates. Supports variants, sizing, color schemes, and link configurations with keyboard/screen reader accessibility.",
  example: {
    displayName: "Get started",
    variant: "default",
    size: "default",
    colorScheme: "default",
  },
  slots: ["default"],
  allowedChildren: ["text"],
};
