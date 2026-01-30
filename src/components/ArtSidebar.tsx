import Link from 'next/link';
import { getArtItems, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

interface ArtSidebarProps {
  lang: string;
  currentId?: string;
  basePath?: string;
  view?: PerspectiveView;
  variant?: 'desktop' | 'mobile';
}

export function ArtSidebar({ lang, currentId, basePath, view, variant = 'desktop' }: ArtSidebarProps) {
  const artifacts = getArtItems(lang)
    .filter((a) => (view ? matchesPerspectiveView(a.frontmatter.perspective, view) : true))
    .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));

  const base = basePath || `/${lang}`;
  const isMobile = variant === 'mobile';

  // Helper to safely access extended frontmatter properties
  const getFm = (a: typeof artifacts[0]) => a.frontmatter as unknown as Record<string, unknown>;

  return (
    <aside
      data-sidebar
      className={
        isMobile
          ? 'w-full border-b border-shabrang-teal/30 block lg:hidden'
          : 'w-60 xl:w-72 shrink-0 border-r border-shabrang-teal/30 hidden lg:block'
      }
    >
      <details open={!isMobile}>
        {isMobile && (
          <summary className="px-4 py-3 text-sm text-shabrang-ink cursor-pointer select-none">
            <span className="text-xs uppercase tracking-wider text-shabrang-ink-dim">Browse artifacts</span>
          </summary>
        )}
        <nav className={isMobile ? 'py-3 px-4 text-sm' : 'py-6 px-4 text-sm sticky top-0'}>
          <div className="mb-4">
            <h3 className="text-xs uppercase tracking-wider text-shabrang-ink-dim mb-3 px-2">Imaginal Gallery</h3>
            <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1">
              {artifacts.map((art) => (
                <li key={art.frontmatter.id}>
                  <Link
                    href={`${base}/art/${art.frontmatter.id}`}
                    className={`block px-2 py-1.5 rounded transition-colors ${
                      currentId === art.frontmatter.id
                        ? 'text-shabrang-gold bg-shabrang-teal/20 border-l-2 border-shabrang-gold'
                        : 'text-shabrang-ink-dim hover:text-shabrang-ink hover:bg-shabrang-teal/10'
                    }`}
                    title={art.frontmatter.title}
                  >
                    <span className="text-[9px] text-shabrang-gold font-mono mr-1.5">
                      {String(getFm(art).level || '').toUpperCase()}
                    </span>
                    <span className="truncate">{art.frontmatter.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-shabrang-teal/20">
            <Link href={`${base}/art`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              All Artifacts
            </Link>
            <Link href={`${base}/books`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Books
            </Link>
            <Link href={`${base}/topics`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Topics
            </Link>
            <Link href={`${base}/blog`} className="block px-2 py-1 text-shabrang-ink-dim hover:text-shabrang-gold transition-colors">
              Blog
            </Link>
          </div>
        </nav>
      </details>
    </aside>
  );
}
