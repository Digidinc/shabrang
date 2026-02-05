import BooksPage, { generateMetadata as generateLangMetadata } from '@/app/[lang]/books/page';

export const generateMetadata = () => generateLangMetadata({ params: Promise.resolve({ lang: 'en' }) });

export default function Page() {
  return BooksPage({ params: Promise.resolve({ lang: 'en' }) });
}
