import { LinkFieldValue, Field } from '@sitecore-content-sdk/nextjs';
import { CompatibleDatasource, CompatibleField, ComponentProps } from 'lib/component-props';

export type BreadcrumbsPage = {
  name: string;
  title: CompatibleField<Field<string>>;
  navigationTitle: CompatibleField<Field<string>>;
  url?: LinkFieldValue;
};

export type BreadcrumbsDatasource = {
  ancestors: BreadcrumbsPage[];
  name: string;
  url?: LinkFieldValue;
};

export type BreadcrumbsData = {
  fields?: CompatibleDatasource<BreadcrumbsDatasource>;
};

export type BreadcrumbsProps = ComponentProps & BreadcrumbsData;
