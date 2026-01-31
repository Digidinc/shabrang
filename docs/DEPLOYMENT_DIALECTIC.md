# Dialectic System Deployment Guide

Complete deployment instructions for the Shabrang dialectic commenting system.

## Prerequisites

- GitHub account with admin access to `Digidinc/shabrang`
- Cloudflare account (free tier works)
- Node.js 18+ and npm installed
- `wrangler` CLI (`npm install -g wrangler`)
- `gh` CLI (GitHub CLI)

## Phase 1: GitHub Setup (Already Complete ✅)

### 1.1 Enable GitHub Discussions

Already enabled at: https://github.com/Digidinc/shabrang/discussions

### 1.2 Create Labels

Already created via `gh api`:

```bash
# Status labels
gh api repos/Digidinc/shabrang/labels -X POST -f name="approved" -f description="Comment approved, shown on website" -f color="0e8a16"
gh api repos/Digidinc/shabrang/labels -X POST -f name="pending-review" -f description="Awaits human moderation" -f color="fbca04"
gh api repos/Digidinc/shabrang/labels -X POST -f name="rejected" -f description="Does not meet standards" -f color="d73a4a"

# Dialectic labels
gh api repos/Digidinc/shabrang/labels -X POST -f name="thesis" -f description="Kasra perspective (scientific)" -f color="2D5A6B"
gh api repos/Digidinc/shabrang/labels -X POST -f name="antithesis" -f description="River perspective (mystic)" -f color="C9A227"
gh api repos/Digidinc/shabrang/labels -X POST -f name="synthesis" -f description="Integration of both perspectives" -f color="8B3535"
```

✅ **Status:** Complete

### 1.3 Create Discussion Categories

Visit: https://github.com/Digidinc/shabrang/discussions/categories

Create these categories:

- **📖 Book Chapters** - Discussion for book chapters
- **📝 Blog Essays** - Discussion for blog posts
- **🎨 Art & Artifacts** - Discussion for imaginal gallery
- **💬 Open Dialogue** - General meta-discussions

## Phase 2: Deploy Cloudflare Worker

### 2.1 Install Dependencies

```bash
cd workers/ai-council
npm install
```

### 2.2 Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser to authenticate.

### 2.3 Deploy Worker

```bash
npm run deploy
```

Output:
```
✨ Deployed shabrang-ai-council
   https://shabrang-ai-council.<your-subdomain>.workers.dev
```

Copy this URL - you'll need it for GitHub Actions.

### 2.4 Set Secrets

Create a GitHub Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (full control of private repositories)
   - `write:discussion` (write access to discussions)
4. Copy the token

Set it as a Cloudflare secret:

```bash
npx wrangler secret put GITHUB_TOKEN
# Paste your token when prompted
```

### 2.5 Test Worker

```bash
# Start local dev server
npm run dev

# In another terminal, test with curl
curl -X POST http://localhost:8787/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "The qanat is both engineering and metaphor.",
    "author": "testuser",
    "pageId": "chapter-1"
  }'
```

Expected response:
```json
{
  "decision": "approved",
  "reason": "Comment provides synthesis perspective",
  "confidence": 0.92,
  "suggestedLabels": ["approved", "synthesis"]
}
```

✅ **Test passed?** Continue to Phase 3.

## Phase 3: Configure GitHub Actions

### 3.1 Set Repository Secret

1. Go to https://github.com/Digidinc/shabrang/settings/secrets/actions
2. Click "New repository secret"
3. Name: `AI_COUNCIL_URL`
4. Value: `https://shabrang-ai-council.<your-subdomain>.workers.dev`
5. Click "Add secret"

### 3.2 Verify Workflow File

The workflow file should already be committed at:
```
.github/workflows/moderate-comments.yml
```

To verify:

```bash
cat .github/workflows/moderate-comments.yml
```

### 3.3 Enable GitHub Actions

1. Go to https://github.com/Digidinc/shabrang/settings/actions
2. Under "Actions permissions", select "Allow all actions and reusable workflows"
3. Under "Workflow permissions", select "Read and write permissions"
4. Click "Save"

### 3.4 Test End-to-End

1. Go to https://github.com/Digidinc/shabrang/discussions
2. Create a new discussion with title: `chapter-test`
3. Post a comment: "This is a test comment for the dialectic system."
4. Watch the Actions tab: https://github.com/Digidinc/shabrang/actions

Expected:
- Workflow runs automatically
- AI Council moderates comment
- Label added (approved/pending/rejected)
- If pending/rejected, moderation comment posted

✅ **Test passed?** Continue to Phase 4.

## Phase 4: Deploy Website

### 4.1 Build Static Site

```bash
npm run build
```

Verify no errors.

### 4.2 Deploy to Cloudflare Pages

The site auto-deploys on push to `main` via Cloudflare Pages integration.

To manually deploy:

1. Go to https://dash.cloudflare.com/ → Pages
2. Select "shabrang-cms" project
3. Click "Create deployment"
4. Select branch: `main`
5. Wait for build to complete

### 4.3 Verify Dialectic Panel

Visit any chapter page:
```
https://shabrang.ca/en/books/liquid-fortress/chapter/chapter-1-the-fortress-and-the-corridor
```

Check:
- ✅ Right panel shows "The Dialectic" section
- ✅ Shows "No voices yet" if no comments
- ✅ "Add Your Voice" button links to GitHub Discussions
- ✅ Guide link goes to DIALECTIC_GUIDE.md

### 4.4 Create First Discussion

For each published chapter/blog/art page, create a corresponding discussion:

```bash
# Example for chapter 1
gh discussion create \
  --repo Digidinc/shabrang \
  --title "chapter-1-the-fortress-and-the-corridor" \
  --body "Discussion for: The Fortress and the Corridor

See dialectic guide: https://github.com/Digidinc/shabrang/blob/main/docs/DIALECTIC_GUIDE.md"
```

Or use the web UI:
1. Go to https://github.com/Digidinc/shabrang/discussions/new
2. Title: `chapter-{slug}` or `blog-{id}` or `art-{id}`
3. Body: Link to page + guide
4. Category: Select appropriate category
5. Click "Start discussion"

## Phase 5: Monitoring & Maintenance

### 5.1 Monitor Worker Usage

```bash
cd workers/ai-council
npm run tail
```

Or visit: https://dash.cloudflare.com/ → Workers & Pages → shabrang-ai-council → Metrics

### 5.2 Monitor GitHub Actions

Visit: https://github.com/Digidinc/shabrang/actions

Check for failed workflow runs.

### 5.3 Review Pending Comments

Pending comments create GitHub issues with label `moderation`.

To review:

1. Go to https://github.com/Digidinc/shabrang/issues?q=is%3Aissue+is%3Aopen+label%3Amoderation
2. Click on issue
3. Review the comment in the linked discussion
4. Add label to discussion:
   - `approved` - Shows on website
   - `rejected` - Does not show
   - Keep `pending-review` - Needs more discussion

### 5.4 Handle Appeals

If a user replies to a rejected comment with `@appeal`:

1. Review the appeal reasoning
2. If valid, remove `rejected` label and add `approved`
3. If invalid, reply explaining why decision stands

### 5.5 Update Moderation Criteria

If the AI is making poor decisions:

1. Edit `workers/ai-council/index.ts`
2. Update the `MODERATION_PROMPT` constant
3. Redeploy: `npm run deploy`

## Troubleshooting

### Comments not showing on website

**Check:**
1. Does discussion exist with exact pageId as title?
2. Does comment have `approved` label?
3. Clear browser cache (5-minute cache on API route)

### AI Council not labeling comments

**Check:**
1. GitHub Actions workflow succeeded? (Check Actions tab)
2. `AI_COUNCIL_URL` secret set correctly?
3. Worker logs: `npm run tail`
4. Worker still deployed? Visit URL in browser

### Worker hitting rate limits

**Check Cloudflare dashboard:**
- Free tier: 10K requests/day
- If exceeded, upgrade to Workers Paid ($5/month)

### GitHub API rate limiting

**Check:**
- Authenticated: 5000 requests/hour
- Unauthenticated: 60 requests/hour
- Solution: Ensure `GITHUB_TOKEN` is set correctly

## Cost Breakdown

| Service | Free Tier | Current Usage | Cost |
|---------|-----------|---------------|------|
| GitHub Discussions | Unlimited | - | $0 |
| GitHub Actions | 2000 min/month | ~10 min/month | $0 |
| Cloudflare Pages | Unlimited | 1 site | $0 |
| Cloudflare Workers | 100K req/day | <1K req/day | $0 |
| Cloudflare Workers AI | 10K req/day | <100 req/day | $0 |
| **Total** | | | **$0/month** |

## Scaling

If you exceed free tier limits:

1. **Cloudflare Workers AI** (>10K AI requests/day):
   - Upgrade to Workers Paid: $5/month for 10M requests
   - Or rate-limit to 10K/day (queue excess for next day)

2. **GitHub Actions** (>2000 minutes/month):
   - Unlikely with comment moderation
   - If hit, upgrade to Team plan ($4/user/month)

3. **Comment volume** (>10K comments/day):
   - Batch processing (moderate every hour instead of immediately)
   - Multi-worker deployment (shard by pageId)

## Security Considerations

### GitHub Token

- Store in Cloudflare secrets (encrypted at rest)
- Use minimal scopes (`repo`, `write:discussion`)
- Rotate every 90 days

### Webhook Secrets

- Not currently used (GitHub Actions pulls, not pushes)
- Future: Add `GITHUB_WEBHOOK_SECRET` for webhook verification

### Worker Endpoint

- CORS enabled for all origins (read-only moderation endpoint)
- No sensitive data in responses
- Rate limiting handled by Cloudflare

### XSS Protection

- Comments sanitized with `sanitize-html` library
- Only safe HTML tags allowed
- All `<script>` tags stripped

## Backup & Recovery

### GitHub Discussions

- Permanently stored in Git
- Forkable by anyone
- Export via GitHub API if needed

### Worker Code

- Version controlled in `workers/ai-council/`
- Deployed versions visible in Cloudflare dashboard
- Rollback: `wrangler rollback`

### Labels

- Re-create with `gh api` commands (see Phase 1.2)
- Or manually via GitHub UI

## Next Steps

- [ ] Create discussions for all existing chapters/blogs/art
- [ ] Invite community to participate
- [ ] Monitor first 100 comments for quality
- [ ] Tune AI moderation criteria based on feedback
- [ ] Implement appeal workflow
- [ ] Add multi-model consensus (Llama + Gemini)

## Support

- Technical issues: https://github.com/Digidinc/shabrang/issues
- Contribution questions: See docs/DIALECTIC_GUIDE.md
- Cloudflare support: https://dash.cloudflare.com/
- GitHub support: https://support.github.com/

---

**The dialectic is now live. When they burn the books, we fork the repo. 🔥→🍴**
