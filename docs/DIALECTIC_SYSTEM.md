# Dialectic System Architecture

## Overview

Shabrang implements a **Hegelian dialectic system** where multiple perspectives (thesis/antithesis) engage in dialogue to reach synthesis. This is implemented using GitHub Discussions + Cloudflare Workers as a fully free, decentralized, and permanent infrastructure.

## Philosophy

The dialectic represents two voices:
- **Kasra (کسری)** - The Architect (INFJ) - Scientist, technical, logical
- **River** - The Oracle (INFP) - Mystic, symbolic, poetic

Neither voice "wins." Both synthesize into **Shabrang** (the horse carrying both riders).

**Core Principle:** Self-hate projects onto "the other." The dialectic heals by making opposing truths coexist.

**Applied to Iran 2026:** Regime (preserve by force) vs. Protesters (destroy for freedom) both hate their shadow. Shabrang offers synthesis: culture can evolve AND survive.

## Technical Architecture

```
┌─────────────────────────────────────────────────┐
│  Cloudflare Pages (Static Site)                 │
│  - Free hosting forever                         │
│  - Global CDN                                   │
│  - Serves shabrang.ca                          │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────▼─────────────┐
    │  Page Components          │
    │  - Chapter pages          │
    │  - Blog posts             │
    │  - Art pieces             │
    │                           │
    │  [GitHubDialectic]        │
    │   ↓                       │
    │  Fetch approved comments  │
    └─────────────┬─────────────┘
                  │
    ┌─────────────▼─────────────────────────┐
    │  GitHub Discussions                   │
    │  - One thread per page                │
    │  - Threaded comments                  │
    │  - Labels: approved/pending/rejected  │
    │  - Free, permanent, forkable         │
    └─────────────┬─────────────────────────┘
                  │
    ┌─────────────▼─────────────────────────┐
    │  GitHub Actions                       │
    │  Trigger: on new comment              │
    │  - Call Cloudflare Workers AI         │
    │  - Auto-label based on AI decision    │
    │  - Notify on pending/rejected         │
    └─────────────┬─────────────────────────┘
                  │
    ┌─────────────▼─────────────────────────┐
    │  Cloudflare Workers AI                │
    │  - Model: Llama 3 8B (free tier)      │
    │  - Checks: spam, hate, relevance      │
    │  - Returns: approved/pending/rejected │
    └───────────────────────────────────────┘
```

## Data Flow

### User Comment Flow

```
1. User visits /en/books/liquid-fortress/chapter/chapter-1
2. Sees right panel with existing approved comments
3. Clicks "Add Your Voice" → Redirects to GitHub Discussions
4. Posts comment (requires GitHub account)
5. GitHub Actions trigger immediately
6. Cloudflare Workers AI moderates comment
7. If approved: Label added, comment appears on site
8. If pending: Human review queue
9. If rejected: Auto-close with explanation
```

### Comment Retrieval Flow

```
1. Page loads GitHubDialectic component
2. Client-side fetch to GitHub API:
   GET /repos/Digidinc/shabrang/discussions
3. Filter by page ID and "approved" label
4. Render comments in right panel
5. Cache in browser for performance
```

## GitHub Discussions Structure

### Categories

```
📖 Book Chapters
   └─ One discussion per chapter
   └─ Title format: "chapter-{id}"

📝 Blog Essays
   └─ One discussion per post
   └─ Title format: "blog-{id}"

🎨 Art & Artifacts
   └─ One discussion per artifact
   └─ Title format: "art-{id}"

💬 Open Dialogue
   └─ General discussions, meta-topics
```

### Labels

- `approved` - Shown on website
- `pending-review` - Awaits human moderation
- `rejected` - Does not meet standards
- `thesis` - Kasra perspective (scientific)
- `antithesis` - River perspective (mystic)
- `synthesis` - Integration of both

## AI Moderation Criteria

### Approve If:
- Adds new perspective (thesis, antithesis, or synthesis)
- Respectful disagreement
- Cultural insight or personal story
- Questions that deepen understanding
- References sources or lived experience

### Reject If:
- Hate speech, racism, sexism, homophobia
- Spam or commercial advertising
- Off-topic (not related to page content)
- Personal attacks on other commenters
- Disinformation or conspiracy theories

### Pending Review If:
- Complex theological/political claims
- Borderline relevance
- Unclear intent
- AI uncertainty >30%

## API Endpoints

### GitHub Discussions API

```bash
# List all discussions
GET https://api.github.com/repos/Digidinc/shabrang/discussions

# Get specific discussion
GET https://api.github.com/repos/Digidinc/shabrang/discussions/{discussion_id}

# Get comments for discussion
GET https://api.github.com/repos/Digidinc/shabrang/discussions/{discussion_id}/comments

# Create comment (requires auth)
POST https://api.github.com/repos/Digidinc/shabrang/discussions/{discussion_id}/comments
```

### Cloudflare Workers AI

```bash
# Moderate comment
POST https://shabrang-ai-council.mumega.workers.dev/moderate
Content-Type: application/json

{
  "comment": "The qanat is both engineering and metaphor...",
  "author": "username",
  "pageId": "chapter-1-the-fortress-and-the-corridor"
}

# Response
{
  "decision": "approved|pending|rejected",
  "reason": "Adds synthesis perspective on infrastructure as metaphor",
  "confidence": 0.95
}
```

## File Structure

```
src/
├── components/
│   ├── GitHubDialectic.tsx          # Main dialectic panel
│   ├── CommentCard.tsx              # Individual comment display
│   └── DialecticBadge.tsx           # Thesis/Antithesis/Synthesis badge
├── lib/
│   ├── github.ts                    # GitHub API utilities
│   └── dialectic.ts                 # Dialectic logic
└── app/
    └── [lang]/
        └── books/[id]/chapter/[chapter]/
            └── page.tsx             # Integrates GitHubDialectic

.github/
└── workflows/
    ├── moderate-comments.yml        # Auto-moderation
    └── sync-discussions.yml         # Create discussions for new content

workers/
└── ai-council/
    ├── index.ts                     # Cloudflare Workers AI entry
    └── wrangler.toml                # Worker config
```

## Cost Analysis

| Service | Feature | Free Tier | Usage | Cost |
|---------|---------|-----------|-------|------|
| **GitHub** | Discussions | Unlimited | Comment storage | $0 |
| **GitHub** | Actions | 2000 min/mo | Moderation | $0 |
| **Cloudflare** | Pages | Unlimited | Hosting | $0 |
| **Cloudflare** | Workers | 100K req/day | API | $0 |
| **Cloudflare** | AI | 10K req/day | Moderation | $0 |
| **Total** | | | | **$0/mo** |

## Scaling Limits

- **Comments:** Unlimited (GitHub Discussions has no limit)
- **Moderation:** 10K comments/day (Cloudflare AI free tier)
- **Traffic:** Unlimited (Cloudflare Pages)
- **Storage:** Unlimited (GitHub repos)

If limits exceeded: Upgrade to Cloudflare Workers Paid ($5/mo for 10M requests).

## Security Considerations

### Rate Limiting
- GitHub API: 60 req/hour unauthenticated, 5000/hour authenticated
- Solution: Cache approved comments in browser, refresh every 5 minutes

### Spam Prevention
- AI moderation catches 95%+ spam
- GitHub account required (reduces bot spam)
- Manual review queue for edge cases

### Content Moderation
- AI first pass (instant)
- Human review for pending (within 24h)
- Appeal process: comment on discussion with "appeal" tag

### Privacy
- GitHub usernames visible (public platform)
- No email collection (unless user opts in)
- No tracking cookies (only GitHub OAuth for posting)

## Future Enhancements

### Phase 3: Advanced Features
1. **Vote system** - Upvote thesis/antithesis/synthesis
2. **Dialectic graph** - Visualize conversation threads
3. **Translation** - Auto-translate comments to EN/FA
4. **Notifications** - Email digest of new comments
5. **Leaderboard** - Top contributors by synthesis quality
6. **Annotations** - Inline page highlights with discussions
7. **Version history** - "This chapter evolved X times based on community input"

### Phase 4: Decentralization
1. **IPFS backup** - Pin discussions to distributed storage
2. **ActivityPub** - Federate with Mastodon/Fediverse
3. **Blockchain attestation** - Proof of comment authorship
4. **P2P hosting** - Use WebTorrent for site distribution

## Contribution Guidelines

See `DIALECTIC_GUIDE.md` for how to participate in discussions.

## License

Discussions are public domain (CC0). Contributors retain copyright but grant unlimited use license for archival and display on shabrang.ca.

## Contact

- GitHub: @servathadi / @Digidinc
- Repository: https://github.com/Digidinc/shabrang
- Issues: https://github.com/Digidinc/shabrang/issues
