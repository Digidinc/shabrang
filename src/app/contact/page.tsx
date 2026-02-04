import ContactPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/contact/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return ContactPage({ params: Promise.resolve({ lang: 'en' }) });
}
