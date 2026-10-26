import { textFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const headingCatalogDefinition = {
  props: z.object({
    text: textFieldSchema().describe(
      "Sitecore Single-Line Text field. The value includes the heading element, for example <h2>Title</h2>.",
    ),
    className: z.string().optional().describe("Optional extra classes."),
  }),
  description:
    "Displays a heading from a text field whose value already includes the heading tag.",
  example: {
    text: { value: "<h2>Build faster with Content Kit</h2>" },
  },
  slots: [],
};

export type HeadingProps = z.infer<typeof headingCatalogDefinition.props>;
