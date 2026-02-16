/**
 * AI Data Services
 *
 * This module exports services for fetching AI-related data from Sitecore CMS.
 * These services are used by the /api/ai/* routes to provide data to AI crawlers
 * and answer engines (GEO/AEO).
 */

export { fetchFaqFromCms, type FaqItem } from './faq-service';
export { fetchServicesFromCms, type Service, type ServiceResponse } from './services-service';
export { fetchSummaryFromCms, type SummaryPayload } from './summary-service';
