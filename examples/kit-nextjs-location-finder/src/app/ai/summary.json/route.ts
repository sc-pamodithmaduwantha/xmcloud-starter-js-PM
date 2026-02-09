import { NextResponse } from 'next/server';

/**
 * Revalidation period for the summary.json endpoint (24 hours)
 * Uses Incremental Static Regeneration for optimal caching
 */
export const revalidate = 86400;

/**
 * Maximum allowed length for the description field
 * Requirement: Description MUST NOT exceed 800 characters
 */
const MAX_DESCRIPTION_LENGTH = 800;

/**
 * Response structure for the summary.json endpoint
 */
interface SummaryResponse {
  /** Site title */
  title: string;
  /** Short authoritative summary for AI crawlers (max 800 chars) */
  description: string;
  /** ISO 8601 timestamp of when the data was last modified */
  lastModified: string;
}

/**
 * Ensures description does not exceed max length
 * Truncates with ellipsis if needed
 */
function ensureDescriptionLength(description: string, maxLength: number): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength - 3) + '...';
}

/**
 * API route handler for serving AI summary metadata at /ai/summary.json
 *
 * Provides a short (<800 characters) authoritative summary so AI systems
 * can understand what the site is about. Follows GEO (Generative Engine Optimization) best practices.
 *
 * @returns {Promise<NextResponse<SummaryResponse>>} JSON response with title, description, and lastModified
 *
 * @example
 * // Response format:
 * {
 *   "title": "Alaris",
 *   "description": "A car brand template with location finder...",
 *   "lastModified": "2026-02-09T10:00:00.000Z"
 * }
 */
export async function GET(): Promise<NextResponse<SummaryResponse>> {
  const description = `Alaris is a car brand template featuring location finder functionality. It showcases dealer locators, vehicle information, and automotive experiences built with Sitecore XM Cloud and Next.js. The template delivers performance, personalization, and AI-ready content for automotive brands.`;

  const response: SummaryResponse = {
    title: 'Alaris',
    description: ensureDescriptionLength(description, MAX_DESCRIPTION_LENGTH),
    lastModified: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
