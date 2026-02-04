import PeoplePage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/people/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return PeoplePage({ params: Promise.resolve({ lang: 'en' }) });
}

