import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SplitShare — Smart OTT Subscription Sharing',
  description: 'Book smart time slots, share subscriptions, and save with AI.',
  metadataBase: new URL('https://splitshare.app'),
  icons: {
    icon: [{ url: '/favicon.ico' }]
  },
  openGraph: {
    title: 'SplitShare',
    description: 'AI-powered OTT subscription sharing with smart slot booking.',
    type: 'website',
    url: 'https://splitshare.app'
  },
  themeColor: '#0D0D0D'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


