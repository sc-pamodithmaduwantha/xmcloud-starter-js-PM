import {
  ComponentParams,
  ComponentRendering,
  Page,
} from '@sitecore-content-sdk/nextjs';

/**
 * Shared component props
 */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams & {
    /**
     * The identifier for the rendering
     */
    RenderingIdentifier?: string;
    /**
     * The styles for the rendering
     * This value is calculated by the Placeholder component
     */
    styles?: string;
    /**
     * The enabled placeholders for the rendering
     */
    EnabledPlaceholders?: string;
  };
};

/**
 * Component props with context
 * You can access `page` by withSitecore/useSitecore
 * @example withSitecore()(ContentBlock)
 * @example const { page } = useSitecore()
 */
export type ComponentWithContextProps = ComponentProps & {
  page: Page;
};

export type GraphQLField<T> = {
  jsonValue: T;
};

export type CompatibleField<T> = T | GraphQLField<T>;

export type GraphQLDatasource<T> = {
  data: {
    datasource: T;
  };
};

export type CompatibleDatasource<T> =
  | GraphQLDatasource<T>
  | {
      data?: {
        datasource?: T;
        contextItem?: T;
      };
    }
  | T;

export const getDatasource = <T>(
  fields: CompatibleDatasource<T> | null | undefined
): T | undefined => {
  if (!fields) return undefined;

  const graphFields = fields as {
    data?: {
      datasource?: T;
      contextItem?: T;
    };
  };

  return graphFields?.data?.datasource ?? graphFields?.data?.contextItem ?? (fields as T);
};

export const getFieldValue = <T>(
  field: CompatibleField<T> | { jsonValue?: T } | null | undefined
): T | undefined => {
  if (!field) return undefined;

  const value = field as GraphQLField<T>;
  return value?.jsonValue !== undefined ? value.jsonValue : (field as T);
};
