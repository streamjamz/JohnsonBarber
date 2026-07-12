import { redirect } from 'next/navigation';
import { getGallery, getReviews, getContent } from '@/lib/content';
import { isHidden } from '@/lib/site-config';

export const revalidate = 0;

export default async function GalleryPage() {
  if (isHidden('gallery')) redirect('/');
  const [gallery, reviews, content] = await Promise.all([getGallery(), getReviews(), getContent()]);
  const c = content;
  const insta = (c.shop_instagram || '@johnsonsbarbers').replace(/^@/, '');

  return (
    <main className="page page-wide" data-page="gallery">
      <div className="page-head">
        <div className="eyebrow">The Work</div>
        <h1>Fresh Cuts</h1>
        <p>Real cuts from real chairs. Drop your own photos into any tile — or link the shop&apos;s Instagram and let it fill itself.</p>
      </div>

      <div className="gallery-grid">
        {gallery.map((g) => (
          <div className={('gallery-tile ' + (g.span || '')).trim()} key={g.id}>
            {g.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.image_url} alt={g.hint || 'Cut photo'} />
            ) : (
              <div className="slot"><span className="cam">📷</span><span>{g.hint || 'Cut photo'}</span></div>
            )}
          </div>
        ))}
      </div>

      <div className="insta">
        <div>
          <h3>Follow the chair</h3>
          <p>Post every cut to <b>{c.shop_instagram}</b> and embed the feed here so this gallery updates itself — no re-uploading. New clients trust what they can see.</p>
        </div>
        <a href={`https://instagram.com/${insta}`} target="_blank" rel="noopener noreferrer">{c.shop_instagram}</a>
      </div>

      <div className="reviews-head">
        <div className="eyebrow">Social Proof</div>
        <h2>What people say</h2>
        <div className="reviews-rating">
          <span className="stars">★★★★★</span>
          <span><b>{c.reviews_rating}</b> · {c.reviews_count} Google reviews</span>
        </div>
      </div>
      <div className="reviews-grid">
        {reviews.map((r) => (
          <div className="review-card" key={r.id}>
            <div className="review-stars">★★★★★</div>
            <p className="review-text">&ldquo;{r.text}&rdquo;</p>
            <div className="review-author">
              <div className="review-avatar">{r.initial}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-when">{r.when_text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="widget-slot">
        <div className="box">💡 Widget slot — embed your live Google Reviews here so new 5-stars appear automatically.</div>
      </div>
    </main>
  );
}
