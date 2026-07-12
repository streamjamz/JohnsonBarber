import { getContent, getHours } from '@/lib/content';
import { saveContent, saveHours } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { key: 'hero_pill', label: 'Hero pill (top badge)' },
  { key: 'hero_title_1', label: 'Hero headline line 1' },
  { key: 'hero_title_2', label: 'Hero headline line 2 (red)' },
  { key: 'hero_sub', label: 'Hero sub-paragraph', long: true },
  { key: 'story_title', label: 'Story heading' },
  { key: 'story_p1', label: 'Story paragraph 1', long: true },
  { key: 'story_p2', label: 'Story paragraph 2', long: true },
  { key: 'shop_address', label: 'Shop address' },
  { key: 'shop_phone', label: 'Shop phone' },
  { key: 'shop_instagram', label: 'Instagram handle' },
  { key: 'reviews_rating', label: 'Reviews rating' },
  { key: 'reviews_count', label: 'Reviews count' },
  { key: 'closed_days', label: 'Closed weekdays (0=Sun … 6=Sat, comma-separated)' },
];

export default async function ContentAdminPage() {
  const [content, hours] = await Promise.all([getContent(), getHours()]);

  return (
    <>
      <h1 className="admin-h1">Content</h1>
      <p className="admin-sub">Edit the words on the site. Changes appear immediately.</p>

      <div className="card">
        <h3>Homepage &amp; shop info</h3>
        <form action={saveContent}>
          {FIELDS.map((f) => (
            <div className="field" key={f.key}>
              <input type="hidden" name="ckey" value={f.key} />
              <label>{f.label}</label>
              {f.long
                ? <textarea name={`cval_${f.key}`} defaultValue={content[f.key] || ''} />
                : <input name={`cval_${f.key}`} defaultValue={content[f.key] || ''} />}
            </div>
          ))}
          <button className="abtn" type="submit">Save content</button>
        </form>
      </div>

      <div className="card">
        <h3>Opening hours</h3>
        <form action={saveHours}>
          {hours.map((h) => (
            <div className="row2" key={h.id} style={{ alignItems: 'end' }}>
              <input type="hidden" name="hid" value={h.id} />
              <div className="field"><label>Day</label><input name={`day_${h.id}`} defaultValue={h.day || ''} /></div>
              <div className="field">
                <label>Hours</label>
                <input name={`time_${h.id}`} defaultValue={h.time || ''} />
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', textTransform: 'none', letterSpacing: 0, fontSize: 13, marginTop: 6 }}>
                  <input name={`closed_${h.id}`} type="checkbox" defaultChecked={!!h.closed} style={{ width: 'auto' }} /> Closed
                </label>
              </div>
            </div>
          ))}
          <button className="abtn" type="submit" style={{ marginTop: 6 }}>Save hours</button>
        </form>
      </div>
    </>
  );
}
