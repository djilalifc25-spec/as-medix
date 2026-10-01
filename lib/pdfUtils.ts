/**
 * Utility functions for handling and embedding direct PDF URLs
 * Supports Google Drive, Google Docs/Slides, Dropbox, Supabase Storage and raw PDF URLs
 */

export function transformPdfUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();

  // Google Presentation / Slides links
  const presentationMatch = clean.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i);
  if (presentationMatch && presentationMatch[1]) {
    return `https://docs.google.com/presentation/d/${presentationMatch[1]}/preview`;
  }

  // Google Docs links
  const docMatch = clean.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i);
  if (docMatch && docMatch[1]) {
    return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
  }

  // Google Drive file links (file/d/ID/view -> file/d/ID/preview for smooth iframe viewing)
  const driveFileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }

  const driveIdMatch = clean.match(/drive\.google\.com\/open\?id=([^&]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  // Dropbox links
  if (clean.includes('dropbox.com')) {
    if (clean.includes('dl=0')) return clean.replace('dl=0', 'raw=1');
    if (!clean.includes('raw=1')) return `${clean}${clean.includes('?') ? '&' : '?'}raw=1`;
  }

  return clean;
}

export function getEmbeddablePdfUrl(url: string): string {
  if (!url) return '';
  const transformed = transformPdfUrl(url);

  // If already preview/embed format
  if (transformed.includes('drive.google.com/file/d/') && transformed.includes('/preview')) {
    return transformed;
  }
  if (transformed.includes('docs.google.com/') && transformed.includes('/preview')) {
    return transformed;
  }

  return transformed;
}

export function getGoogleDocsViewerFallback(url: string): string {
  if (!url) return '';
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
