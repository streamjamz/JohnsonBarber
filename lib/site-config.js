/**
 * Pages hidden from the site for now (not linked in nav, routes redirect home).
 * Remove a slug from this list to bring the page back.
 * Slugs: 'home' | 'services' | 'gallery' | 'faq' | 'kit' | 'book'
 */
export const HIDDEN_PAGES = ['gallery', 'kit'];

export function isHidden(slug) {
  return HIDDEN_PAGES.includes(slug);
}
