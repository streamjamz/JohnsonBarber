import { createClient, isConfigured } from '@/lib/supabase/server';
import { SEED } from '@/lib/seed';

/**
 * Reads a content table from Supabase, ordered by sort_order.
 * Falls back to the seed data if Supabase isn't configured yet or the
 * query fails / returns nothing — so the site always renders.
 */
async function readTable(table, seedKey, { onlyActive = false } = {}) {
  if (!isConfigured()) return SEED[seedKey];
  try {
    const supabase = await createClient();
    if (!supabase) return SEED[seedKey];
    let query = supabase.from(table).select('*').order('sort_order', { ascending: true });
    if (onlyActive) query = query.eq('active', true);
    const { data, error } = await query;
    if (error || !data || data.length === 0) return SEED[seedKey];
    return data;
  } catch (e) {
    return SEED[seedKey];
  }
}

export const getServices      = () => readTable('services', 'services', { onlyActive: true });
export const getAddons        = () => readTable('addons', 'addons', { onlyActive: true });
export const getBarbers       = () => readTable('barbers', 'barbers', { onlyActive: true });
export const getHours         = () => readTable('hours', 'hours');
export const getReviews       = () => readTable('reviews', 'reviews');
export const getFaqs          = () => readTable('faqs', 'faqs');
export const getPolicies      = () => readTable('policies', 'policies');
export const getGallery       = () => readTable('gallery', 'gallery');
export const getStats         = () => readTable('stats', 'stats');
export const getGroupPerks    = () => readTable('group_perks', 'group_perks');
export const getGroupPackages = () => readTable('group_packages', 'group_packages');
export const getFeatures      = () => readTable('features', 'features');
export const getChecklist     = () => readTable('checklist', 'checklist');

/**
 * Key/value editable copy (hero text, story, shop info, etc.).
 * Stored as rows { key, value } in the `content` table; merged over seed.
 */
export async function getContent() {
  if (!isConfigured()) return SEED.content;
  try {
    const supabase = await createClient();
    if (!supabase) return SEED.content;
    const { data, error } = await supabase.from('content').select('key, value');
    if (error || !data) return SEED.content;
    const merged = { ...SEED.content };
    data.forEach((row) => { if (row.value != null) merged[row.key] = row.value; });
    return merged;
  } catch (e) {
    return SEED.content;
  }
}

export const TIMES = SEED.times;
