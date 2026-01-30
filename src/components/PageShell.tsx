import { ReadingMode } from '@/components/ReadingMode';

export function PageShell({
  leftMobile,
  leftDesktop,
  right,
  children,
  withReadingMode = true,
  articleClassName = '',
}: {
  leftMobile?: React.ReactNode;
  leftDesktop?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  withReadingMode?: boolean;
  articleClassName?: string;
}) {
  return (
    <>
      <main className="shabrang-page">
        <div className="shabrang-container">
          <div className="shabrang-layout">
            {leftMobile}
            {leftDesktop}
            <article className={`shabrang-content ${articleClassName}`}>
              {children}
            </article>
            {right}
          </div>
        </div>
      </main>
      {withReadingMode ? <ReadingMode /> : null}
    </>
  );
}

