import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContent } from '@/lib/content';

export const metadata = {
  title: "Johnson's Barbers — Sharp cuts. Straight talk.",
  description:
    'Precision fades, classic scissor work, and hot-towel shaves. Book your barber online in 60 seconds at Johnson\'s Barbers.',
  icons: { icon: '/favicon.svg' },
};

// Set the theme before paint to avoid a flash of the wrong theme.
const themeScript = `
(function(){try{var t=localStorage.getItem('jb-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default async function RootLayout({ children }) {
  const content = await getContent();
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="app-root">
          <Header />
          {children}
          <Footer content={content} />
        </div>
      </body>
    </html>
  );
}
