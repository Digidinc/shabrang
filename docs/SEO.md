# SEO Strategy & Implementation

## Overview

This document outlines the SEO strategy, current implementation, and ongoing optimization for Shabrang CMS.

**Last Updated:** 2026-02-01
**SEO Health Score:** 85/100 (Excellent)
**Total Blog Posts:** 61
**Tag Archive Pages:** 381

---

## Current SEO Implementation

### ✅ Technical SEO (Completed)

#### Crawlability & Indexation
- **robots.txt**: Configured at `/public/robots.txt`
  - Allows all search engines (User-agent: *)
  - Allows AI/LLM crawlers (GPTBot, ChatGPT-User, Google-Extended, Claude-Web)
  - References sitemap: `https://shabrang.ca/sitemap.xml`
  - Links to LLM discovery: `https://shabrang.ca/llms.txt`

- **XML Sitemap**: Generated via `src/app/sitemap.ts`
  - Auto-generated from content files
  - Includes all blog posts, topics, book chapters
  - Properly formatted for search engines

- **RSS Feed**: `/feed.xml`
  - Static file generated during build via `scripts/generate-rss.ts`
  - Contains 50 most recent blog posts
  - Proper escape handling for XML
  - Linked in site header and layout

#### Site Security & Performance
- **HTTPS**: Entire site runs on HTTPS
- **Canonical URLs**: Implemented in metadata generation
- **Alternate Language Tags**: Configured for en/fa bilingual support

---

### ✅ On-Page SEO (Completed)

#### Metadata Coverage
- **Title Tags**:
  - 61/61 posts have unique titles (100%)
  - Average length: 45 characters (optimal: 50-60)
  - Longest: 56 characters
  - Keywords naturally integrated

- **Meta Descriptions**:
  - 61/61 posts have unique abstracts (100%)
  - Length: 85-160 characters (optimal: 150-160)
  - All under 160 character limit
  - Clear value propositions with keywords

- **Heading Structure**:
  - Single H1 per page (from frontmatter title)
  - Logical H2/H3 hierarchy
  - Semantic HTML structure

#### Image Optimization
- **Alt Text**: All images have descriptive alt attributes
- **Sources**: Mix of local (`/images/`) and external (Wikipedia) images
- **Format**: Currently PNG/JPG (WebP conversion pending)

---

### ✅ Structured Data (Completed)

#### Implemented Schemas (src/lib/schema.ts)

1. **Site-Level Schemas**:
   - WebSite with SearchAction
   - Organization (Fractal Resonance)
   - Person (Hadi Servat with ORCID)
   - ResearchProject (FRC framework)
   - Dataset (research data APIs)

2. **Page-Level Schemas**:
   - ScholarlyArticle (blog posts)
   - BreadcrumbList (navigation hierarchy)
   - LearningResource (educational content)
   - DefinedTerm (glossary concepts)

3. **FAQ Schema** (NEW - 2026-02-01):
   - FAQPage schema for featured snippets
   - Implemented in `schemaFAQ()` function
   - Currently used on: `taarof-game-theory` post
   - Format:
     ```yaml
     faqs:
       - question: "What is Taarof?"
         answer: "..."
     ```

---

### ✅ Content Quality

#### E-E-A-T Signals: Strong

**Experience**:
- Original perspectives on Persian cultural artifacts
- Deep historical knowledge demonstrated
- Unique "Liquid Fortress" framework

**Expertise**:
- Author credentials (Kay Hermes, Kasra/River personas)
- Cross-referencing with wikilinks shows depth
- Technical and cultural expertise

**Authoritativeness**:
- Published book (The Liquid Fortress on Amazon)
- Consistent voice and methodology
- Academic approach with references

**Trustworthiness**:
- HTTPS secure site
- Clear about/contact pages
- Transparent licensing (CC BY-NC-ND 4.0)

#### Content Depth
- Comprehensive topic coverage (3,000 years of Persian history)
- Unique analytical angles (qanat as decentralized grid, Simurgh as swarm intelligence)
- Better depth than typical blog posts
- Internal knowledge graph via wikilinks

---

## 🎯 SEO Roadmap (In Progress)

### Priority 1: Featured Snippets (Q1 2026)

**Goal**: Target featured snippets for high-volume keywords

**Implementation**:
- [x] Add FAQ schema support (`schemaFAQ()` function)
- [x] Implement FAQ rendering in blog posts
- [x] Add FAQs to Taarof post (3 questions)
- [ ] Add FAQs to 9 more high-traffic posts:
  - adab-social-handshake (What is Adab?)
  - qanats-decentralized-grid (How do qanats work?)
  - shahnameh-civilizational-hard-drive (What is Shahnameh?)
  - simurgh-swarm-intelligence (What does Simurgh represent?)
  - persian-rug-quantum-nft (Why are Persian rugs valuable?)
  - nowruz-biological-pulse (When is Nowruz?)
  - fana-noise-removal (What is Fana in Sufism?)
  - avicenna-cpu-logic (Who was Avicenna?)
  - miniature-painting-high-res-soul (What are Persian miniatures?)

**Expected Impact**:
- 20-30% increase in organic traffic from featured snippets
- Higher CTR on search results pages

---

### Priority 2: Social Sharing (Q1 2026)

**Goal**: Increase social media referral traffic

**Implementation**:
- [ ] Create Open Graph images (1200x630) for top 20 posts
- [ ] Add `og:image` to metadata generation
- [ ] Design template for OG images (brand colors, logo, post title)
- [ ] Generate images using automated tool or manual design

**Expected Impact**:
- 3-5x increase in social sharing CTR
- Improved brand recognition on social platforms

---

### Priority 3: Content Clusters (Q1 2026)

**Goal**: Improve internal link structure and topical authority

**Implementation**:
- [x] Related Posts component (shows 3 related posts based on tags)
- [x] Featured Sidebar (shows 5 essential reading posts)
- [ ] Create topic hub pages:
  - "Persian Engineering & Architecture"
  - "Persian Philosophy & Spirituality"
  - "Persian Literature & Poetry"
  - "Persian Social Customs"
- [ ] Add "Part of series" metadata to related posts
- [ ] Systematic internal linking between cluster posts

**Expected Impact**:
- 15-20% increase in pages per session
- Better PageRank distribution
- Improved rankings for cluster head terms

---

### Priority 4: Image Optimization (Q2 2026)

**Goal**: Improve Core Web Vitals scores

**Implementation**:
- [ ] Convert images to WebP format
- [ ] Add explicit width/height attributes
- [ ] Implement responsive images (srcset)
- [ ] Add image lazy loading (below fold)
- [ ] Compress images (target <100KB)

**Expected Impact**:
- Improved LCP (Largest Contentful Paint)
- Better CLS (Cumulative Layout Shift)
- Faster page load times

---

### Priority 5: Pillar Content (Q2 2026)

**Goal**: Rank for broader, higher-volume keywords

**Implementation**:
- [ ] Create comprehensive guides (3,000-5,000 words):
  - "Complete Guide to Persian Cultural Architecture"
  - "Understanding the Liquid Fortress Framework"
  - "Persian Philosophy: A 3,000-Year Timeline"
- [ ] Link from relevant blog posts to pillar pages
- [ ] Update pillar pages quarterly with new insights

**Expected Impact**:
- Rank for competitive head terms
- 30-40% increase in organic traffic
- Establish topical authority

---

## 📊 SEO Metrics & Tracking

### Key Performance Indicators

**Organic Traffic**:
- Baseline: TBD (install Google Analytics)
- Target: 10,000 monthly organic visits by Q4 2026

**Keyword Rankings**:
- Track top 20 target keywords
- Monitor featured snippet acquisition
- Target: 5+ featured snippets by Q2 2026

**Engagement Metrics**:
- Average time on page: Target 3+ minutes
- Pages per session: Target 2.5+
- Bounce rate: Target <60%

### Tools & Resources

**Free Tools** (Currently Used):
- Google Search Console (to be configured)
- Google PageSpeed Insights
- Schema.org Validator

**Recommended Tools** (Future):
- Ahrefs or Semrush (keyword research, backlink tracking)
- Screaming Frog (technical audits)
- Google Analytics 4 (traffic analysis)

---

## Content Strategy Skills

### Installed Skills (2026-02-01)

The following content optimization skills are available in `.claude/skills/`:

1. **seo-audit.md** (394 lines)
   - Comprehensive SEO auditing framework
   - Technical, on-page, and content quality checks
   - Use when auditing pages or diagnosing SEO issues

2. **copywriting.md** (251 lines)
   - Marketing copy optimization
   - Headlines, CTAs, page sections
   - Use when writing/improving marketing copy

3. **marketing-psychology.md** (454 lines)
   - 70+ mental models for engagement
   - Behavioral science principles
   - Use when applying psychology to content

4. **brainstorming.md** (54 lines)
   - Idea refinement workflows
   - Design exploration
   - Use before creating new features/content

5. **find-skills.md** (133 lines)
   - Skill discovery tool
   - Use when looking for additional capabilities

---

## Implementation Notes

### Adding FAQs to Blog Posts

1. Add `faqs` array to frontmatter:
   ```yaml
   ---
   id: post-id
   title: "Post Title"
   faqs:
     - question: "Question here?"
       answer: "Answer here"
     - question: "Another question?"
       answer: "Another answer"
   ---
   ```

2. FAQ schema automatically renders if `faqs` array exists
3. Test with Google Rich Results Test

### Creating Open Graph Images

**Template Specifications**:
- Size: 1200x630 pixels
- Format: PNG or JPG
- File size: <300KB
- Include: Logo, post title, brand colors

**Naming Convention**: `/public/images/og/[post-id].jpg`

**Implementation**:
```typescript
// In generateMetadata()
openGraph: {
  images: [`/images/og/${fm.id}.jpg`],
  // ... other OG tags
}
```

---

## SEO Audit History

### 2026-02-01: Initial Comprehensive Audit

**Findings**:
- Overall health: 85/100 (Excellent)
- Technical SEO: ✅ All checks passing
- On-page SEO: ✅ 100% metadata coverage
- Content quality: ✅ Strong E-E-A-T signals
- Opportunities: FAQ schema, OG images, content clusters

**Actions Taken**:
1. Added FAQ schema support
2. Implemented FAQs on Taarof post
3. Documented SEO strategy
4. Created improvement roadmap

---

## References

- Google Search Central: https://developers.google.com/search
- Schema.org Documentation: https://schema.org/
- Core Web Vitals: https://web.dev/vitals/
- E-E-A-T Guidelines: https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf
