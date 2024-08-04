import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/terms', '/privacy'],
      },
    ],
    sitemap: 'https://www.hired.co.ke/sitemap.xml',
  };
}