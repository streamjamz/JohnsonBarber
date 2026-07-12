import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PWARegister from '@/components/PWARegister';
import { getContent } from '@/lib/content';

export const metadata = {
  title: "Johnson's Barbers — Sharp cuts. Straight talk.",
  description:
    'Precision fades, classic scissor work, and hot-towel shaves. Book your barber online in 60 seconds at Johnson\'s Barbers.',
  applicationName: "Johnson's Barbers",
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: "Johnson's Barbers" },
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-180.png',
  },
};

export const viewport = {
  themeColor: '#0f0f11',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
        <link rel="manifest" href="/manifest.webmanifest" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="app-root">
          <Header />
          {children}
          <Footer content={content} />
        </div>
        <PWARegister />
      </body>
    </html>
  );
}
