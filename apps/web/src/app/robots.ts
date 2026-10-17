import { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants';

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    '/admin',
    '/admin/',
    '/dashboard',
    '/dashboard/',
    '/profile',
    '/profile/',
    '/api/private',
    '/api/admin',
    '/gc-control-9x7k',
    '/gc-control-9x7k/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Applebot',
        ],
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-index.xml`,
    ],
    host: SITE_URL,
  };
}
