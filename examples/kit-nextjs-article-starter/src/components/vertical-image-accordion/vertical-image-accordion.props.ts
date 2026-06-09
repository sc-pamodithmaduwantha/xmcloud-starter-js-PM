import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

interface VerticalImageAccordionParams {
  [key: string]: any; // eslint-disable-line
}

export interface AccordionItem {
  title?: { jsonValue?: Field<string> };
  description?: { jsonValue?: Field<string> };
  image?: { jsonValue?: ImageField };
  link?: { jsonValue?: LinkField };
}

export interface VerticalImageAccordionDatasource {
  title?: { jsonValue?: Field<string> };
  items?: {
    results?: AccordionItem[];
  };
}

export interface VerticalImageAccordionFields {
  data?: {
    datasource?: VerticalImageAccordionDatasource;
  };
}

export interface VerticalImageAccordionProps extends ComponentProps {
  params: VerticalImageAccordionParams;
  fields?: VerticalImageAccordionFields;
  isPageEditing?: boolean;
}
