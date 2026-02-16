import { getGraphQlClient } from '@/utils/graphQlClient';
import scConfig from 'sitecore.config';

/**
 * Represents a service or capability offered by the site
 */
export interface Service {
  /** Human-readable name of the service */
  name: string;
  /** Detailed description of what the service provides */
  description: string;
  /** Category grouping for the service */
  category: string;
}

/**
 * Response structure for the service endpoint
 */
export interface ServiceResponse {
  /** Array of services offered by the site */
  services: Service[];
  /** ISO 8601 timestamp of when the data was last modified */
  lastModified: string;
}

/**
 * Response structure for Services data from Sitecore
 */
interface ServicesGraphQLResponse {
  item: {
    children: {
      results: Array<{
        name: {
          jsonValue: {
            value: string;
          };
        };
        description: {
          jsonValue: {
            value: string;
          };
        };
        category: {
          jsonValue: {
            value: string;
          };
        };
      }>;
    };
  } | null;
}

/**
 * GraphQL query to fetch Services items from Sitecore CMS.
 * This query fetches Service child items from the AI Services datasource.
 *
 * Expected Sitecore structure:
 * - Parent item at /sitecore/content/{site}/Data/AI/Services
 * - Child items with 'name', 'description', and 'category' fields
 */
const SERVICES_QUERY = `
  query GetServicesItems($datasourcePath: String!, $language: String!) {
    item(path: $datasourcePath, language: $language) {
      children(first: 20) {
        results {
          name: field(name: "name") {
            jsonValue
          }
          description: field(name: "description") {
            jsonValue
          }
          category: field(name: "category") {
            jsonValue
          }
        }
      }
    }
  }
`;

/**
 * Fetches Services from Sitecore CMS.
 *
 * @param siteName - The Sitecore site name (e.g., 'SiteThree')
 * @param language - The language to fetch content in (default: 'en')
 * @returns Promise<Service[]> - Array of Service items
 */
export async function fetchServicesFromCms(
  siteName?: string,
  language: string = 'en'
): Promise<Service[]> {
  const site = siteName || scConfig.defaultSite || 'SiteThree';

  // Path to the Services datasource in Sitecore
  const datasourcePath = `/sitecore/content/${site}/Data/AI/Services`;

  try {
    const client = getGraphQlClient();
    const response = await client.request<ServicesGraphQLResponse>(SERVICES_QUERY, {
      datasourcePath,
      language,
    });

    if (!response?.item?.children?.results) {
      console.warn(`[Services Service] No Services found at path: ${datasourcePath}`);
      return [];
    }

    // Transform GraphQL response to Service array
    const services: Service[] = response.item.children.results
      .map((item) => ({
        name: item.name?.jsonValue?.value || '',
        description: stripHtmlTags(item.description?.jsonValue?.value || ''),
        category: item.category?.jsonValue?.value || '',
      }))
      .filter((item) => item.name && item.description);

    return services;
  } catch (error) {
    console.error('[Services Service] Error fetching Services from CMS:', error);
    return [];
  }
}

/**
 * Strips HTML tags from a string (for plain text in AI JSON)
 * @param html - HTML string to strip
 * @returns Plain text string
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
