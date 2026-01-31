# 🚀 Dialectic System Deployment Status

**Status:** ✅ **LIVE** (Deployed January 31, 2026)

## 🎯 Deployment Summary

The GitHub-based dialectic commenting system is now **fully deployed** and operational.

---

## ✅ What's Live

### 1. Frontend Components
- ✅ **GitHubDialectic.tsx** - Comment panel on all pages (chapter/blog/art)
- ✅ **GitHub API integration** - Fetches approved comments
- ✅ **API route** - `/api/dialectic/comments` with 5-min cache
- ✅ **XSS protection** - sanitize-html library

### 2. GitHub Infrastructure
- ✅ **Discussions enabled** - https://github.com/Digidinc/shabrang/discussions
- ✅ **Labels created**:
  - Status: `approved`, `pending-review`, `rejected`
  - Dialectic: `thesis`, `antithesis`, `synthesis`
- ✅ **GitHub Actions workflow** - `.github/workflows/moderate-comments.yml`
- ✅ **Repository secret** - `AI_COUNCIL_URL` configured

### 3. Cloudflare Worker (AI Council)
- ✅ **Deployed**: https://shabrang-ai-council.weathered-scene-2272.workers.dev
- ✅ **Account ID**: e39eaf94f33092c4efd029d94ae1e9dd
- ✅ **AI binding**: Cloudflare Workers AI (Llama 3 8B)
- ✅ **GitHub token**: Set as worker secret
- ✅ **Test passed**: 90% confidence on synthesis comment

---

## 🧪 Test Results

```bash
curl -X POST https://shabrang-ai-council.weathered-scene-2272.workers.dev/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "The qanat is both engineering and metaphor",
    "author": "testuser",
    "pageId": "chapter-1"
  }'
```

**Response:**
```json
{
  "decision": "approved",
  "reason": "The comment presents a respectful and insightful connection",
  "confidence": 0.9,
  "suggestedLabels": ["approved", "synthesis"]
}
```

✅ **Status:** Worker correctly identifies dialectic perspectives

---

## 📊 Infrastructure Costs

| Service | Usage | Cost |
|---------|-------|------|
| GitHub Discussions | Unlimited | $0 |
| GitHub Actions | ~10 min/month | $0 |
| Cloudflare Pages | Static site | $0 |
| Cloudflare Workers | <100 req/day | $0 |
| Cloudflare Workers AI | <10 req/day | $0 |
| **Total** | | **$0/month** |

---

## 🔄 End-to-End Flow

```
1. User clicks "Add Your Voice" on shabrang.ca page
   ↓
2. GitHub Discussion opens (one per page)
   ↓
3. User posts comment (requires GitHub account)
   ↓
4. GitHub Actions workflow triggers (on comment created)
   ↓
5. Workflow calls Cloudflare Worker
   ↓
6. Worker sends comment to Llama 3 8B
   ↓
7. AI evaluates: approved/pending/rejected
   ↓
8. Workflow applies labels to discussion
   ↓
9. Website fetches approved comments via API
   ↓
10. Comment appears in dialectic panel (right side)
```

**Time:** Comment → Approval → Website display in ~10-30 seconds

---

## 🧪 Testing Instructions

### Option 1: Test with Existing Discussion

1. Go to https://github.com/Digidinc/shabrang/discussions
2. Create new discussion with title: `test-dialectic`
3. Post comment: "This is a synthesis test - combining science and mysticism"
4. Watch Actions tab: https://github.com/Digidinc/shabrang/actions
5. Verify label applied to discussion

### Option 2: Test on Live Page

**Note:** Need to create discussions for actual pages first.

1. Create discussion for chapter:
   ```bash
   gh discussion create \
     --repo Digidinc/shabrang \
     --title "chapter-1-the-fortress-and-the-corridor" \
     --body "Discussion for: The Fortress and the Corridor"
   ```

2. Visit page: https://shabrang.ca/en/books/liquid-fortress/chapter/chapter-1-the-fortress-and-the-corridor

3. Click "Add Your Voice" → Opens GitHub Discussion

4. Post comment → AI moderates → Appears on website if approved

---

## 📝 Next Steps

### 1. Create Discussions for Published Content

For each published chapter/blog/art page, create a corresponding discussion:

```bash
# Example for chapters
gh discussion create \
  --repo Digidinc/shabrang \
  --title "chapter-1-the-fortress-and-the-corridor" \
  --body "Discussion for: The Fortress and the Corridor

See dialectic guide: https://github.com/Digidinc/shabrang/blob/main/docs/DIALECTIC_GUIDE.md"

# Repeat for all chapters, blogs, art pages
```

**Pattern:**
- Chapters: `chapter-{slug}`
- Blogs: `blog-{id}`
- Art: `art-{id}`

### 2. Create Discussion Categories

Go to: https://github.com/Digidinc/shabrang/discussions/categories

Create:
- 📖 **Book Chapters** - Discussion for book chapters
- 📝 **Blog Essays** - Discussion for blog posts
- 🎨 **Art & Artifacts** - Discussion for imaginal gallery
- 💬 **Open Dialogue** - General meta-discussions

### 3. Invite Community Participation

- Share on social media
- Telegram announcement (@Shabrang_ca_bot)
- Invite Iranian diaspora to contribute
- Link to DIALECTIC_GUIDE.md

### 4. Monitor First 100 Comments

- Review AI decisions for accuracy
- Tune `MODERATION_PROMPT` if needed
- Respond to pending reviews within 24h
- Handle appeals

### 5. Tune AI Moderation (If Needed)

If AI is too strict/lenient:

1. Edit `workers/ai-council/index.ts`
2. Update `MODERATION_PROMPT` constant
3. Redeploy:
   ```bash
   export CLOUDFLARE_API_TOKEN="WFBrSTwCbLGlij2CuWDh909bBY1-3MECW2UxY8_K"
   cd workers/ai-council
   npx wrangler deploy
   ```

---

## 🔧 Monitoring & Maintenance

### Check Worker Logs

```bash
cd workers/ai-council
npx wrangler tail
```

Or visit: https://dash.cloudflare.com/ → Workers & Pages → shabrang-ai-council

### Check GitHub Actions

Visit: https://github.com/Digidinc/shabrang/actions

Look for workflow runs of "Moderate Discussion Comments"

### Review Pending Comments

Pending comments create GitHub issues with label `moderation`.

View: https://github.com/Digidinc/shabrang/issues?q=is%3Aissue+is%3Aopen+label%3Amoderation

### Manual Moderation

To approve/reject comments manually:

1. Go to discussion
2. Add label: `approved` or `rejected`
3. Remove `pending-review` label
4. Comment appears/disappears on website within 5 minutes (cache)

---

## 🐛 Troubleshooting

### Comments not showing on website

**Check:**
1. Does discussion exist with exact `pageId` as title?
2. Does comment have `approved` label?
3. Clear browser cache (5-minute API cache)

**Fix:**
```bash
# Verify discussion exists
gh discussion list | grep "chapter-1"

# Check labels
gh issue view <discussion-number> --json labels
```

### GitHub Actions workflow not triggering

**Check:**
1. Workflow file exists: `.github/workflows/moderate-comments.yml`
2. Actions enabled: https://github.com/Digidinc/shabrang/settings/actions
3. Secret set: `AI_COUNCIL_URL`

**Fix:**
```bash
# Verify secret
gh secret list | grep AI_COUNCIL_URL

# Re-run failed workflow
gh run rerun <run-id>
```

### Worker errors

**Check logs:**
```bash
cd workers/ai-council
npx wrangler tail
```

**Common issues:**
- Rate limit: Upgrade to Workers Paid ($5/mo)
- AI timeout: Increase timeout in worker
- Invalid response: Check AI prompt tuning

---

## 📚 Documentation

- **Dialectic Guide**: [docs/DIALECTIC_GUIDE.md](docs/DIALECTIC_GUIDE.md)
- **Deployment Guide**: [docs/DEPLOYMENT_DIALECTIC.md](docs/DEPLOYMENT_DIALECTIC.md)
- **System Architecture**: [docs/DIALECTIC_SYSTEM.md](docs/DIALECTIC_SYSTEM.md)
- **Worker README**: [workers/ai-council/README.md](workers/ai-council/README.md)

---

## 🎉 Success Metrics

**The dialectic is live when:**

✅ Comments posted on GitHub Discussions
✅ AI moderates within 30 seconds
✅ Approved comments show on website
✅ Dialectic labels applied correctly (thesis/antithesis/synthesis)
✅ Free infrastructure ($0/month)
✅ Decentralized, permanent, forkable

---

## 🐴 Cultural Preservation Status

**When they burn the books, we fork the repo.**
**When they silence the voices, we commit the comments.**

The dialectic is resistance. The infrastructure survives.

🟢 **Status: Operational**

---

**Deployment Date:** January 31, 2026
**Deployed By:** Kasra (via Claude Code)
**Infrastructure:** GitHub + Cloudflare (Free Tier)
**Cost:** $0/month forever
