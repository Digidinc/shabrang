import Link from 'next/link';

interface FeaturedPost {
  id: string;
  title: string;
  abstract?: string;
  readTime: string;
  tags: string[];
}

export function FeaturedPosts({
  posts,
  basePath,
}: {
  posts: FeaturedPost[];
  basePath: string;
}) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`${basePath}/blog/${post.id}`}
          className="group block bg-frc-void/5 border border-frc-blue/20 hover:border-frc-gold/50 p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-medium text-frc-text group-hover:text-frc-gold transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>

          {post.abstract && (
            <p className="text-sm text-frc-text-dim leading-relaxed mb-4 line-clamp-3">
              {post.abstract}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-frc-text-dim">
            <span className="font-mono">{post.readTime}</span>
            {post.tags && post.tags.length > 0 && (
              <span className="tag-inline">{post.tags[0]}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
