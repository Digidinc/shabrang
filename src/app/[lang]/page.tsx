import { getLanguages, getBlogPosts, estimateReadTime, matchesPerspectiveView } from '@/lib/content';
import { ShabrangHome } from '@/components/pages/ShabrangHome';

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ContentHub({ params }: Props) {
  const { lang } = await params;

  // Fetch featured posts on server
  const essentialIds = [
    'adab-social-handshake',
    'taarof-game-theory',
    'qanats-decentralized-grid',
    'shahnameh-civilizational-hard-drive',
    'simurgh-swarm-intelligence',
    'persian-rug-quantum-nft',
  ];

  const allPosts = getBlogPosts(lang).filter((post) => matchesPerspectiveView(post.frontmatter.perspective, 'kasra'));
  const featuredPosts = essentialIds
    .map((id) => {
      const post = allPosts.find((p) => p.frontmatter.id === id);
      if (!post) return null;
      const fm = post.frontmatter;
      const readTime = fm.read_time || estimateReadTime(post.body);
      return {
        id: fm.id,
        title: fm.title,
        abstract: fm.abstract,
        readTime,
        tags: fm.tags || [],
      };
    })
    .filter((p) => p !== null)
    .slice(0, 6);

  return <ShabrangHome lang={lang} featuredPosts={featuredPosts} />;
}
