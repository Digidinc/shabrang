# Shabrang Telegram Autopilot Integration

**Status:** ✅ Core workflow implemented
**Location:** `/home/mumega/claude-interface/telegram/`
**Model:** Gemini 2.0 Flash Exp (cheap for planning)

## What We Built

Extended your existing Telegram bot (the one that already handles images, video, voice) with **Shabrang weekly planning automation**.

## How It Works

### 1. Command Center (Google Workspace)

**Sheet:** https://docs.google.com/spreadsheets/d/1Y2OkpIMgtVm6Yi4DdOLzi0WvA_pHlzlSW0d8hNNk7Ik

- **Queue tab:** Pending content tasks (blog posts, social posts, community)
- **Log tab:** Audit trail of all AI actions

**Doc:** https://docs.google.com/document/d/1Egw7os97h49Zu9Fj5lEhvlnAzvCGM0mW_esp-7y0TPg

- Weekly plan template updated by AI

### 2. Telegram Workflow

```
You: /shabrang_plan

Bot: 📊 Reading Command Center queue...
     📊 Found 3 pending tasks. Generating plan with Gemini...
     ✅ Weekly plan generated!

     📄 View full plan in Google Doc

     Preview:
     # Shabrang Weekly Plan

     ## Intent (Community First)
     This week focuses on building community through
     shared inquiry into The Liquid Fortress themes...

     ## Weekly Themes
     1) Chapter 3: The qanat as hidden infrastructure
     2) FRC 100.010: Solid level grounding
     3) 16D: Resonance vectors in community formation

     ...

     Use /shabrang_approve to proceed.
```

You review the plan in Google Doc, edit if needed, then approve.

### 3. Autopilot Flow (When Complete)

```
Monday: /shabrang_plan → AI generates plan
Monday: You review & approve
Tuesday-Sunday: AI generates content drafts
Each draft: Telegram preview → You approve → GHL publishes
```

## Telegram Commands

### Implemented ✅

- **`/shabrang_plan [prompt]`** - Generate weekly plan from Command Center
- **`/shabrang_status`** - Show current task status

### Coming Soon 🚧

- **`/shabrang_approve`** - Approve plan & start content generation
- **`/shabrang_preview <id>`** - Preview content draft
- **`/shabrang_publish <id>`** - Publish to GHL

## Files Created

### Telegram Bot Extension
- `/home/mumega/claude-interface/telegram/shabrang_commands.py` - Command handlers
- `/home/mumega/claude-interface/telegram/SHABRANG_AUTOPILOT.md` - Full docs
- Updated: `/home/mumega/claude-interface/telegram/bot.py` - Registers commands

### Command Center
- `/home/mumega/shabrang-refactor/automation/setup_command_center.py` - Setup script
- `/home/mumega/shabrang-refactor/automation/command-center.json` - Stored IDs (gitignored)

### Documentation
- Updated: `/home/mumega/shabrang-refactor/AGENTS.md` - Added Telegram reference
- Updated: `/home/mumega/claude-interface/.env.example` - Added GEMINI_PLAN_MODEL

## Why This Approach?

**Reuses your existing Telegram bot instead of building new integration:**

✅ You already have multimodal input (images, video, voice, documents)
✅ You already have content draft creation (`/idea`, `/draft`)
✅ You already have AI integration (Claude Control API, Gemini, OpenRouter)
✅ You already have tenant system (`/tenant`)
✅ You already use it daily

**Just adds 5 new commands for Shabrang workflow.**

## Model Strategy

**Planning:** Gemini 2.0 Flash Exp
- Cheap (~$0.075 per 1M tokens)
- Fast
- Good enough for weekly plans (you review anyway)

**Content (future):** Gemini 3 Pro
- Premium quality
- For final blog posts and social content

**Images (future):** Nano Banana Pro
- Excellent text rendering (Persian + English)

**Video (future):** Veo 3
- Chapter explainers and marketing

## Next Steps to Use

### 1. Set API Key

Add to `/home/mumega/claude-interface/.env`:

```bash
GEMINI_API_KEY=your_key_here
```

### 2. Test the Flow

In Telegram (with your existing bot):

```
/shabrang_status
```

Should show your Command Center with 0 tasks.

Add a task manually to the Google Sheet:

| id | title | status | channel |
|----|-------|--------|---------|
| 1 | Test blog post about qanat | pending | blog |

Then:

```
/shabrang_plan Test plan for week 1
```

Should generate a plan and update the Google Doc.

### 3. Iterate

Once `/shabrang_plan` works:
- Add real tasks to Command Center
- Generate weekly plans
- Refine the AI prompt in `shabrang_commands.py`

### 4. Build Phase 2

When ready for auto-publishing:
- Implement `/shabrang_approve`
- Connect to GHL social scheduler
- Add Nano Banana Pro for image generation

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│         Google Drive (Shabrang Folder)      │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │ Command Center   │  │ Weekly Plan     │ │
│  │ (Sheet)          │  │ (Doc)           │ │
│  │                  │  │                 │ │
│  │ Queue | Log      │  │ AI-generated    │ │
│  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────┘
               ↕                    ↕
┌─────────────────────────────────────────────┐
│      Telegram Bot (Claude Control)          │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │ shabrang_plan    │  │ shabrang_status │ │
│  │ shabrang_approve │  │ shabrang_publish│ │
│  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────┘
               ↕
┌─────────────────────────────────────────────┐
│             Gemini 2.0 Flash Exp            │
│  (Weekly planning, cheap & fast)            │
└─────────────────────────────────────────────┘
               ↕ (future)
┌─────────────────────────────────────────────┐
│     Gemini 3 Pro + Nano Banana + Veo 3      │
│  (Content generation, images, videos)       │
└─────────────────────────────────────────────┘
               ↕ (future)
┌─────────────────────────────────────────────┐
│          GoHighLevel (GHL)                  │
│  Social scheduler + tracking                │
└─────────────────────────────────────────────┘
```

## Cost Estimate

**Current (Planning Only):**
- Gemini 2.0 Flash Exp: ~$0.075 per 1M tokens
- Weekly plan (~2K tokens) = $0.0002 per plan
- **~$0.01/month** (4 plans)

**Future (Full Autopilot):**
- Planning: $0.01/month
- Content generation (Gemini 3 Pro): ~$5-10/month
- Images (Nano Banana Pro): ~$5-10/month
- Videos (Veo 3): Variable (pay-per-video or $250/month Google AI Ultra)
- **Total: $15-30/month** (without Veo), or **$250/month** (with unlimited Veo)

## References

- **Full AI Architecture:** `/home/mumega/shabrang-refactor/AI_ARCHITECTURE.md`
- **Telegram Bot Docs:** `/home/mumega/claude-interface/telegram/SHABRANG_AUTOPILOT.md`
- **Setup Script:** `/home/mumega/shabrang-refactor/automation/setup_command_center.py`
- **Main Docs:** `/home/mumega/shabrang-refactor/README.md`, `AGENTS.md`

---

**Summary:** We didn't build a new Telegram integration—we **extended your existing multimodal bot** with 5 Shabrang commands that automate weekly planning using Google Workspace as the "brain" and Gemini Flash as the cheap planner. When you approve, future versions will auto-generate content with premium models and publish to GHL.
