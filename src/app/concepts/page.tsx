import ConceptsPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/concepts/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return ConceptsPage({ params: Promise.resolve({ lang: 'en' }) });
}

