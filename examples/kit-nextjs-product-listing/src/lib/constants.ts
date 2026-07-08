export const USER_ZIPCODE = 'user_zipcode';

/**
 * Path segments that act as "section" landing pages. When a requested page
 * below one of these sections does not exist (would 404), the request is
 * redirected to the section landing page instead of showing a 404.
 *
 * Example: with 'customer-stories' configured,
 *   /customer-stories/removed-article  -> redirected to /customer-stories
 *   /customer-stories/existing-article -> renders normally (page exists)
 *   /customer-stories                  -> renders normally (landing page)
 */
export const SECTION_FALLBACK_REDIRECTS: string[] = ['customer-stories'];
