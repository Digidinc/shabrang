export { metadata } from '@/app/[lang]/blog/page';
import BlogPage from '@/app/[lang]/blog/page';

export default function Page() {
  return BlogPage({ params: Promise.resolve({ lang: 'en' }) });
}
