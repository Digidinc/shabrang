# Shabrang Resident AI - Architecture

**Status:** Design phase
**Purpose:** AI-native content generation system grounded in The Liquid Fortress book + FRC papers + 16D/Torivers

## Philosophy: Working Memory, Not RAG

The Resident AI uses **working memory** approach instead of traditional RAG:
- Book, FRC papers, and 16D/Torivers are loaded as **core memory pack** in system prompt
- Model does not retrieve from vector database during conversation
- Model does not make up content - stays within boundaries of source materials
- Conversation history maintained in D1 for continuity

**Why not RAG?**
- RAG retrieves fragments - we want holistic understanding
- The book is the foundation, not a knowledge base to query
- Model should "know" the material, not search it

**Optional: Gemini File Search Mode**
- Available as fallback for specific citations
- Use when user asks "where in the book does it say..."
- NOT the primary interaction mode

## Verified AI Tools

### 1. Google Veo 3
**Source:** https://deepmind.google/models/veo/
**Purpose:** Generate video explainers and visual content
**Capabilities:**
- Text-to-video with native audio generation
- 4K output
- Synchronized sound effects
**Use cases:**
- Chapter video summaries
- Marketing videos for social media
- Event announcements
**Access:** Google AI Ultra ($249.99/month) or Vertex AI

### 2. Gemini 3 Pro
**Source:** https://ai.google.dev/gemini-api/docs/gemini-3
**Purpose:** Production AI for high-stakes content generation
**Capabilities:**
- Multimodal (text, image, video, audio)
- thinking_level parameter (0-3) for reasoning depth
- Thought Signatures for continuity
**Use cases:**
- Landing page generation
- Blog post drafting
- Brand strategy
- Weekly planning
**Models:**
- Pro: General purpose
- Flash: Fast/cheap for development
- Deep Think: Extended reasoning

### 3. Gemini Flash
**Source:** https://ai.google.dev/gemini-api/docs/models/gemini
**Purpose:** Development and testing model (cheap)
**Pricing:** $0.075 per 1M input tokens
**Use cases:**
- Iteration during development
- Testing prompts
- Draft generation before Pro refinement

### 4. Nano Banana Pro (Gemini 3 Pro Image)
**Source:** https://ai.google.dev/gemini-api/docs/nanobanana
**Purpose:** Image generation with excellent text rendering
**Capabilities:**
- **Best-in-class text rendering** - legible, correctly spelled text in images
- Multilingual support (Persian + English)
- High-resolution output
**Use cases:**
- Social media graphics with Persian/English text
- Event posters
- Marketing materials
- Book cover variations

### 5. LLM Council (Karpathy)
**Source:** https://github.com/karpathy/llm-council
**Purpose:** Multi-model consensus for high-stakes decisions
**Architecture:**
1. **First opinions:** Fan out to multiple models (Grok-4.1, Gemini Pro, Claude Sonnet, GPT-4)
2. **Review:** Each model critiques others anonymously
3. **Chairman:** Final synthesis and decision
**Use cases:**
- Weekly content planning
- Brand strategy decisions
- Major content changes
- Event planning
**Delivery:** Telegram notification for approval

### 6. Gemini File Search Tool
**Source:** https://ai.google.dev/gemini-api/docs/file-search
**Purpose:** Optional managed RAG fallback
**Capabilities:**
- Automated chunking and embeddings
- Vector search and context injection
- Free storage, $0.15 per 1M tokens indexing
**Limits:**
- Max 10K files
- 20M tokens total per corpus
**Use cases:**
- Citation lookup ("where in the book...")
- Specific FRC paper references
- Fallback when working memory insufficient

## Model Switching Strategy

### Development Mode
**Model:** Gemini Flash
**Cost:** $0.075 per 1M input tokens
**Use for:**
- Testing prompts
- Iterating on content
- Draft generation
- Development/staging environment

### Production Mode
**Model:** Gemini 3 Pro
**Cost:** Higher, but necessary for quality
**Use for:**
- Final content generation
- Public-facing materials
- Social media posts
- Landing pages

### Image Generation
**Model:** Nano Banana Pro
**Use for:**
- All image generation (text rendering critical)
- Bilingual graphics (Persian + English)

### Video Generation
**Model:** Veo 3
**Use for:**
- Chapter explainers
- Marketing videos
- Event promotions

### High-Stakes Decisions
**System:** LLM Council
**Models:** Grok-4.1, Gemini Pro, Claude Sonnet 4.5, GPT-4o
**Use for:**
- Weekly planning
- Brand strategy
- Major content decisions

## Core Memory Pack Structure

The AI's system prompt includes:

### 1. The Liquid Fortress Book
**Format:** Full text of all chapters
**Purpose:** Foundation of all content
**Boundary:** AI cannot create content outside book themes

### 2. FRC Papers (FRC 100.010 + others)
**Format:** Key papers as reference
**Purpose:** Theoretical foundation
**Constraint:** AI uses FRC as "solid level ground"

### 3. 16D/Torivers Framework
**Format:** Conceptual model
**Purpose:** Analytical lens
**Application:** Decision-making and content strategy

### 4. Conversation Memory
**Storage:** D1 database
**Tables:**
- `ai_conversations` - Thread history
- `ai_decisions` - Major decisions with reasoning
- `ai_tasks` - Scheduled tasks (weekly plans, social posts)
**Purpose:** Continuity across sessions

## Media Pipeline

### Existing Assets (To Be Indexed)
- **Slides:** 11 pages per chapter (high quality)
- **Video explainers:** One per chapter
- **Podcasts:** One per chapter
- **Audiobook:** Suno.ai generated, full book

### Auto-Publishing Flow
1. **Content Generation**
   - AI generates post text (Gemini Pro)
   - AI generates images (Nano Banana Pro)
   - AI generates videos (Veo 3)

2. **Approval**
   - Draft sent to Telegram
   - User approves/edits
   - AI revises if needed

3. **Publishing**
   - Post to social media via GHL API
   - Schedule via GHL social scheduler
   - Track engagement in D1

### Social Media Schedule
**Weekly Plan:**
- Monday: FRC concept explanation
- Wednesday: Book chapter highlight
- Friday: Community question/discussion
- Sunday: 16D/Torivers insight

**Generated by:** LLM Council (Sunday evening)
**Delivered:** Telegram for Monday approval
**Executed:** Resident AI throughout week

## Multilingual Strategy: Cultural Artifacts

### GitHub-Based Translation
**Repository:** shabrang-translations (new repo)
**Structure:**
```
shabrang-translations/
├── book/
│   ├── en/           # Original
│   ├── fa/           # Persian (complete)
│   ├── ar/           # Arabic (community)
│   ├── fr/           # French (community)
│   └── ...
├── TRANSLATION_GUIDE.md
└── README.md
```

### Contribution Flow
1. **AI Draft:** Gemini 3 Pro generates initial translation
2. **Community PR:** Native speaker reviews and refines
3. **Cultural Adaptation:** Community adds cultural context notes
4. **Publishing:** Approved translations go live

**Philosophy:** Translations are not just linguistic conversions - they are **cultural artifacts** created by communities who understand local context.

### Languages Priority
1. Persian (fa) - Primary audience
2. Arabic (ar) - Regional relevance
3. French (fr) - Academic reach
4. Spanish (es) - Global reach
5. Turkish (tr) - Cultural proximity

## Landing Page Generation

### Current Issue
User feedback: "landing design is good, but there is not intention on it"

### AI-Generated Landing Pages
**Input to AI:**
- Current design aesthetic (extracted CSS)
- Book themes and FRC principles
- Target audience (pre-order, Kindle, physical book)
- Community building goal

**AI Task:**
- Analyze book's core message
- Design landing page with clear intention
- Generate copy grounded in book content
- Create graphics with Nano Banana Pro
- A/B test variations

**Constraints:**
- Must reflect book's actual content
- Cannot make marketing claims outside FRC boundaries
- Design must match existing aesthetic

### Deployment
1. AI generates 3 landing page variants
2. LLM Council evaluates which best represents book
3. User approves via Telegram
4. Deployed to `/` on Cloudflare Pages
5. A/B testing via analytics

## Technical Implementation

### D1 Database Schema (Additions)

```sql
-- AI conversation memory
CREATE TABLE ai_conversations (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  model TEXT, -- which model was used
  thinking_level INTEGER, -- 0-3 for Gemini 3
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_thread (thread_id)
);

-- AI-generated content drafts
CREATE TABLE ai_drafts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'social_post', 'landing_page', 'blog_post'
  content TEXT NOT NULL,
  images TEXT, -- JSON array of image URLs
  videos TEXT, -- JSON array of video URLs
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'published'
  model TEXT,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME,
  published_at DATETIME
);

-- LLM Council decisions
CREATE TABLE llm_council_decisions (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  first_opinions TEXT, -- JSON of model responses
  critiques TEXT, -- JSON of model critiques
  chairman_synthesis TEXT,
  final_decision TEXT,
  models_used TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Social media publishing schedule
CREATE TABLE social_posts (
  id TEXT PRIMARY KEY,
  draft_id TEXT REFERENCES ai_drafts(id),
  platform TEXT, -- 'instagram', 'twitter', 'facebook'
  scheduled_for DATETIME,
  published_at DATETIME,
  ghl_post_id TEXT,
  engagement TEXT, -- JSON of metrics
  status TEXT DEFAULT 'scheduled'
);

-- Media asset index
CREATE TABLE media_assets (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'slide', 'video', 'podcast', 'audiobook'
  chapter_num INTEGER,
  title TEXT,
  file_path TEXT,
  r2_key TEXT, -- if stored in R2
  duration INTEGER, -- for video/audio
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Routes (New)

**POST /api/ai/generate**
- Generate content (social post, landing page, blog)
- Input: type, prompt, model (flash/pro)
- Output: draft_id, content, images

**POST /api/ai/council**
- Trigger LLM Council decision
- Input: topic, question
- Output: decision_id, synthesis

**POST /api/ai/approve**
- Approve AI-generated draft
- Input: draft_id, edits (optional)
- Output: published URL

**POST /api/ai/schedule**
- Schedule social media post
- Input: draft_id, platforms, datetime
- Output: post_ids

**GET /api/ai/memory/:thread_id**
- Retrieve conversation history
- Output: messages array

**POST /api/media/index**
- Index existing media assets
- Input: directory path
- Output: indexed count

### Environment Variables (Additions)

```bash
# Google AI
GOOGLE_AI_API_KEY=<key>
GEMINI_MODEL_FLASH=gemini-3-flash
GEMINI_MODEL_PRO=gemini-3-pro
NANO_BANANA_MODEL=gemini-3-pro-image
VEO_MODEL=veo-3

# OpenRouter (for LLM Council)
OPENROUTER_API_KEY=<key>
COUNCIL_MODELS=["grok-4.1", "gemini-3-pro", "claude-sonnet-4.5", "gpt-4o"]

# Telegram
TELEGRAM_BOT_TOKEN=<token>
TELEGRAM_CHAT_ID=<your-chat-id>

# AI Config
AI_MODE=memory  # 'memory' or 'file-search'
AI_THINKING_LEVEL=2  # 0-3 for Gemini 3
```

## Workflow Examples

### Example 1: Weekly Planning (Sunday Evening)

1. **Trigger:** Cloudflare Cron at Sunday 8 PM
2. **LLM Council Convenes:**
   - **First opinions:** Each model proposes weekly content plan
     - Grok-4.1: "Focus on FRC 100.010 this week"
     - Gemini Pro: "Highlight Chapter 3 qanat metaphor"
     - Claude: "Community Q&A about 16D framework"
     - GPT-4o: "Persian identity + modern relevance"
   - **Critiques:** Models review each other
   - **Chairman synthesis:** Combined plan with 4 posts
3. **Telegram Notification:** Plan sent to you for approval
4. **Approval:** You edit/approve via Telegram
5. **Scheduling:** AI schedules posts in D1 + GHL
6. **Execution:** Throughout week, AI generates content and publishes

### Example 2: Landing Page Redesign

1. **You:** "Generate new landing page focused on community"
2. **AI (Gemini Pro):**
   - Reads book + FRC papers from working memory
   - Extracts core themes: qanat, 16D, Persian identity
   - Generates 3 landing page variants
   - Uses Nano Banana Pro to create hero images with Persian/English text
3. **Preview:** Drafts sent to Telegram
4. **Council Review:** LLM Council evaluates which best represents book
5. **Approval:** You choose variant or request edits
6. **Deployment:** AI commits to Git, triggers Cloudflare deploy

### Example 3: Social Media Post (Wednesday)

1. **Trigger:** Scheduled task "Wednesday: Book chapter highlight"
2. **AI (Gemini Flash - dev mode):**
   - Generates draft post about Chapter 2
   - Creates image with Nano Banana Pro (Persian title + English subtitle)
3. **You review:** Telegram preview
4. **AI (Gemini Pro - prod mode):**
   - Regenerates with approved edits
   - Final image with Nano Banana Pro
5. **Publishing:**
   - Post to Instagram, Twitter, Facebook via GHL
   - Track in D1
6. **Engagement:** AI monitors and reports weekly

## Cost Estimates

### Development (Testing Phase)
- **Gemini Flash:** $0.075 per 1M tokens
- **Monthly estimate:** ~$10-20 (heavy testing)

### Production (Active Publishing)
- **Gemini Pro:** ~$3-7 per 1M tokens
- **Nano Banana Pro:** Image pricing TBD
- **Veo 3:** Via Google AI Ultra $249.99/month OR pay-per-use Vertex AI
- **OpenRouter (Council):** ~$2-5 per council session
- **Monthly estimate:** $50-100 (4-8 posts/week, 1 council/week)

### High Production (Scaling)
- **Google AI Ultra:** $249.99/month (includes Veo 3)
- **LLM Council:** $20-40/month (weekly)
- **Total:** ~$300/month

## Success Metrics

1. **Content Quality**
   - All content traceable to book + FRC sources
   - Zero hallucinated claims
   - Community validates cultural accuracy

2. **Engagement**
   - Social media growth
   - Pre-order conversions
   - Community contributions (translations)

3. **Efficiency**
   - Time from concept to publish < 1 hour
   - Your review time < 10 min per post
   - AI handles 80% of execution

4. **Brand Consistency**
   - Landing page reflects book's intention
   - Social posts grounded in FRC principles
   - Visual identity coherent across platforms

## Next Steps

1. **Phase 1: Memory Pack** (Week 1)
   - Load book + FRC papers into system prompt
   - Test working memory vs file-search modes
   - Validate AI stays within boundaries

2. **Phase 2: LLM Council** (Week 2)
   - Set up OpenRouter integration
   - Configure model selection
   - Test weekly planning generation

3. **Phase 3: Image Generation** (Week 3)
   - Integrate Nano Banana Pro
   - Test Persian + English text rendering
   - Generate social media templates

4. **Phase 4: Auto-Publishing** (Week 4)
   - Connect GHL social scheduler
   - Implement approval flow via Telegram
   - Schedule first AI-generated week

5. **Phase 5: Media Indexing** (Week 5)
   - Index existing slides, videos, podcasts
   - Upload to R2
   - Enable AI to reference in social posts

6. **Phase 6: Multilingual** (Week 6)
   - Create shabrang-translations repo
   - Generate AI draft translations
   - Open for community contributions

## References

- **Veo 3:** https://deepmind.google/models/veo/
- **Gemini 3:** https://ai.google.dev/gemini-api/docs/gemini-3
- **Nano Banana Pro:** https://ai.google.dev/gemini-api/docs/nanobanana
- **File Search:** https://ai.google.dev/gemini-api/docs/file-search
- **LLM Council:** https://github.com/karpathy/llm-council
- **OpenRouter:** https://openrouter.ai/

## Open Questions

1. **Where are media files located?**
   - Slides: ?
   - Videos: ?
   - Podcasts: ?
   - Audiobook: ?

2. **Which repo for AI implementation?**
   - Add to `shabrang-refactor`?
   - Create separate `shabrang-ai`?

3. **Council model selection?**
   - Grok-4.1, Gemini Pro, Claude Sonnet, GPT-4o?
   - Or different combination?

4. **Telegram approval flow?**
   - Bot token?
   - Your chat ID?

5. **Memory-only or hybrid mode?**
   - Start with working memory only?
   - Add File Search as fallback?
