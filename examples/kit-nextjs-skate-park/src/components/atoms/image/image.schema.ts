import { imageFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const imageCatalogDefinition = {
  props: z.object({
    image: imageFieldSchema().describe(
      "Sitecore Image field (src, alt, width, height).",
    ),
    className: z.string().optional().describe("Optional extra classes."),
  }),
  description: "Media: displays an image from a Sitecore Image field.",
  example: {
    image: {
      value: {
        src: "https://delivery-sitecore.sitecorecontenthub.cloud/api/public/content/1b281aac7c7d487fb1787cab5c4d00d5?v=7081eb84",
        alt: "Sitecore logos from the sitecore official website",
      },
    },
  },
  slots: [],
};

export type ImageProps = z.infer<typeof imageCatalogDefinition.props>;
