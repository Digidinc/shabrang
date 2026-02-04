export { metadata } from '@/app/[lang]/books/page';
import BooksPage from '@/app/[lang]/books/page';

export default function Page() {
  return BooksPage({ params: Promise.resolve({ lang: 'en' }) });
}
