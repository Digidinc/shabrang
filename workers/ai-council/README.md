# Shabrang AI Council Worker

Cloudflare Worker that provides:
1. **AI moderation** of GitHub issue comments using Llama 3 8B
2. **Comment proxy** for fetching comments from public/private repos

## Architecture

```
┌─────────────────────────────────────┐
│  Shabrang Website                   │
│  Fetches comments via worker        │
└──────────────┬──────────────────────┘
               │ GET /comments?pageId=...
               ▼
┌─────────────────────────────────────┐
│  Cloudflare Worker (AI Council)     │
│  - Proxies GitHub API (auth)        │
│  - Moderates comments (AI)          │
└──────────────┬──────────────────────┘
               │ Authenticates with
               ▼ GITHUB_TOKEN
┌─────────────────────────────────────┐
│  GitHub Issues API                  │
│  - Stores comments                  │
│  - Applies labels                   │
└─────────────────────────────────────┘
```

## Endpoints

### POST /moderate
Moderate a comment using AI Council.

**Request:**
```json
{
  "comment": "Comment text",
  "author": "username",
  "pageId": "01-enigma",
  "commentId": 123,
  "issueNumber": 32
}
```

**Response:**
```json
{
  "decision": "approved|pending|rejected",
  "reason": "Explanation",
  "confidence": 0.9,
  "suggestedLabels": ["approved", "synthesis"]
}
```

### GET /comments?pageId={pageId}
Fetch comments for a specific page from GitHub Issues (supports private repos).

**Response:**
```json
{
  "issue": {
    "number": 32,
    "title": "01-enigma",
    "labels": [...],
    "html_url": "https://github.com/..."
  },
  "comments": [...]
}
```

### GET /health
Check worker status and configuration.

**Response:**
```json
{
  "status": "ok",
  "hasGitHubToken": true,
  "tokenLength": 40,
  "repoOwner": "Digidinc",
  "repoName": "shabrang"
}
```

## Features

- **AI-Powered Moderation**: Uses Llama 3 8B to evaluate comments
- **Private Repo Support**: Worker proxies GitHub API for private repos
- **Dialectic Labels**: Automatically suggests thesis/antithesis/synthesis labels
- **Three Decision States**:
  - `approved` - Shows on website immediately
  - `pending` - Requires human review
  - `rejected` - Does not meet standards
- **Human Review Queue**: Creates GitHub issues for pending comments
- **Free Tier**: Uses Cloudflare's free AI tier (10K requests/day)

## Setup

### 1. Install Dependencies

```bash
cd workers/ai-council
npm install
```

### 2. Configure Cloudflare

Login to Cloudflare:

```bash
npx wrangler login
```

### 3. Deploy Worker

```bash
npm run deploy
```

This will deploy to: `https://shabrang-ai-council.<your-subdomain>.workers.dev`

### 4. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Create a token with:
   - **Scopes:** `repo` (for private repos) or `public_repo` (for public repos only)
   - **Expiration:** Set based on your security policy
   - **Note:** "Shabrang AI Council Worker"

### 5. Set Cloudflare Worker Secrets

Set the GitHub token:

```bash
echo "YOUR_GITHUB_TOKEN" | npx wrangler secret put GITHUB_TOKEN
```

**Note:** Make sure the token has NO whitespace. The worker automatically strips whitespace, but it's best to paste the raw token.

### 6. Configure Environment Variables

Create `.dev.vars` for local development (copy from `.dev.vars.example`):
```bash
GITHUB_TOKEN=ghp_your_token_here
```

### 5. Configure GitHub Actions

Add the worker URL to GitHub repository secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AI_COUNCIL_URL`
4. Value: `https://shabrang-ai-council.<your-subdomain>.workers.dev`

The GitHub Actions workflow (`.github/workflows/moderate-comments.yml`) will automatically use this secret.

## Testing

### Test the Worker Locally

```bash
npm run dev
```

Then in another terminal:

```bash
curl -X POST http://localhost:8787/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "The qanat is both engineering and metaphor - it solves water scarcity while symbolizing Persian culture.",
    "author": "testuser",
    "pageId": "chapter-1-fortress-and-corridor"
  }'
```

Expected response:

```json
{
  "decision": "approved",
  "reason": "Comment provides synthesis perspective connecting physical infrastructure to cultural meaning",
  "confidence": 0.92,
  "suggestedLabels": ["approved", "synthesis"]
}
```

### Test with Different Comment Types

**Thesis (Scientific):**
```bash
curl -X POST http://localhost:8787/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "The qanat uses gravitational flow to prevent evaporation. Archaeological evidence shows 3-generation construction cycles.",
    "author": "testuser",
    "pageId": "chapter-1"
  }'
```

**Antithesis (Mystic):**
```bash
curl -X POST http://localhost:8787/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "The qanat is called mother well (مادرچاه) - the hidden womb that gives life to the garden. Inner/outer, seen/unseen.",
    "author": "testuser",
    "pageId": "chapter-1"
  }'
```

**Spam (Should be rejected):**
```bash
curl -X POST http://localhost:8787/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Check out my crypto course! Click here for 50% off!",
    "author": "spammer",
    "pageId": "chapter-1"
  }'
```

## Moderation Criteria

### Approved ✅

- Adds new perspective (thesis, antithesis, synthesis)
- Respectful disagreement with evidence
- Cultural insight or personal stories
- Questions that deepen understanding
- References sources or lived experience

### Rejected ❌

- Hate speech, racism, sexism, homophobia
- Spam or advertising
- Off-topic content
- Personal attacks
- Disinformation without sources

### Pending Review ⏳

- Complex theological/political claims
- Borderline relevance
- Unclear intent
- AI confidence < 70%

## Monitoring

### View Worker Logs

```bash
npm run tail
```

### Check Worker Status

Visit: `https://dash.cloudflare.com/` → Workers & Pages → shabrang-ai-council

### Check Costs

Cloudflare Workers AI free tier:
- 10,000 requests/day
- Unlimited bandwidth
- $0/month

If you exceed 10K requests/day, upgrade to Workers Paid ($5/month for 10M requests).

## Troubleshooting

### Error: "AI response was unclear"

The AI sometimes returns malformed JSON. The worker defaults to `pending` review in this case.

**Solution:** Human moderators will review these comments.

### Error: "Failed to add labels"

GitHub API authentication issue.

**Solution:**
1. Verify `GITHUB_TOKEN` secret is set correctly
2. Ensure token has `repo` and `discussions` scopes
3. Check repository permissions

### GitHub Actions not triggering

**Solution:**
1. Verify workflow file is in `.github/workflows/moderate-comments.yml`
2. Check Actions tab for errors
3. Ensure `AI_COUNCIL_URL` secret is set
4. GitHub Issues webhooks (`issue_comment`) should work automatically for public repos

### 401 Error from GitHub API

The worker returns "GitHub API error: 401" when fetching comments.

**Solution:**
1. Check if GITHUB_TOKEN is set: `curl https://your-worker.workers.dev/health`
2. Verify token has correct scopes:
   - For public repos: `public_repo` scope
   - For private repos: Full `repo` scope
3. Test token manually:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```
4. If token is expired, generate a new one and update the secret:
   ```bash
   echo "NEW_TOKEN" | npx wrangler secret put GITHUB_TOKEN
   ```

### Comments not showing on website

**Solution:**
1. Check that issue exists with `dialectic` label: `gh issue list --label dialectic`
2. Verify issue title EXACTLY matches pageId
3. Test worker endpoint: `curl "https://your-worker.workers.dev/comments?pageId=01-enigma"`
4. Check browser console for errors

## Architecture Decisions

### Why Cloudflare Workers AI?

- **Free**: 10K requests/day on free tier
- **Fast**: Edge computing, low latency
- **Permanent**: No cold starts, always on
- **Sovereign**: Runs on Iranian-accessible CDN (unlike AWS)

### Why Llama 3 8B?

- **Balance**: Good accuracy without high cost
- **Speed**: Fast inference (~200-500ms)
- **Free**: Included in Cloudflare Workers AI free tier
- **Open**: Meta's open model, not proprietary

### Why GitHub Actions?

- **Integrated**: Native GitHub Discussions integration
- **Free**: 2000 minutes/month
- **Reliable**: Battle-tested CI/CD platform
- **Transparent**: All moderation decisions visible in git

## Future Enhancements

- [ ] Appeal workflow (when users reply with `@appeal`)
- [ ] Multi-model consensus (Llama + Gemini voting)
- [ ] Learning from human moderator decisions
- [ ] Batch moderation for comment edits
- [ ] Webhooks for real-time moderation (instead of polling)

## License

MIT
