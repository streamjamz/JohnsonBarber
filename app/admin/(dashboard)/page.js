import { createAdminClient } from '@/lib/supabase/admin';
import { cancelAppointment } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const supabase = createAdminClient();
  let appts = [];
  if (supabase) {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .gte('day', today)
      .order('day', { ascending: true })
      .order('time', { ascending: true });
    appts = data || [];
  }
  const upcoming = appts.filter((a) => a.status !== 'cancelled');

  return (
    <>
      <h1 className="admin-h1">Bookings</h1>
      <p className="admin-sub">Upcoming appointments. Each new booking also emails the barber and the customer.</p>

      {upcoming.length === 0 && (
        <div className="card"><p style={{ color: 'var(--muted)', margin: 0 }}>No upcoming bookings yet.</p></div>
      )}

      {upcoming.map((a) => (
        <div className="appt-row" key={a.id}>
          <div className="appt-when">{a.day}<br />{a.time}</div>
          <div>
            <div className="li-title">{a.service_name} · {a.barber_name}</div>
            <div className="li-sub">
              {a.customer_name}{a.customer_phone ? ` · ${a.customer_phone}` : ''} · {a.customer_email}
              {a.addon_names ? ` · +${a.addon_names}` : ''}
            </div>
            <div className="appt-status">
              ${a.amount} · {a.pay_type === 'deposit' ? `deposit $${a.amount_paid} paid` : a.pay_type === 'full' ? 'paid in full' : 'pay in shop'}
            </div>
          </div>
          <form action={cancelAppointment}>
            <input type="hidden" name="id" value={a.id} />
            <button className="abtn danger sm" type="submit">Cancel</button>
          </form>
        </div>
      ))}
    </>
  );
}
