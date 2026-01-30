import React from 'react';
import { CommandPalette } from '@/components/CommandPalette';
import { TranslationBadge } from '@/components/TranslationBadge';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const isRTL = RTL_LANGUAGES.includes(lang);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={lang} className={isRTL ? 'font-farsi' : ''}>
      <CommandPalette />
      <TranslationBadge lang={lang} />
      {children}
    </div>
  );
}
