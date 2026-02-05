import PrivacyPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/privacy/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return PrivacyPage({ params: Promise.resolve({ lang: 'en' }) });
}
