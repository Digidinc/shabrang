import ArtPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/art/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return ArtPage({ params: Promise.resolve({ lang: 'en' }) });
}
