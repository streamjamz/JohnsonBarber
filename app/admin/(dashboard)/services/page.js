import { createAdminClient } from '@/lib/supabase/admin';
import { upsertService, deleteService, upsertAddon, deleteAddon } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

function ServiceFields({ s = {}, withDuration = true }) {
  return (
    <>
      <div className="field"><label>Name</label><input name="name" defaultValue={s.name || ''} required /></div>
      <div className="row2">
        <div className="field"><label>Price ($)</label><input name="price" type="number" defaultValue={s.price ?? 0} /></div>
        {withDuration
          ? <div className="field"><label>Duration</label><input name="duration" defaultValue={s.duration || ''} placeholder="45 min" /></div>
          : <div className="field"><label>Sort order</label><input name="sort_order" type="number" defaultValue={s.sort_order ?? 0} /></div>}
      </div>
      <div className="field"><label>Description</label><textarea name="description" defaultValue={s.description || ''} /></div>
      {withDuration && (
        <div className="row2">
          <div className="field"><label>Sort order</label><input name="sort_order" type="number" defaultValue={s.sort_order ?? 0} /></div>
          <div className="field">
            <label>Active</label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>
              <input name="active" type="checkbox" defaultChecked={s.id ? !!s.active : true} style={{ width: 'auto' }} /> Shown on menu
            </label>
          </div>
        </div>
      )}
      {!withDuration && (
        <div className="field">
          <label>Active</label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>
            <input name="active" type="checkbox" defaultChecked={s.id ? !!s.active : true} style={{ width: 'auto' }} /> Shown on menu
          </label>
        </div>
      )}
    </>
  );
}

export default async function ServicesAdminPage() {
  const supabase = createAdminClient();
  let services = [], addons = [];
  if (supabase) {
    const [{ data: sv }, { data: ad }] = await Promise.all([
      supabase.from('services').select('*').order('sort_order', { ascending: true }),
      supabase.from('addons').select('*').order('sort_order', { ascending: true }),
    ]);
    services = sv || []; addons = ad || [];
  }

  return (
    <>
      <h1 className="admin-h1">Services &amp; Add-ons</h1>
      <p className="admin-sub">Edit the menu shown on the site and used in the booking flow.</p>

      <h3 style={{ color: 'var(--red)', fontFamily: "'Barlow Condensed'", letterSpacing: 2, textTransform: 'uppercase' }}>Services</h3>
      {services.map((s) => (
        <div className="card" key={s.id}>
          <h3>{s.name} · ${s.price}{!s.active && <span className="badge-off" style={{ marginLeft: 10 }}>Hidden</span>}</h3>
          <form action={upsertService}>
            <input type="hidden" name="id" value={s.id} />
            <ServiceFields s={s} />
            <button className="abtn" type="submit">Save</button>
          </form>
          <form action={deleteService} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={s.id} />
            <button className="abtn danger sm" type="submit">Remove</button>
          </form>
        </div>
      ))}
      <div className="card" style={{ borderColor: 'var(--red)' }}>
        <h3>+ Add a service</h3>
        <form action={upsertService}><ServiceFields /><button className="abtn" type="submit">Add service</button></form>
      </div>

      <h3 style={{ color: 'var(--red)', fontFamily: "'Barlow Condensed'", letterSpacing: 2, textTransform: 'uppercase', marginTop: 34 }}>Add-ons</h3>
      {addons.map((a) => (
        <div className="card" key={a.id}>
          <h3>{a.name} · +${a.price}{!a.active && <span className="badge-off" style={{ marginLeft: 10 }}>Hidden</span>}</h3>
          <form action={upsertAddon}>
            <input type="hidden" name="id" value={a.id} />
            <ServiceFields s={a} withDuration={false} />
            <button className="abtn" type="submit">Save</button>
          </form>
          <form action={deleteAddon} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={a.id} />
            <button className="abtn danger sm" type="submit">Remove</button>
          </form>
        </div>
      ))}
      <div className="card" style={{ borderColor: 'var(--red)' }}>
        <h3>+ Add an add-on</h3>
        <form action={upsertAddon}><ServiceFields withDuration={false} /><button className="abtn" type="submit">Add add-on</button></form>
      </div>
    </>
  );
}
