import { fetchFaqFromCms, type FaqItem } from '@/lib/ai-data';
import { aiJsonResponse } from '@/lib/ai-json-response';

const MIN_ITEMS = 3;
const MAX_ITEMS = 10;

/**
 * Revalidation period for the FAQ endpoint (1 hour).
 * Uses Incremental Static Regeneration for optimal caching.
 */
export const revalidate = 3600;

/**
 * Serves /ai/faq.json (via rewrite) for AI crawlers and answer engines (GEO/AEO).
 * Response: array of { question, answer } objects, 3–10 items. Application/json,
 * Cache-Control 24h. Publicly accessible.
 *
 * Data is fetched from Sitecore CMS at /sitecore/content/{site}/Data/AI/FAQ
 * Default data is created automatically via branch template when a site is provisioned.
 *
 * @returns JSON array of FAQ items with question and answer only
 */
export async function GET() {
  // Fetch FAQ items from Sitecore CMS
  const cmsItems = await fetchFaqFromCms();

  // Transform and limit items
  const items: FaqItem[] = cmsItems
    .slice(0, MAX_ITEMS)
    .map((item) => ({
      question: typeof item.question === 'string' ? item.question : '',
      answer: typeof item.answer === 'string' ? item.answer : '',
    }))
    .filter((item) => item.question && item.answer);

  // Return items if we have minimum required, otherwise empty array
  const payload = items.length >= MIN_ITEMS ? items : [];

  return aiJsonResponse(payload, {
    maxAge: 3600,
    sMaxAge: 3600,
    staleWhileRevalidate: 86400,
  });
}
