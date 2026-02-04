import AboutPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/about/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return AboutPage({ params: Promise.resolve({ lang: 'en' }) });
}
