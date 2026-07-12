import { createAdminClient } from '@/lib/supabase/admin';
import { upsertBarber, deleteBarber } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

function BarberFields({ b = {} }) {
  return (
    <>
      <div className="row2">
        <div className="field"><label>Name</label><input name="name" defaultValue={b.name || ''} required /></div>
        <div className="field"><label>Short name (for buttons)</label><input name="first_name" defaultValue={b.first_name || ''} placeholder="e.g. Miguel" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Role</label><input name="role" defaultValue={b.role || ''} placeholder="Senior Barber" /></div>
        <div className="field"><label>Specialty</label><input name="specialty" defaultValue={b.specialty || ''} placeholder="Fades, tapers…" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Alert email (bookings go here)</label><input name="email" type="email" defaultValue={b.email || ''} placeholder="barber@email.com" /></div>
        <div className="field"><label>Phone</label><input name="phone" defaultValue={b.phone || ''} /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Photo URL (optional)</label><input name="photo_url" defaultValue={b.photo_url || ''} placeholder="https://…" /></div>
        <div className="field"><label>Initial (fallback avatar)</label><input name="initial" defaultValue={b.initial || ''} maxLength={2} placeholder="M" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Sort order</label><input name="sort_order" type="number" defaultValue={b.sort_order ?? 0} /></div>
        <div className="field">
          <label>Active (shown on site)</label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>
            <input name="active" type="checkbox" defaultChecked={b.id ? !!b.active : true} style={{ width: 'auto' }} /> Visible &amp; bookable
          </label>
        </div>
      </div>
    </>
  );
}

export default async function BarbersAdminPage() {
  const supabase = createAdminClient();
  let barbers = [];
  if (supabase) {
    const { data } = await supabase.from('barbers').select('*').order('sort_order', { ascending: true });
    barbers = data || [];
  }

  return (
    <>
      <h1 className="admin-h1">Barbers</h1>
      <p className="admin-sub">Add, edit, or remove barbers. Bookings for a barber are emailed to their alert email.</p>

      {barbers.map((b) => (
        <div className="card" key={b.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="li-avatar">{b.photo_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.photo_url} alt={b.name} /> : (b.initial || b.name?.[0])}</div>
            <h3 style={{ margin: 0 }}>{b.name}{!b.active && <span className="badge-off" style={{ marginLeft: 10 }}>Hidden</span>}</h3>
          </div>
          <form action={upsertBarber}>
            <input type="hidden" name="id" value={b.id} />
            <BarberFields b={b} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="abtn" type="submit">Save changes</button>
            </div>
          </form>
          <form action={deleteBarber} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={b.id} />
            <button className="abtn danger sm" type="submit">Remove barber</button>
          </form>
        </div>
      ))}

      <div className="card" style={{ borderColor: 'var(--red)' }}>
        <h3>+ Add a barber</h3>
        <form action={upsertBarber}>
          <BarberFields />
          <button className="abtn" type="submit">Add barber</button>
        </form>
      </div>
    </>
  );
}
