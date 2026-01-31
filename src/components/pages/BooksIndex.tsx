import Link from 'next/link';
import { getBooks, matchesPerspectiveView, type PerspectiveView } from '@/lib/content';

export function BooksIndex({
  lang,
  basePath,
  view,
  embedded = false,
}: {
  lang: string;
  basePath: string;
  view: PerspectiveView;
  embedded?: boolean;
}) {
  const books = getBooks(lang).filter((b) => matchesPerspectiveView(b.frontmatter.perspective, view));

  const content = (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-16 relative">
        <div className="absolute -left-4 top-0 w-1 h-12 bg-shabrang-gold" />
        <h1 className="text-4xl md:text-5xl font-display text-shabrang-ink mb-4 uppercase tracking-wider">
          The Library
        </h1>
        <p className="text-shabrang-ink-dim text-lg italic max-w-2xl border-l border-shabrang-gold/30 pl-6">
          Technical foundations, narrative primers, and structural histories of the Sovereign OS.
        </p>
      </header>

      {books.length === 0 ? (
        <div className="text-shabrang-ink-dim text-sm border border-shabrang-teal/20 bg-shabrang-sand/30 p-8 rounded-lg">
          No books published yet in this perspective.
        </div>
      ) : (
        <div className="grid gap-12">
          {books.map((b) => {
            const fm = b.frontmatter;
            const isFrc = fm.id.includes('frc');
            
            return (
              <Link
                key={fm.id}
                href={`${basePath}/books/${fm.id}`}
                className="group relative block overflow-hidden border-2 border-shabrang-ink transition-all duration-500 hover:border-shabrang-gold"
              >
                {/* Text background overlay - matching top bar color */}
                <div className="absolute inset-0 bg-shabrang-sand transition-transform duration-500 group-hover:scale-[1.02]" />
                
                {/* Ornate corner */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 right-4 w-8 h-px bg-shabrang-gold" />
                  <div className="absolute top-4 right-4 w-px h-8 bg-shabrang-gold" />
                </div>

                <div className="relative z-10 p-0 md:p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Book Cover */}
                    {fm.cover && (
                      <div className="w-full lg:w-1/3 xl:w-1/4 relative overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-shabrang-ink group-hover:border-shabrang-gold transition-colors duration-500">
                        <img 
                          src={fm.cover} 
                          alt={fm.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-shabrang-ink/10 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                    )}

                    {/* Book Details */}
                    <div className={`flex-1 p-8 md:p-12 ${!fm.cover ? 'w-full' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-shabrang-ink/10 pb-8">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                              isFrc ? 'bg-shabrang-teal text-shabrang-sand border-shabrang-teal' : 'bg-shabrang-gold text-shabrang-ink border-shabrang-gold'
                            }`}>
                              {isFrc ? 'Technical' : 'Narrative'}
                            </span>
                            <span className="text-[10px] text-shabrang-ink-dim uppercase tracking-[0.2em] font-mono">
                              ID: {fm.id}
                            </span>
                          </div>
                          <h2 className="text-3xl md:text-4xl text-shabrang-ink group-hover:text-shabrang-gold transition-colors font-display uppercase tracking-wide leading-tight">
                            {fm.title}
                          </h2>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-shabrang-ink-dim uppercase tracking-widest mb-1">Status</div>
                          <div className="text-xs font-mono text-shabrang-teal uppercase tracking-widest">Distributed</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2">
                          <p className="text-shabrang-ink-dim text-lg leading-relaxed line-clamp-4 font-body italic mb-6">
                            {fm.abstract}
                          </p>
                          <div className="inline-flex items-center gap-2 text-shabrang-teal group-hover:text-shabrang-gold transition-colors font-display text-sm uppercase tracking-widest">
                            Initialize Access <span>&rarr;</span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end space-y-4 pt-4 md:pt-0">
                          <div className="border-t border-shabrang-gold/20 pt-4">
                            <div className="text-[10px] text-shabrang-ink-dim uppercase tracking-widest mb-1">Author</div>
                            <div className="text-sm font-display text-shabrang-ink uppercase">{fm.author || 'FRC'}</div>
                          </div>
                          {fm.date && (
                            <div className="border-t border-shabrang-gold/20 pt-4">
                              <div className="text-[10px] text-shabrang-ink-dim uppercase tracking-widest mb-1">Published</div>
                              <div className="text-sm font-mono text-shabrang-ink">{fm.date}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  if (embedded) return content;
  return <main className="shabrang-page">{content}</main>;
}
