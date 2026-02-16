import { getGraphQlClient } from '@/utils/graphQlClient';
import scConfig from 'sitecore.config';

/**
 * Payload structure for summary endpoint
 */
export interface SummaryPayload {
  title: string;
  description: string;
  lastModified: string;
}

/**
 * Response structure for Summary data from Sitecore
 */
interface SummaryGraphQLResponse {
  item: {
    title: {
      jsonValue: {
        value: string;
      };
    };
    description: {
      jsonValue: {
        value: string;
      };
    };
  } | null;
}

/**
 * GraphQL query to fetch Summary data from Sitecore CMS.
 *
 * Expected Sitecore structure:
 * - Item at /sitecore/content/{site}/Data/AI/Summary
 * - Fields: 'title' (Single-Line Text), 'description' (Multi-Line Text or Rich Text)
 */
const SUMMARY_QUERY = `
  query GetSummary($datasourcePath: String!, $language: String!) {
    item(path: $datasourcePath, language: $language) {
      title: field(name: "title") {
        jsonValue
      }
      description: field(name: "description") {
        jsonValue
      }
    }
  }
`;

const MAX_DESCRIPTION_LENGTH = 800;

/**
 * Ensures description does not exceed max length (requirement: MUST NOT exceed 800 characters).
 * @param description - The description text
 * @param maxLength - Maximum allowed length
 * @returns Truncated description if necessary
 */
function ensureDescriptionLength(description: string, maxLength: number): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength - 3) + '...';
}

/**
 * Strips HTML tags from a string (for plain text in AI JSON)
 * @param html - HTML string to strip
 * @returns Plain text string
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Fetches Summary data from Sitecore CMS.
 *
 * @param siteName - The Sitecore site name (e.g., 'SiteThree')
 * @param language - The language to fetch content in (default: 'en')
 * @returns Promise<SummaryPayload | null> - Summary data or null if not found
 */
export async function fetchSummaryFromCms(
  siteName?: string,
  language: string = 'en'
): Promise<SummaryPayload | null> {
  const site = siteName || scConfig.defaultSite || 'SiteThree';

  // Path to the Summary datasource in Sitecore
  const datasourcePath = `/sitecore/content/${site}/Data/AI/Summary`;

  try {
    const client = getGraphQlClient();
    const response = await client.request<SummaryGraphQLResponse>(SUMMARY_QUERY, {
      datasourcePath,
      language,
    });

    if (!response?.item) {
      console.warn(`[Summary Service] No Summary found at path: ${datasourcePath}`);
      return null;
    }

    const title = response.item.title?.jsonValue?.value || '';
    const rawDescription = response.item.description?.jsonValue?.value || '';
    const description = ensureDescriptionLength(
      stripHtmlTags(rawDescription),
      MAX_DESCRIPTION_LENGTH
    );

    if (!title || !description) {
      console.warn('[Summary Service] Summary item found but missing required fields');
      return null;
    }

    return {
      title,
      description,
      lastModified: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Summary Service] Error fetching Summary from CMS:', error);
    return null;
  }
}
