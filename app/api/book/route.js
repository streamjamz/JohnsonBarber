import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SEED } from '@/lib/seed';
import { sendEmail, barberAlertEmail, customerConfirmEmail } from '@/lib/email';

export const runtime = 'nodejs';

const payLabel = (t) => (t === 'deposit' ? 'Deposit paid online' : t === 'full' ? 'Paid in full online' : 'Paying in shop');

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { barberId, serviceId, addonIds = [], day, time, payType, amount, amountPaid, customer, when } = body || {};

  // --- validate ---
  if (!customer || !customer.name || !/.+@.+\..+/.test(customer.email || '')) {
    return NextResponse.json({ error: 'Please provide your name and a valid email.' }, { status: 400 });
  }
  if (!serviceId || !day || !time || !payType) {
    return NextResponse.json({ error: 'Missing booking details.' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // --- resolve barber & service (from DB if available, else seed) ---
  let barber = null, service = null, addonRows = [];
  if (supabase) {
    const [{ data: b }, { data: s }, { data: ad }] = await Promise.all([
      barberId ? supabase.from('barbers').select('*').eq('id', barberId).maybeSingle() : Promise.resolve({ data: null }),
      supabase.from('services').select('*').eq('id', serviceId).maybeSingle(),
      addonIds.length ? supabase.from('addons').select('*').in('id', addonIds) : Promise.resolve({ data: [] }),
    ]);
    barber = b; service = s; addonRows = ad || [];
  }
  if (!barber && barberId) barber = SEED.barbers.find((x) => x.id === barberId) || null;
  if (!service) service = SEED.services.find((x) => x.id === serviceId) || null;
  if (!addonRows.length && addonIds.length) addonRows = SEED.addons.filter((x) => addonIds.includes(x.id));

  const barberName = barber ? barber.name : 'Any barber';
  const serviceName = service ? service.name : 'Service';
  const addonNames = addonRows.map((a) => a.name).join(', ');

  // --- persist ---
  let saved = false;
  if (supabase) {
    const { error } = await supabase.from('appointments').insert({
      barber_id: barber ? barber.id : null,
      barber_name: barberName,
      service_id: serviceId,
      service_name: serviceName,
      addon_names: addonNames || null,
      day,
      time,
      customer_name: customer.name,
      customer_phone: customer.phone || null,
      customer_email: customer.email,
      pay_type: payType,
      amount: Number(amount) || 0,
      amount_paid: Number(amountPaid) || 0,
      status: 'confirmed',
    });
    if (error) {
      console.error('[book] insert error:', error);
      return NextResponse.json({ error: 'Could not save the booking. Please try again.' }, { status: 500 });
    }
    saved = true;
  } else {
    console.warn('[book] Supabase not configured — booking not persisted.');
  }

  // --- notify (email-first; failures do not block the booking) ---
  const payload = {
    barberName, serviceName, addonNames, when: when || `${day}, ${time}`,
    amount: Number(amount) || 0, payLabel: payLabel(payType),
    customerName: customer.name, customerPhone: customer.phone, customerEmail: customer.email,
  };
  const barberTo = (barber && barber.email) || process.env.SHOP_EMAIL;
  await Promise.allSettled([
    sendEmail({ to: barberTo, subject: `New booking: ${serviceName} — ${when || day}`, html: barberAlertEmail(payload) }),
    sendEmail({ to: customer.email, subject: "You're booked in at Johnson's Barbers", html: customerConfirmEmail(payload) }),
  ]);

  return NextResponse.json({ ok: true, saved });
}
