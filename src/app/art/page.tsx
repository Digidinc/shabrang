export { metadata } from '@/app/[lang]/art/page';
import ArtPage from '@/app/[lang]/art/page';

export default function Page() {
  return ArtPage({ params: Promise.resolve({ lang: 'en' }) });
}
