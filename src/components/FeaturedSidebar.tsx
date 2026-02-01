import Link from 'next/link';

interface FeaturedPost {
  id: string;
  title: string;
  readTime: string;
}

export function FeaturedSidebar({
  posts,
  basePath,
  title = "Popular Posts",
}: {
  posts: FeaturedPost[];
  basePath: string;
  title?: string;
}) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className="bg-frc-void/5 border border-frc-blue/20 p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-frc-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h3 className="text-sm font-medium text-frc-text uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <ol className="space-y-3 list-none">
        {posts.map((post, index) => (
          <li key={post.id} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-frc-gold/20 text-frc-gold text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                href={`${basePath}/blog/${post.id}`}
                className="text-sm text-frc-text hover:text-frc-gold transition-colors line-clamp-2 leading-snug"
              >
                {post.title}
              </Link>
              <span className="text-xs text-frc-text-dim font-mono block mt-1">
                {post.readTime}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
