import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, customerConfirmEmail } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * Sends 24h reminder emails. Called by Vercel Cron (see vercel.json).
 * Protected by CRON_SECRET. Because appointments store a date (not a
 * precise timestamp), this reminds everyone booked for *tomorrow* and is
 * intended to run once a day.
 */
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  const url = new URL(req.url);
  const provided = (auth && auth.replace('Bearer ', '')) || url.searchParams.get('secret');
  if (secret && provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const { data: appts, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('day', tomorrow)
    .eq('status', 'confirmed')
    .eq('reminder_sent', false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const a of appts || []) {
    if (!a.customer_email) continue;
    const payload = {
      barberName: a.barber_name, serviceName: a.service_name, addonNames: a.addon_names,
      when: `${a.day}, ${a.time}`, amount: a.amount,
      payLabel: a.pay_type === 'deposit' ? 'Deposit paid' : a.pay_type === 'full' ? 'Paid in full' : 'Pay in shop',
      customerName: a.customer_name, customerPhone: a.customer_phone, customerEmail: a.customer_email,
    };
    const res = await sendEmail({
      to: a.customer_email,
      subject: `Reminder: your cut tomorrow at ${a.time}`,
      html: customerConfirmEmail(payload),
    });
    if (!res.error) {
      await supabase.from('appointments').update({ reminder_sent: true }).eq('id', a.id);
      sent += 1;
    }
  }

  return NextResponse.json({ ok: true, date: tomorrow, sent, checked: (appts || []).length });
}
