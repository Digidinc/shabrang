import BlogPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/blog/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return BlogPage({ params: Promise.resolve({ lang: 'en' }) });
}
