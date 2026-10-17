import { renderSitemapIndexResponse } from '@/lib/seo/sitemap-index-generator';

export const dynamic = 'force-dynamic';

/**
 * /sitemap.xml
 * Directly serves the valid Sitemap Index XML with HTTP 200 (no 301 redirect).
 * Prevents Google Search Console and Bing Webmaster redirect failure errors.
 */
export async function GET() {
  return renderSitemapIndexResponse();
}
