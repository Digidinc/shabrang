import type { Metadata } from 'next';
import { ShabrangHome } from '@/components/pages/ShabrangHome';
import { getBlogPosts, estimateReadTime, matchesPerspectiveView, getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Shabrang — The Liquid Fortress',
  description: 'Art, philosophy, and the Persian spirit. The Liquid Fortress book, albums, and explorations of coherence through Persian aesthetics.',
  alternates: {
    canonical: '/',
    languages: Object.fromEntries(
      getLanguages().map((lang) => [lang, lang === 'en' ? '/' : `/${lang}`]).concat([['x-default', '/']])
    ),
  },
};

export default async function Home() {
  const lang = 'en';
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
