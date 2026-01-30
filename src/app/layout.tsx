import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ModeProvider } from '@/components/ModeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TextSharePopover } from '@/components/TextSharePopover';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { schemaSiteGraph, schemaDataset } from '@/lib/schema';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Shabrang — The Liquid Fortress',
    template: '%s | Shabrang',
  },
  description: 'Art, philosophy, and the Persian spirit. The Liquid Fortress book, albums, and explorations of coherence through Persian aesthetics.',
  keywords: ['Shabrang', 'Liquid Fortress', 'Persian art', 'Persian philosophy', 'coherence', 'miniature', 'Hadi Servat'],
  authors: [{ name: 'Hadi Servat' }],
  metadataBase: new URL('https://shabrang.ca'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Shabrang',
    title: 'Shabrang — The Liquid Fortress',
    description: 'Art, philosophy, and the Persian spirit. Explore The Liquid Fortress and albums.',
    images: [{ url: '/brand/banner.jpg', width: 1024, height: 572 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shabrang — The Liquid Fortress',
    description: 'Art, philosophy, and the Persian spirit.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/brand/sigil-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/sigil-64.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Vazirmatn:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <SchemaScript data={schemaSiteGraph()} />
        <SchemaScript data={schemaDataset()} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <ThemeProvider>
          <ModeProvider>
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <TextSharePopover />
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
