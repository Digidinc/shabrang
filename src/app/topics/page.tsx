export { metadata } from '@/app/[lang]/topics/page';
import TopicsPage from '@/app/[lang]/topics/page';

export default function Page() {
  return TopicsPage({ params: Promise.resolve({ lang: 'en' }) });
}
