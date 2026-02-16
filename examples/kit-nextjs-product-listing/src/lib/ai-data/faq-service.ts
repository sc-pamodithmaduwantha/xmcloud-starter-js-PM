import { getGraphQlClient } from '@/utils/graphQlClient';
import scConfig from 'sitecore.config';

/**
 * Represents a single FAQ item
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Response structure for FAQ data from Sitecore
 */
interface FaqGraphQLResponse {
  item: {
    children: {
      results: Array<{
        question: {
          jsonValue: {
            value: string;
          };
        };
        answer: {
          jsonValue: {
            value: string;
          };
        };
      }>;
    };
  } | null;
}

/**
 * GraphQL query to fetch FAQ items from Sitecore CMS.
 * This query fetches FAQ child items from the AI FAQ datasource.
 *
 * Expected Sitecore structure:
 * - Parent item at /sitecore/content/{site}/Data/AI/FAQ
 * - Child items with 'question' (Single-Line Text) and 'answer' (Rich Text) fields
 */
const FAQ_QUERY = `
  query GetFaqItems($datasourcePath: String!, $language: String!) {
    item(path: $datasourcePath, language: $language) {
      children(first: 20) {
        results {
          question: field(name: "question") {
            jsonValue
          }
          answer: field(name: "answer") {
            jsonValue
          }
        }
      }
    }
  }
`;

/**
 * Fetches FAQ items from Sitecore CMS.
 *
 * @param siteName - The Sitecore site name (e.g., 'SiteThree')
 * @param language - The language to fetch content in (default: 'en')
 * @returns Promise<FaqItem[]> - Array of FAQ items with question and answer
 */
export async function fetchFaqFromCms(
  siteName?: string,
  language: string = 'en'
): Promise<FaqItem[]> {
  const site = siteName || scConfig.defaultSite || 'SiteThree';

  // Path to the FAQ datasource in Sitecore
  // This should match where the FAQ content is stored in your Sitecore content tree
  const datasourcePath = `/sitecore/content/${site}/Data/AI/FAQ`;

  try {
    const client = getGraphQlClient();
    const response = await client.request<FaqGraphQLResponse>(FAQ_QUERY, {
      datasourcePath,
      language,
    });

    if (!response?.item?.children?.results) {
      console.warn(`[FAQ Service] No FAQ items found at path: ${datasourcePath}`);
      return [];
    }

    // Transform GraphQL response to FaqItem array
    const faqItems: FaqItem[] = response.item.children.results
      .map((item) => ({
        question: item.question?.jsonValue?.value || '',
        answer: stripHtmlTags(item.answer?.jsonValue?.value || ''),
      }))
      .filter((item) => item.question && item.answer);

    return faqItems;
  } catch (error) {
    console.error('[FAQ Service] Error fetching FAQ from CMS:', error);
    return [];
  }
}

/**
 * Strips HTML tags from a string (for plain text answer in AI JSON)
 * @param html - HTML string to strip
 * @returns Plain text string
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
