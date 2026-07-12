import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/availability?barberId=<id>&day=YYYY-MM-DD
 * Returns { booked: [ "9:00", ... ] } — times already taken for that
 * barber on that day (confirmed appointments). Used to grey out slots.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get('barberId');
  const day = searchParams.get('day');

  if (!day) return NextResponse.json({ booked: [] });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ booked: [] });

  let query = supabase
    .from('appointments')
    .select('time')
    .eq('day', day)
    .eq('status', 'confirmed');
  if (barberId) query = query.eq('barber_id', barberId);

  const { data, error } = await query;
  if (error) {
    console.error('[availability] error:', error);
    return NextResponse.json({ booked: [] });
  }
  const booked = Array.from(new Set((data || []).map((r) => r.time).filter(Boolean)));
  return NextResponse.json({ booked });
}
