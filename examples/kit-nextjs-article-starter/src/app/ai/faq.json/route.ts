import { NextResponse } from 'next/server';
import faqData from '@/data/faq.json';

/**
 * Revalidation period for the faq.json endpoint (24 hours)
 * Uses Incremental Static Regeneration for optimal caching
 */
export const revalidate = 86400;

/**
 * Minimum number of FAQ items required (per acceptance criteria: 3-10 items)
 */
const MIN_ITEMS = 3;

/**
 * Maximum number of FAQ items allowed (per acceptance criteria: 3-10 items)
 */
const MAX_ITEMS = 10;

/**
 * Represents a single FAQ item
 */
interface FaqItem {
  /** The question being asked */
  question: string;
  /** The authoritative answer to the question */
  answer: string;
}

/**
 * Response structure for the faq.json endpoint
 */
interface FaqResponse {
  /** Array of FAQ items (3-10 items) */
  items: FaqItem[];
  /** ISO 8601 timestamp of when the data was last modified */
  lastModified: string;
}

/**
 * API route handler for serving FAQ data at /ai/faq.json
 *
 * Exposes structured FAQ content for AI crawlers and answer engines (GEO/AEO).
 * Provides factual, concise, non-marketing question-answer pairs.
 *
 * @returns {Promise<NextResponse<FaqResponse>>} JSON response with items array and lastModified timestamp
 *
 * @example
 * // Response format:
 * {
 *   "items": [
 *     {
 *       "question": "What is Solterra & Co.?",
 *       "answer": "A lifestyle and editorial site..."
 *     }
 *   ],
 *   "lastModified": "2026-02-09T10:00:00.000Z"
 * }
 */
export async function GET(): Promise<NextResponse<FaqResponse>> {
  const rawItems = Array.isArray(faqData.items) ? faqData.items : [];
  const items: FaqItem[] = rawItems
    .slice(0, MAX_ITEMS)
    .map((item: { question?: string; answer?: string }) => ({
      question: typeof item.question === 'string' ? item.question : '',
      answer: typeof item.answer === 'string' ? item.answer : '',
    }))
    .filter((item) => item.question && item.answer);

  const response: FaqResponse = {
    items: items.length >= MIN_ITEMS ? items : [],
    lastModified: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
