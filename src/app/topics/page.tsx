import TopicsPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/topics/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return TopicsPage({ params: Promise.resolve({ lang: 'en' }) });
}
