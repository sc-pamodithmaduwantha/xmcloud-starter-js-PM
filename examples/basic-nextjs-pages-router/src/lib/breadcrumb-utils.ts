import type {
  ComponentRendering,
  Field,
  LinkFieldValue,
  Page,
  RouteData,
} from '@sitecore-content-sdk/nextjs';
import type { BreadcrumbsPage, BreadcrumbsProps } from 'components/breadcrumbs/breadcrumbs.props';
import { getGraphQlClient } from 'lib/graphQlClient';

const BREADCRUMBS_COMPONENT = 'Breadcrumbs';

const BREADCRUMB_QUERY = `
  query BreadcrumbQuery($contextItem: String!, $language: String!) {
    datasource: item(path: $contextItem, language: $language) {
      name
      navigationTitle: field(name: "navigationTitle") {
        jsonValue
      }
      title: field(name: "title") {
        jsonValue
      }
      url {
        href: path
      }
      ancestors(hasLayout: true) {
        title: field(name: "title") {
          jsonValue
        }
        navigationTitle: field(name: "navigationTitle") {
          jsonValue
        }
        name
        url {
          href: path
        }
      }
    }
  }
`;

type BreadcrumbDatasource = {
  name: string;
  ancestors?: BreadcrumbsPage[];
  url?: LinkFieldValue;
};

type BreadcrumbQueryResponse = {
  datasource?: BreadcrumbDatasource;
};

interface RouteFields {
  Title?: Field;
}

const hasBreadcrumbsRendering = (renderings: ComponentRendering[] | undefined): boolean => {
  if (!renderings?.length) {
    return false;
  }

  return renderings.some((rendering) => {
    if (rendering.componentName === BREADCRUMBS_COMPONENT) {
      return true;
    }

    if (!rendering.placeholders) {
      return false;
    }

    return Object.values(rendering.placeholders).some((placeholderRenderings) =>
      hasBreadcrumbsRendering(placeholderRenderings)
    );
  });
};

export const routeHasBreadcrumbsRendering = (route: RouteData | null | undefined): boolean => {
  if (!route?.placeholders) {
    return false;
  }

  return Object.values(route.placeholders).some((renderings) => hasBreadcrumbsRendering(renderings));
};

export const createDefaultBreadcrumbProps = (page: Page): BreadcrumbsProps => {
  const { route } = page.layout.sitecore;
  const routeFields = route?.fields as RouteFields | undefined;
  const pageName =
    routeFields?.Title?.value?.toString() || route?.displayName || route?.name || 'Home';

  return {
    rendering: { componentName: BREADCRUMBS_COMPONENT, params: {} },
    params: {},
    fields: {
      data: {
        datasource: {
          name: pageName,
          ancestors: [],
        },
      },
    },
  };
};

export const createBreadcrumbPropsFromFields = (
  fields: BreadcrumbsProps['fields']
): BreadcrumbsProps => ({
  rendering: { componentName: BREADCRUMBS_COMPONENT, params: {} },
  params: {},
  fields,
});

export const fetchBreadcrumbFields = async (
  page: Page,
  locale?: string
): Promise<BreadcrumbsProps['fields'] | undefined> => {
  const itemId = page.layout.sitecore.route?.itemId;

  if (!itemId) {
    return undefined;
  }

  const client = getGraphQlClient();
  const response = await client.request<BreadcrumbQueryResponse>(BREADCRUMB_QUERY, {
    contextItem: itemId,
    language: locale || page.locale || 'en',
  });

  if (!response?.datasource) {
    return undefined;
  }

  return {
    data: {
      datasource: {
        ...response.datasource,
        ancestors: response.datasource.ancestors ?? [],
      },
    },
  };
};

export const resolveDefaultBreadcrumbProps = async (
  page: Page,
  locale?: string
): Promise<BreadcrumbsProps> => {
  try {
    const fields = await fetchBreadcrumbFields(page, locale);

    if (fields) {
      return createBreadcrumbPropsFromFields(fields);
    }
  } catch (error) {
    console.debug('Unable to fetch breadcrumb data from Sitecore Edge', error);
  }

  return createDefaultBreadcrumbProps(page);
};
