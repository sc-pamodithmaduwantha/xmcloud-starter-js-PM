import { aiJsonResponse } from '@/lib/ai-json-response';
import { fetchServicesFromEdge } from '@/lib/service-from-edge';

/**
 * Revalidation period for the service endpoint (1 hour).
 * Uses Incremental Static Regeneration for optimal caching.
 */
export const revalidate = 3600;

/**
 * Response structure for the service endpoint
 */
interface ServiceResponse {
  /** Array of services offered by the site */
  services: { name: string; description: string; category: string }[];
  /** ISO 8601 timestamp of when the data was last modified */
  lastModified: string;
}

/**
 * Serves /ai/service.json (via rewrite) – site services and capabilities for AI assistants (GEO).
 *
 * Fetches services from Experience Edge via GraphQL. Exposes structured information about
 * the site's services and capabilities for AI assistants and search engines.
 * Application/json, Cache-Control 1h with stale-while-revalidate. Publicly accessible.
 *
 * @returns JSON response with services array and lastModified timestamp
 */
export async function GET() {
  const services = await fetchServicesFromEdge();

  const response: ServiceResponse = {
    services,
    lastModified: new Date().toISOString(),
  };

  return aiJsonResponse(response, {
    maxAge: 3600,
    sMaxAge: 3600,
    staleWhileRevalidate: 86400,
  });
}
