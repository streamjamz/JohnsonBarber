import Checklist from '@/components/Checklist';
import PrintButton from '@/components/PrintButton';
import { getFeatures, getChecklist } from '@/lib/content';

export const revalidate = 0;

export default async function KitPage() {
  const [features, checklist] = await Promise.all([getFeatures(), getChecklist()]);

  return (
    <main className="page" data-page="kit" style={{ maxWidth: 940 }}>
      <div className="kit-head">
        <div>
          <div className="eyebrow">For the Owner</div>
          <h1>Launch Kit</h1>
        </div>
        <PrintButton />
      </div>
      <p className="kit-intro">Everything the shop needs to get this site live and keep the chair full. Print it, tape it to the mirror, tick the boxes.</p>

      <div className="kit-section-label">Go-Live Checklist · {checklist.length} Steps</div>
      <Checklist items={checklist} />

      <div className="kit-section-2">
        <div className="kit-section-label">High-Value Features · How to set each up</div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.id}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-body">{f.body}</div>
              <div className="feature-tip">{f.tip}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
