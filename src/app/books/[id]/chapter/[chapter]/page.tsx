import BookChapterPage, {
  generateStaticParams as generateLangStaticParams,
  generateMetadata as generateLangMetadata,
} from '@/app/[lang]/books/[id]/chapter/[chapter]/page';

export async function generateStaticParams() {
  const params = await generateLangStaticParams();
  return params
    .filter((p) => p.lang === 'en')
    .map((p) => ({ id: p.id, chapter: p.chapter }));
}

export const generateMetadata = ({ params }: { params: Promise<{ id: string; chapter: string }> }) =>
  generateLangMetadata({ params: params.then(({ id, chapter }) => ({ lang: 'en', id, chapter })) });

export default function Page({ params }: { params: Promise<{ id: string; chapter: string }> }) {
  return BookChapterPage({ params: params.then(({ id, chapter }) => ({ lang: 'en', id, chapter })) });
}
