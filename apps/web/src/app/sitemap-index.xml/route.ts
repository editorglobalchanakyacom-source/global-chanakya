import { renderSitemapIndexResponse } from '@/lib/seo/sitemap-index-generator';

export const dynamic = 'force-dynamic';

/**
 * /sitemap-index.xml
 * Directly serves the valid Sitemap Index XML with HTTP 200.
 */
export async function GET() {
  return renderSitemapIndexResponse();
}
