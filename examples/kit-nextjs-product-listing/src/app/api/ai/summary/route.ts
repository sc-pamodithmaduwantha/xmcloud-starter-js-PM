/**
 * Serves /ai/summary.json (via rewrite) – authoritative summary for AI crawlers.
 *
 * Provides a short (<800 characters) summary so AI systems can understand what the site
 * is about. Application/json, Cache-Control 24h. Publicly accessible.
 *
 * Data is fetched from Sitecore CMS at /sitecore/content/{site}/Data/AI/Summary
 */

import { fetchSummaryFromCms, type SummaryPayload } from '@/lib/ai-data';
import { aiJsonResponse } from '@/lib/ai-json-response';

/**
 * Revalidation period for the summary endpoint (1 hour).
 * Uses Incremental Static Regeneration for optimal caching.
 */
export const revalidate = 3600;

/**
 * Default fallback summary if CMS data is not available
 */
const FALLBACK_SUMMARY: SummaryPayload = {
  title: 'SYNC',
  description:
    'SYNC is a product-focused site for audio gear companies. It showcases product listings, categories, and commerce-oriented experiences built with Sitecore XM Cloud and Next.js. The template delivers performance, personalization, and AI-ready content for product discovery and e-commerce.',
  lastModified: new Date().toISOString(),
};

export async function GET() {
  // Fetch summary from Sitecore CMS
  const cmsSummary = await fetchSummaryFromCms();

  // Use CMS data if available, otherwise fall back to default
  const payload: SummaryPayload = cmsSummary || FALLBACK_SUMMARY;

  return aiJsonResponse(payload, {
    maxAge: 86400,
    sMaxAge: 86400,
    staleWhileRevalidate: 86400,
  });
}
