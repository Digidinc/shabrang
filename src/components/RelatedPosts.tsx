import Link from 'next/link';
import { getBlogPosts, estimateReadTime, type ParsedContent, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';
import { VoiceTag } from './VoiceTag';

interface RelatedPost {
  id: string;
  title: string;
  abstract?: string;
  href: string;
  tags: string[];
  matchCount: number;
  readTime: string;
  voice?: string;
}

export function RelatedPosts({
  lang,
  currentId,
  currentTags,
  basePath,
  view = 'kasra',
  maxResults = 3,
}: {
  lang: string;
  currentId: string;
  currentTags: string[];
  basePath: string;
  view?: PerspectiveView;
  maxResults?: number;
}) {
  if (!currentTags || currentTags.length === 0) return null;

  // Get all blog posts
  const allPosts = getBlogPosts(lang);

  // Find related posts by tag overlap
  const relatedCandidates = allPosts
    .filter((post) => post.frontmatter.id !== currentId) // Exclude current post
    .filter((post) => matchesPerspectiveView(post.frontmatter.perspective, view))
    .map((post) => {
      const fm = post.frontmatter;
      const postTags = fm.tags || [];

      // Count matching tags
      const matchCount = postTags.filter((tag) => currentTags.includes(tag)).length;

      if (matchCount === 0) return null;

      const readTime = fm.read_time || estimateReadTime(post.body);
      const voice = fm.voice || (fm.perspective === 'river' ? 'river' : fm.perspective === 'kasra' ? 'kasra' : undefined);

      return {
        id: fm.id,
        title: fm.title,
        abstract: fm.abstract,
        href: `${basePath}/blog/${fm.id}`,
        tags: postTags,
        matchCount,
        readTime,
        voice,
      } as RelatedPost;
    })
    .filter((p) => p !== null) as RelatedPost[];

  const related = relatedCandidates
    .sort((a, b) => {
      // Sort by match count (descending), then by title
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return a.title.localeCompare(b.title);
    })
    .slice(0, maxResults);

  if (related.length === 0) return null;

  // Find common tags
  const commonTags = currentTags.filter((tag) =>
    related.some((post) => post.tags.includes(tag))
  );

  return (
    <section className="mt-16 pt-8 border-t border-frc-blue/30">
      <header className="mb-6">
        <h2 className="text-xl font-light text-frc-gold mb-2">Related Posts</h2>
        {commonTags.length > 0 && (
          <p className="text-sm text-frc-text-dim">
            Based on shared tags:{' '}
            {commonTags.map((tag, i) => (
              <span key={tag}>
                {i > 0 && ', '}
                <Link
                  href={`${basePath}/tags/${encodeURIComponent(tag)}`}
                  className="text-frc-gold hover:underline"
                >
                  {tag}
                </Link>
              </span>
            ))}
          </p>
        )}
      </header>

      <div className="space-y-6">
        {related.map((post) => (
          <article key={post.id} className="group">
            <Link
              href={post.href}
              className="block p-4 rounded-lg border border-frc-blue/20 hover:border-frc-gold/50 hover:bg-frc-void/5 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-medium text-frc-text group-hover:text-frc-gold transition-colors">
                  {post.title}
                </h3>
                <span className="text-xs text-frc-text-dim font-mono whitespace-nowrap">
                  {post.readTime}
                </span>
              </div>

              {post.abstract && (
                <p className="text-sm text-frc-text-dim leading-relaxed mb-3">
                  {post.abstract}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs">
                {post.voice && <VoiceTag voice={post.voice} />}
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`tag-inline ${currentTags.includes(tag) ? 'bg-frc-gold/20 border-frc-gold/50' : ''}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-frc-text-dim">+{post.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
