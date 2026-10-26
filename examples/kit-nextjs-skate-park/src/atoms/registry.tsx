"use client";

import { defineAtomsRegistry } from "@sitecore-content-sdk/nextjs/atoms";

import { Button } from "@/components/atoms/button/button";
import { Heading } from "@/components/atoms/heading/heading";
import { Image } from "@/components/atoms/image/image";
import { NumericInput } from "@/components/atoms/number/number";
import { Paragraph } from "@/components/atoms/paragraph/paragraph";
import { SuperLayout } from "@/components/atoms/super-layout/super-layout";

import { catalog } from "./catalog";

export const registry = defineAtomsRegistry(catalog, {
  components: {
    Button: ({ props }) => <Button {...props} />,
    Heading: ({ props }) => <Heading {...props} />,
    Paragraph: ({ props }) => <Paragraph {...props} />,
    Image: ({ props }) => <Image {...props} />,
    Number: ({ props }) => <NumericInput {...props} />,
    SuperLayout: ({ props, children }) => <SuperLayout {...props}>{children}</SuperLayout>,
  },
  actions: {},
});
