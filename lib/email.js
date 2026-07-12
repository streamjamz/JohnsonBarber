import { Resend } from 'resend';

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

/**
 * Sends an email via Resend. No-ops (and logs) if RESEND_API_KEY isn't set,
 * so booking never fails just because email isn't configured yet.
 */
export async function sendEmail({ to, subject, html }) {
  if (!KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email to', to);
    return { skipped: true };
  }
  if (!to) return { skipped: true };
  try {
    const resend = new Resend(KEY);
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error('[email] send error:', error);
      return { error };
    }
    return { data };
  } catch (e) {
    console.error('[email] exception:', e);
    return { error: e };
  }
}

const wrap = (inner) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;">
    <div style="background:#0f0f11;padding:18px 22px;">
      <span style="font-family:Arial;font-weight:900;color:#fff;font-size:18px;letter-spacing:1px;">JOHNSON'S</span>
      <span style="color:#d6342c;font-weight:900;font-size:18px;"> BARBERS</span>
    </div>
    <div style="padding:24px 22px;border:1px solid #eee;border-top:none;">${inner}</div>
  </div>`;

function summaryTable(b) {
  const rows = [
    ['Barber', b.barberName],
    ['Service', b.serviceName],
    b.addonNames ? ['Add-ons', b.addonNames] : null,
    ['When', b.when],
    ['Total', `$${b.amount}`],
  ].filter(Boolean);
  return `<table style="width:100%;border-collapse:collapse;margin:14px 0;">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 0;color:#777;">${k}</td><td style="padding:6px 0;text-align:right;font-weight:600;">${v}</td></tr>`)
    .join('')}</table>`;
}

export function barberAlertEmail(b) {
  return wrap(`
    <h2 style="margin:0 0 6px;">New booking 💈</h2>
    <p style="margin:0 0 4px;color:#444;">${b.customerName} just booked a chair with you.</p>
    ${summaryTable(b)}
    <p style="margin:8px 0;color:#444;"><b>Customer:</b> ${b.customerName}<br/>
    ${b.customerPhone ? `<b>Phone:</b> ${b.customerPhone}<br/>` : ''}
    <b>Email:</b> ${b.customerEmail}</p>
    <p style="margin:8px 0;color:#444;"><b>Payment:</b> ${b.payLabel}</p>
  `);
}

export function customerConfirmEmail(b) {
  return wrap(`
    <h2 style="margin:0 0 6px;">You're booked in ✅</h2>
    <p style="margin:0 0 4px;color:#444;">Thanks ${b.customerName} — here are your details. We'll send a reminder 24 hours before.</p>
    ${summaryTable(b)}
    <p style="margin:8px 0;color:#444;"><b>Payment:</b> ${b.payLabel}</p>
    <p style="margin:16px 0 0;color:#777;font-size:13px;">Need to change or cancel? Just reply to this email or call the shop.</p>
  `);
}
