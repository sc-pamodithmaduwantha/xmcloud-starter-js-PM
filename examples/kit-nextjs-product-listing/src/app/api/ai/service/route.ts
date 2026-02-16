import { fetchServicesFromCms, type ServiceResponse } from '@/lib/ai-data';
import { aiJsonResponse } from '@/lib/ai-json-response';

/**
 * Revalidation period for the service endpoint (1 hour).
 * Uses Incremental Static Regeneration for optimal caching.
 */
export const revalidate = 3600;

/**
 * Serves /ai/service.json (via rewrite) – site services and capabilities for AI assistants (GEO).
 *
 * Exposes structured information about the site's services and capabilities
 * for AI assistants and search engines. Application/json, Cache-Control 1h with
 * stale-while-revalidate. Publicly accessible.
 *
 * Data is fetched from Sitecore CMS at /sitecore/content/{site}/Data/AI/Services
 *
 * @returns JSON response with services array and lastModified timestamp
 */
export async function GET() {
  // Fetch services from Sitecore CMS
  const services = await fetchServicesFromCms();

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
