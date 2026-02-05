import StartHerePage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/start/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return StartHerePage({ params: Promise.resolve({ lang: 'en' }) });
}

