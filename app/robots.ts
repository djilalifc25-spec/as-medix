import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/cours', '/qcm', '/cat', '/pricing', '/demo'],
      disallow: ['/admin/', '/api/', '/profil/', '/dashboard/'],
    },
    sitemap: 'https://asmedix.dz/sitemap.xml',
  };
}
