import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ModeProvider } from '@/components/ModeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TextSharePopover } from '@/components/TextSharePopover';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { CommandPalette } from '@/components/CommandPalette';
import { schemaSiteGraph, schemaDataset } from '@/lib/schema';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Shabrang — The Liquid Fortress',
    template: '%s | Shabrang',
  },
  description: 'Art, philosophy, and the Persian spirit. The Liquid Fortress book, albums, and explorations of coherence through Persian aesthetics.',
  keywords: ['Shabrang', 'Liquid Fortress', 'Persian art', 'Persian philosophy', 'coherence', 'miniature', 'Hadi Servat'],
  authors: [{ name: 'Kay Hermes' }],
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
        <link rel="icon" href="/brand/logo-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/logo-180.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Vazirmatn:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="help" href="/llms.txt" type="text/plain" title="Machine-readable site summary" />
        <SchemaScript data={schemaSiteGraph()} />
        <SchemaScript data={schemaDataset()} />
      </head>
      <body className="antialiased min-h-screen flex flex-col text-shabrang-ink bg-shabrang-parchment">
        <GoogleAnalytics />
        <ThemeProvider>
          <ModeProvider>
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <CommandPalette />
            <TextSharePopover />
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
