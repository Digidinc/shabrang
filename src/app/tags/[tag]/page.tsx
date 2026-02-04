import TagPage, {
  generateStaticParams as generateLangStaticParams,
  generateMetadata as generateLangMetadata,
} from '@/app/[lang]/tags/[tag]/page';

export async function generateStaticParams() {
  const params = await generateLangStaticParams();
  return params.filter((p) => p.lang === 'en').map((p) => ({ tag: p.tag }));
}

export const generateMetadata = ({ params }: { params: Promise<{ tag: string }> }) =>
  generateLangMetadata({ params: params.then(({ tag }) => ({ lang: 'en', tag })) });

export default function Page({ params }: { params: Promise<{ tag: string }> }) {
  return TagPage({ params: params.then(({ tag }) => ({ lang: 'en', tag })) });
}
