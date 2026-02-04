/**
 * Schema.org JSON-LD generators for Shabrang
 *
 * 13 schema types:
 * Site-level: WebSite, Organization, Person
 * Paper-level: ScholarlyArticle, VideoObject, ImageObject, AggregateRating,
 *              BreadcrumbList, CreativeWorkSeries, LearningResource
 * Concept-level: DefinedTerm, DefinedTermSet
 * Data-level: Dataset
 */

const SITE_URL = 'https://shabrang.ca';
const SITE_NAME = 'Shabrang';
const AUTHOR_NAME = 'Kay Hermes';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PaperMeta {
  id: string;
  title: string;
  series: string;
  author: string;
  date: string; // ISO 8601
  abstract: string;
  tags: string[];
  lang: string;
  doi?: string;
  video?: {
    url: string;
    embedUrl?: string;
    thumbnailUrl: string;
    duration?: string; // ISO 8601 duration (PT5M30S)
    uploadDate?: string;
  };
  images?: {
    url: string;
    caption: string;
    width?: number;
    height?: number;
  }[];
  rating?: {
    value: number;
    count: number;
    best?: number;
  };
}

export interface ConceptMeta {
  id: string;
  title: string;
  description: string;
  tags: string[];
  related: string[];
  lang: string;
}

export interface TopicMeta {
  id: string;
  title: string;
  question: string;
  shortAnswer: string;
  tags: string[];
  lang: string;
  date?: string;
  author?: string;
  /** Override canonical URL (e.g. River routes). */
  url?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ─── Site-Level Schemas ────────────────────────────────────────────────────

/** WebSite — top-level site identity */
export function schemaWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Persian wisdom through dialectic — a living conversation between opposing perspectives.',
  };
}

/** Organization — Shabrang publisher */
export function schemaOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: 'Shabrang',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    sameAs: [
      'https://github.com/Digidinc/shabrang',
      'https://github.com/Digidinc/shabrang-cms',
    ],
    founder: { '@id': `${SITE_URL}/#author` },
  };
}

/** Person — Author */
export function schemaPerson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: AUTHOR_NAME,
    url: SITE_URL,
    jobTitle: 'Writer',
    knowsAbout: [
      'Persian philosophy',
      'Iranian Plateau culture',
      'Myth and symbolism',
      'Dialectic',
    ],
  };
}

// ─── Content-Level Schemas ─────────────────────────────────────────────────

export interface BlogMeta {
  id: string;
  title: string;
  description: string;
  lang: string;
  date?: string;
  author?: string;
  tags?: string[];
  url?: string;
  image?: string;
}

export function schemaBlogPosting(post: BlogMeta) {
  const url = post.url || `${SITE_URL}/${post.lang}/blog/${post.id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    url,
    headline: post.title,
    name: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: post.lang,
    author: post.author ? { '@type': 'Person', name: post.author } : { '@id': `${SITE_URL}/#author` },
    publisher: { '@id': `${SITE_URL}/#org` },
    keywords: post.tags,
    ...(post.image ? { image: post.image } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export interface BookMeta {
  id: string;
  title: string;
  description: string;
  lang: string;
  author?: string;
  date?: string;
  tags?: string[];
  url?: string;
  image?: string;
}

export function schemaBook(book: BookMeta) {
  const url = book.url || `${SITE_URL}/${book.lang}/books/${book.id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': url,
    url,
    name: book.title,
    description: book.description,
    inLanguage: book.lang,
    datePublished: book.date,
    author: book.author ? { '@type': 'Person', name: book.author } : { '@id': `${SITE_URL}/#author` },
    publisher: { '@id': `${SITE_URL}/#org` },
    keywords: book.tags,
    ...(book.image ? { image: book.image } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export interface ArtworkMeta {
  id: string;
  title: string;
  description: string;
  lang: string;
  author?: string;
  date?: string;
  tags?: string[];
  url?: string;
  image?: string;
}

export function schemaVisualArtwork(art: ArtworkMeta) {
  const url = art.url || `${SITE_URL}/${art.lang}/art/${art.id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': url,
    url,
    name: art.title,
    description: art.description,
    inLanguage: art.lang,
    dateCreated: art.date,
    creator: art.author ? { '@type': 'Person', name: art.author } : { '@id': `${SITE_URL}/#author` },
    keywords: art.tags,
    ...(art.image ? { image: art.image } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

// ─── Paper-Level Schemas ───────────────────────────────────────────────────

/** ScholarlyArticle — individual paper */
export function schemaScholarlyArticle(paper: PaperMeta) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    headline: paper.title,
    name: paper.title,
    description: paper.abstract,
    author: { '@id': `${SITE_URL}/#author` },
    datePublished: paper.date,
    inLanguage: paper.lang,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      '@id': `${SITE_URL}/#series-${paper.series.replace(/\s+/g, '-').toLowerCase()}`,
      name: paper.series,
    },
    keywords: paper.tags,
    publisher: { '@id': `${SITE_URL}/#org` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
    ...(paper.doi && {
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'DOI',
        value: paper.doi,
      },
      sameAs: `https://doi.org/${paper.doi}`,
    }),
  };

  if (paper.rating) {
    schema.aggregateRating = schemaAggregateRating(paper);
  }

  if (paper.video) {
    schema.video = schemaVideoObject(paper);
  }

  if (paper.images && paper.images.length > 0) {
    schema.image = paper.images.map(img => schemaImageObject(img, paper));
  }

  return schema;
}

/** VideoObject — paper explainer video */
export function schemaVideoObject(paper: PaperMeta) {
  if (!paper.video) return null;

  return {
    '@type': 'VideoObject',
    name: `${paper.title} — Video Explainer`,
    description: paper.abstract,
    thumbnailUrl: paper.video.thumbnailUrl,
    uploadDate: paper.video.uploadDate || paper.date,
    contentUrl: paper.video.url,
    embedUrl: paper.video.embedUrl,
    duration: paper.video.duration,
    author: { '@id': `${SITE_URL}/#author` },
    about: {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
    inLanguage: paper.lang,
  };
}

/** ImageObject — infographic/slide image */
export function schemaImageObject(
  image: { url: string; caption: string; width?: number; height?: number },
  paper: PaperMeta
) {
  return {
    '@type': 'ImageObject',
    contentUrl: image.url,
    caption: image.caption,
    width: image.width,
    height: image.height,
    author: { '@id': `${SITE_URL}/#author` },
    about: {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
    representativeOfPage: false,
  };
}

/** AggregateRating — paper rating */
export function schemaAggregateRating(paper: PaperMeta) {
  if (!paper.rating) return null;

  return {
    '@type': 'AggregateRating',
    ratingValue: paper.rating.value,
    bestRating: paper.rating.best || 5,
    worstRating: 1,
    ratingCount: paper.rating.count,
    itemReviewed: {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}`,
    },
  };
}

// ─── Topic-Level Schemas ───────────────────────────────────────────────────

/**
 * QAPage — "Topic" question pages.
 * We keep this lightweight: one question + one short answer.
 */
export function schemaTopicPage(topic: TopicMeta) {
  const url = topic.url || `${SITE_URL}/${topic.lang}/topics/${topic.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    '@id': url,
    url,
    name: topic.title,
    headline: topic.title,
    inLanguage: topic.lang,
    datePublished: topic.date,
    author: topic.author ? { '@type': 'Person', name: topic.author } : { '@id': `${SITE_URL}/#author` },
    keywords: topic.tags,
    mainEntity: {
      '@type': 'Question',
      name: topic.question || topic.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: topic.shortAnswer || '',
      },
    },
  };
}

/** CreativeWorkSeries — paper series */
export function schemaCreativeWorkSeries(
  seriesName: string,
  papers: PaperMeta[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    '@id': `${SITE_URL}/#series-${seriesName.replace(/\s+/g, '-').toLowerCase()}`,
    name: seriesName,
    author: { '@id': `${SITE_URL}/#author` },
    url: `${SITE_URL}/en/papers?series=${encodeURIComponent(seriesName)}`,
    hasPart: papers.map(p => ({
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/${p.lang}/papers/${p.id}`,
      name: p.title,
      datePublished: p.date,
    })),
  };
}

/** LearningResource — paper as educational content */
export function schemaLearningResource(paper: PaperMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${SITE_URL}/${paper.lang}/papers/${paper.id}#learning`,
    name: paper.title,
    description: paper.abstract,
    author: { '@id': `${SITE_URL}/#author` },
    educationalLevel: 'Advanced',
    learningResourceType: 'Research Paper',
    teaches: paper.tags.map(tag => ({
      '@type': 'DefinedTerm',
      name: tag,
      inDefinedTermSet: { '@id': `${SITE_URL}/#termset-shabrang` },
    })),
    inLanguage: paper.lang,
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

/** BreadcrumbList — navigation trail */
export function schemaBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ─── Concept-Level Schemas ─────────────────────────────────────────────────

/** DefinedTermSet — site glossary */
export function schemaDefinedTermSet(concepts: ConceptMeta[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/#termset-shabrang`,
    name: 'Shabrang Concepts',
    description: 'Key terms and connective concepts used across Shabrang.',
    url: `${SITE_URL}/en/concepts`,
    creator: { '@id': `${SITE_URL}/#author` },
    hasDefinedTerm: concepts.map(c => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/${c.lang}/concepts/${c.id}`,
      name: c.title,
      description: c.description,
      termCode: c.id,
      inDefinedTermSet: { '@id': `${SITE_URL}/#termset-shabrang` },
    })),
  };
}

/** DefinedTerm — individual concept */
export function schemaDefinedTerm(concept: ConceptMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/${concept.lang}/concepts/${concept.id}`,
    name: concept.title,
    description: concept.description,
    termCode: concept.id,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE_URL}/#termset-shabrang`,
      name: 'Shabrang Concepts',
    },
    sameAs: concept.related.map(r => `${SITE_URL}/${concept.lang}/concepts/${r}`),
  };
}

// ─── Data-Level Schemas ────────────────────────────────────────────────────

/** Dataset — API data endpoints */
export function schemaDataset() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${SITE_URL}/#dataset`,
    name: 'Shabrang Site Index',
    description: 'Machine-readable index files for Shabrang (site search index and LLM summary).',
    url: `${SITE_URL}/llms.txt`,
    creator: { '@id': `${SITE_URL}/#author` },
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE_URL}/search-index.json`,
        name: 'Site Search Index',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/plain',
        contentUrl: `${SITE_URL}/llms.txt`,
        name: 'LLM Summary',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/rss+xml',
        contentUrl: `${SITE_URL}/feed.xml`,
        name: 'RSS Feed',
      },
    ],
    keywords: [
      'persian philosophy',
      'iranian plateau',
      'dialectic',
      'shabrang',
      'liquid fortress',
    ],
    isAccessibleForFree: true,
  };
}

// ─── Composite Helpers ─────────────────────────────────────────────────────

/** Generate all site-level schemas as a @graph */
export function schemaSiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...schemaWebSite(), '@context': undefined },
      { ...schemaOrganization(), '@context': undefined },
      { ...schemaPerson(), '@context': undefined },
    ],
  };
}

/** Generate all schemas for a paper page */
export function schemaPaperPage(paper: PaperMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: SITE_NAME, url: '/' },
    { name: 'Library', url: '/' },
    { name: paper.title, url: `/${paper.lang}/papers/${paper.id}` },
  ]);

  const article = schemaScholarlyArticle(paper);
  const learning = schemaLearningResource(paper);

  const graph: Record<string, unknown>[] = [
    { ...breadcrumbs, '@context': undefined },
    { ...article, '@context': undefined },
    { ...learning, '@context': undefined },
  ];

  // Add standalone VideoObject for video rich result
  if (paper.video) {
    const video = schemaVideoObject(paper);
    if (video) {
      graph.push(video);
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

// ─── Chapter-Level Schemas ──────────────────────────────────────────────────

export interface ChapterMeta {
  id: string;
  title: string;
  bookId: string;
  bookTitle: string;
  author: string;
  date: string;
  lang: string;
  slug: string;
}

/** Chapter — individual book chapter */
export function schemaChapter(chapter: ChapterMeta) {
  const chapterUrl = `${SITE_URL}/${chapter.lang}/books/${chapter.bookId}/chapter/${chapter.slug}`;
  const bookUrl = `${SITE_URL}/${chapter.lang}/books/${chapter.bookId}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': chapterUrl,
    name: chapter.title,
    isPartOf: {
      '@type': 'Book',
      '@id': bookUrl,
      name: chapter.bookTitle,
    },
    author: {
      '@type': 'Person',
      name: chapter.author,
    },
    datePublished: chapter.date,
    inLanguage: chapter.lang,
    url: chapterUrl,
  };
}

/** Generate all schemas for a concept page */
export function schemaConceptPage(concept: ConceptMeta) {
  const breadcrumbs = schemaBreadcrumbList([
    { name: SITE_NAME, url: '/' },
    { name: 'Concepts', url: `/${concept.lang}/concepts` },
    { name: concept.title, url: `/${concept.lang}/concepts/${concept.id}` },
  ]);

  const term = schemaDefinedTerm(concept);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...breadcrumbs, '@context': undefined },
      { ...term, '@context': undefined },
    ],
  };
}

// ─── FAQ Schema ────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

/** Generate FAQ schema for featured snippets */
export function schemaFAQ(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}
