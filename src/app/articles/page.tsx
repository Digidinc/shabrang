import ArticlesPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/articles/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return ArticlesPage({ params: Promise.resolve({ lang: 'en' }) });
}

