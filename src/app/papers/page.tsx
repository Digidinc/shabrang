import PapersPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/papers/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return PapersPage({ params: Promise.resolve({ lang: 'en' }) });
}

