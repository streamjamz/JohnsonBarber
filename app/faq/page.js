import Link from 'next/link';
import Faq from '@/components/Faq';
import { getPolicies, getFaqs } from '@/lib/content';

export const revalidate = 0;

export default async function FaqPage() {
  const [policies, faqs] = await Promise.all([getPolicies(), getFaqs()]);

  return (
    <main className="page page-narrow" data-page="faq">
      <div className="page-head">
        <div className="eyebrow">Good to Know</div>
        <h1>Policies &amp; FAQ</h1>
        <p>The house rules and the questions we get asked most. Short version: show up, we&apos;ll take care of the rest.</p>
      </div>

      <div className="policies-section">
        <div className="kit-section-label">Shop Policies</div>
        <div className="policies-grid">
          {policies.map((p) => (
            <div className="policy-card" key={p.id}>
              <div className="policy-icon">{p.icon}</div>
              <div className="policy-title">{p.title}</div>
              <div className="policy-body">{p.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-section">
        <div className="kit-section-label">Frequently Asked</div>
        <Faq faqs={faqs} />
      </div>

      <div className="faq-cta">
        <h3>Still got a question?</h3>
        <p>Call the shop or just book and ask in the chair.</p>
        <Link href="/book" className="btn btn-red">Book an Appointment</Link>
      </div>
    </main>
  );
}
