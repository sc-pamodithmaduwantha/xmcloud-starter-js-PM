import { richTextFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const paragraphCatalogDefinition = {
  props: z.object({
    richText: richTextFieldSchema().describe(
      "Sitecore Rich Text field for the paragraph HTML.",
    ),
    className: z.string().optional().describe("Optional extra classes."),
  }),
  description:
    "Typography: displays body copy from a rich-text field (emphasis, links, lists).",
  example: {
    richText: {
      value:
        "<p>Content Kit gives teams governed, accessible building blocks so they can ship polished pages <strong>faster</strong>.</p>",
    },
  },
  slots: [],
};

export type ParagraphProps = z.infer<typeof paragraphCatalogDefinition.props>;
