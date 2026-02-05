import TermsPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/terms/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return TermsPage({ params: Promise.resolve({ lang: 'en' }) });
}
