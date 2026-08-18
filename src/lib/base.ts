/**
 * Base path helpers.
 * Some Astro versions expose BASE_URL without a trailing slash, which
 * breaks direct concatenation. All internal links and asset paths must
 * go through withBase. See wiki/deployment.md.
 */
const rawBase = import.meta.env.BASE_URL;

export const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export const withBase = (path: string) =>
  `${baseUrl}${path.replace(/^\//, '')}`;
