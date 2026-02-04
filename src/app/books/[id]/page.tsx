import BookPage, {
  generateStaticParams as generateLangStaticParams,
  generateMetadata as generateLangMetadata,
} from '@/app/[lang]/books/[id]/page';

export async function generateStaticParams() {
  const params = await generateLangStaticParams();
  return params.filter((p) => p.lang === 'en').map((p) => ({ id: p.id }));
}

export const generateMetadata = ({ params }: { params: Promise<{ id: string }> }) =>
  generateLangMetadata({ params: params.then(({ id }) => ({ lang: 'en', id })) });

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return BookPage({ params: params.then(({ id }) => ({ lang: 'en', id })) });
}
