# SHABRANG MASTER PLAN
## The Liquid Fortress - Living Book System

**Version:** 1.0
**Last Updated:** December 13, 2025
**Maintained By:** Claude (Opus 4.5)

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [The Product Ecosystem](#2-the-product-ecosystem)
3. [Technical Architecture](#3-technical-architecture)
4. [Content Assets](#4-content-assets)
5. [Visual Identity](#5-visual-identity)
6. [Monetization & Funnel](#6-monetization--funnel)
7. [Viral Sharing System](#7-viral-sharing-system)
8. [GoHighLevel Integration](#8-gohighlevel-integration)
9. [Video Production Pipeline](#9-video-production-pipeline)
10. [Multi-Language Strategy](#10-multi-language-strategy)
11. [Roadmap & Milestones](#11-roadmap--milestones)

---

## 1. PROJECT OVERVIEW

### The Vision
Transform "The Liquid Fortress" from a static book into a **living, viral experience** that:
- Spreads organically through social sharing
- Builds community in GoHighLevel
- Upsells to deeper FRC content
- Showcases the Shabrang brand across multiple media

### Core Thesis
Persian civilization survived 3,000 years of invasion by building a **Liquid Fortress** — storing identity in portable cultural layers (poetry, myth, ritual) when political structures collapsed. This book applies **Fractal Resonance Coherence (FRC)** physics to history.

### The Name: Shabrang (شبرنگ)
"Night-colored" — The legendary horse that survives the death of kings. The Carrier Wave. The avatar of the Persian Mind.

---

## 2. THE PRODUCT ECOSYSTEM

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHABRANG ECOSYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  LANDING PAGE   │───▶│   THE BOOK      │───▶│  COMMUNITY  │ │
│  │  (Lead Capture) │    │  (Experience)   │    │   (GHL)     │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                      │                     │        │
│           ▼                      ▼                     ▼        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    VIRAL LAYER                              ││
│  │  Quote Cards → Social Media → New Readers → Community       ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    UPSELL PATH                              ││
│  │  Free Chapters → Paid Chapters → Prime 2 (Advanced FRC)     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Products

| Product | Type | Status | Description |
|---------|------|--------|-------------|
| **The Liquid Fortress** | Book (Web) | ✅ Complete | 30 chapters + appendices |
| **Prime 2** | Book (Upsell) | Planned | Advanced FRC framework |
| **Landing Page** | Marketing | ✅ Built | Lead capture + preview |
| **GHL Community** | Membership | Active | Paid access + discussion |

### Note on Kay Hermes Albums
The 4 alchemical albums (Nigredo, Albedo, Citrinitas, Rubedo) are **personal/separate projects** — not mixed with the book marketing. They serve as creative tools in the broader ecosystem.

---

## 3. TECHNICAL ARCHITECTURE

### Current Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  Book/                                                           │
│  ├── index.html          (Master TOC)                           │
│  ├── preface.html        (FREE)                                 │
│  ├── introduction.html   (FREE)                                 │
│  ├── chapter1-5.html     (FREE)                                 │
│  ├── chapter6-30.html    (PAYWALL → GHL)                        │
│  ├── conclusion.html     (PAYWALL)                              │
│  ├── appendices.html     (FREE)                                 │
│  ├── style.css           (ALETTE palette)                       │
│  ├── book.js             (Language switcher)                    │
│  ├── social.js           (Comments sidebar)                     │
│  ├── viral.js            (Quote card generator)                 │
│  └── images/             (150+ AI-generated visuals)            │
├─────────────────────────────────────────────────────────────────┤
│  Landing/                                                        │
│  ├── index.html          (Marketing landing page)               │
│  ├── content_machine.py  (Social content automation)            │
│  ├── ghl_oauth.py        (GHL authentication)                   │
│  ├── ghl_sdk.py          (GHL API wrapper)                      │
│  └── ghl_signup.py       (Lead capture)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Backend (GoHighLevel)
- **Community:** Member management, paid tiers
- **Email Sequences:** Nurture, drip content
- **Payment:** Stripe integration via GHL
- **Analytics:** Engagement tracking

### Build System
- **book_builder.py:** Injects headers, footers, context boxes
- **context_data.py:** Chapter-to-resource mapping (Wikipedia + internal links)

---

## 4. CONTENT ASSETS

### Per Chapter Media Stack

Each chapter includes:

| Media Type | Tool | Status | Location |
|------------|------|--------|----------|
| **Text** | Manual | ✅ Complete | `Book/chapterX.html` |
| **Images** | ChatGPT/DALL-E | ✅ Complete | `Book/images/` |
| **Audiobook** | Suno AI | ✅ Complete | [TBD - link to files] |
| **Video Explainer** | NotebookLM | ✅ Complete | [TBD - link to files] |
| **Slides** | NotebookLM | ✅ Complete | [TBD - link to files] |

### Future Content
- **Fan-made videos** (YouTube community)
- **Social clips** (Nano Banana Pro + Veo 3.1)
- **Podcast appearances**

---

## 5. VISUAL IDENTITY

### ALETTE Palette (Strict)

```css
:root {
    /* Background Options */
    --sand: #F5E6C8;           /* Warm cream/aged parchment */
    --gold-bg: #C9A84C;        /* Burnished gold (alternate) */

    /* Primary */
    --black: #1A1A18;          /* Coal black - outlines, figures, text */

    /* Semantic Colors */
    --teal: #1A4A4A;           /* Coherence/Water/Flow (range to #2D5A6B) */
    --crimson: #8B3535;        /* Entropy/Fire/Danger (range to #8B3A3A) */
    --gold: #C9A227;           /* Sacred/Light/Value (range to #D4A84B) */
    --green: #3D5C3D;          /* Nature/Growth — USE SPARINGLY */
}
```

### Composition Rules

1. **Flat perspective** (Persian miniature style, NO 3D rendering)
2. **Clean black ink outlines** on all figures
3. **Solid color fills** (NO gradients, NO glow effects, NO neon)
4. **Symmetrical or balanced layouts** preferred
5. **Simple geometric Persian border frame** (teal + gold)
6. **High contrast** for print readability

### Logo
- **Shabrang Logo:** `Book/images/shabrang_logo.png`
- The riderless horse emerging from mist

---

## 6. MONETIZATION & FUNNEL

### Access Tiers

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1: FREE (No Login Required)                                │
├─────────────────────────────────────────────────────────────────┤
│  • Prologue: The Riderless Horse                                │
│  • Introduction: The Physics of Survival                        │
│  • Chapter 1: The Fortress and the Corridor                     │
│  • Chapter 2: The Lens of FRC                                   │
│  • Chapter 3: The First Binary                                  │
│  • Chapter 4: The Myth of the Border                            │
│  • Chapter 5: The Thermodynamics of Truth                       │
│  • Appendices A-E (Glossary, Archetypes, Fortresses, etc.)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  TIER 2: PREMIUM (GHL Membership Required)                       │
├─────────────────────────────────────────────────────────────────┤
│  • Chapters 6-30 (25 chapters)                                  │
│  • Conclusion: The Garden in the Fire                           │
│  • Community access                                              │
│  • Audio + Video for all chapters                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  TIER 3: UPSELL                                                  │
├─────────────────────────────────────────────────────────────────┤
│  • Prime 2: Advanced FRC Framework                              │
│  • 1-on-1 Coaching / Workshops                                  │
│  • Enterprise licensing                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Funnel Flow

```
Social Media (Quote Card)
        │
        ▼
Landing Page (Email Capture)
        │
        ▼
Free Chapters (Build Trust)
        │
        ▼
Paywall (GHL Checkout)
        │
        ▼
Premium Content + Community
        │
        ▼
Upsell (Prime 2, Coaching)
```

---

## 7. VIRAL SHARING SYSTEM

### Current Implementation (`viral.js`)
- Canvas-based quote card generator (1080x1080 Instagram)
- Download image functionality
- Affiliate link copy

### Planned Enhancements

#### Phase 1: Text Selection Sharing
```javascript
// User selects text → Floating "Share" button appears
// Click → Opens quote card modal with selected text
```

#### Phase 2: Multi-Platform Share
```
┌─────────────────────────────────────────────────────────────────┐
│  SHARE MODAL                                                     │
├─────────────────────────────────────────────────────────────────┤
│  [Quote Card Preview - Canvas]                                   │
│                                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ X/Twitter│ │ Instagram│ │ WhatsApp │ │ Telegram │ │  Copy   │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                  │
│  [Download Image]                                                │
│                                                                  │
│  Referral Code: REF-{MEMBER_ID}                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Phase 3: Card Templates
- **Instagram Square** (1080x1080)
- **Instagram Story** (1080x1920)
- **Twitter/X** (1200x675)
- **WhatsApp Status** (1080x1920)

#### Phase 4: Analytics
- Track shares per chapter
- Track referral conversions
- Identify "super sharers"

### Quote Card Design Spec

```
┌─────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║                                                           ║  │
│  ║     THE LIQUID FORTRESS                                   ║  │
│  ║     ─────────────────                                     ║  │
│  ║                                                           ║  │
│  ║     "Shabrang is the avatar of the                        ║  │
│  ║      Persian Mind. He is the                              ║  │
│  ║      Carrier Wave."                                       ║  │
│  ║                                                           ║  │
│  ║                        — Chapter 1                        ║  │
│  ║                                                           ║  │
│  ║     ═══════════════════════════════════════               ║  │
│  ║     READ THE BOOK | shabrang.com                          ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                  │
│  Colors: Sand background, Gold border, Teal accents             │
│  Font: Georgia (quotes), Helvetica Neue (titles)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. GOHIGHLEVEL INTEGRATION

### Current Files
- `ghl_oauth.py` — OAuth2 authentication
- `ghl_sdk.py` — API wrapper
- `ghl_signup.py` — Lead capture

### Integration Points

| Feature | GHL Feature | Status |
|---------|-------------|--------|
| Lead capture | Forms + Contacts | ✅ Ready |
| Email sequences | Workflows | Planned |
| Paywall | Membership + Stripe | Planned |
| Community | GHL Communities | Active |
| Analytics | Reporting | Planned |

### Workflow: New Lead

```
1. User enters email on landing page
   │
2. GHL Contact created + tagged "Liquid Fortress Lead"
   │
3. Welcome email sent (Chapter 1 access link)
   │
4. 5-email nurture sequence (one chapter teaser per email)
   │
5. Conversion email (Join Premium for Chapters 6-30)
   │
6. If purchased → Tag "Premium Member" → Unlock content
```

### Paywall Implementation

```javascript
// In chapter HTML (chapters 6-30)
<body data-tier="premium">
  <!-- Content blurred by CSS -->
  <div class="paywall-overlay">
    <h2>Premium Content</h2>
    <p>Join the community to unlock this chapter</p>
    <a href="[GHL_CHECKOUT_URL]" class="cta-btn">Unlock Now</a>
  </div>
</body>
```

---

## 9. VIDEO PRODUCTION PIPELINE

### Tools

| Tool | Purpose | Output |
|------|---------|--------|
| **NotebookLM** | Chapter explainers, slides | Video + Audio |
| **Suno AI** | Cinematic audiobook | Audio |
| **Nano Banana Pro** | 4K image generation | Images for video |
| **Veo 3.1** | Social media video clips | 8-sec 1080p video |

### Nano Banana Pro (Google Gemini 3 Pro Image)
- **Native 4K resolution** under 10 seconds
- **Multi-language text rendering** (Persian + English)
- **Character consistency** across images
- **Lightbox feature** for studio-grade control
- Pricing: ~$0.14 (1080p) to $0.24 (4K) per image

### Veo 3.1 (Google DeepMind)
- **8-second clips** at 720p/1080p
- **Native audio generation** (sound effects, dialogue, ambient)
- **Lip-sync support** for speaking characters
- **Frame-specific generation** (control start/end frames)
- Available via Gemini API, Vertex AI, Leonardo.Ai

### Social Video Workflow

```
1. Select quote/concept from chapter
   │
2. Generate image with Nano Banana Pro (ALETTE palette)
   │
3. Animate with Veo 3.1 (8-sec clip + audio)
   │
4. Add text overlay + CTA
   │
5. Export for: Instagram Reels, TikTok, YouTube Shorts
```

---

## 10. MULTI-LANGUAGE STRATEGY

### Languages

| Language | Code | Status | RTL |
|----------|------|--------|-----|
| English | en | ✅ Complete | No |
| Persian (Farsi) | fa | Planned | Yes |
| French | fr | Planned | No |

### Implementation (`book.js`)

```javascript
// Already scaffolded:
const currentLang = localStorage.getItem('frc_lang') || 'en';

// RTL support ready:
if (lang === 'fa') document.body.dir = 'rtl';
```

### Translation Strategy
- Keep English as source
- Persian: Priority (diaspora audience)
- French: Secondary (Francophone scholars)

---

## 11. ROADMAP & MILESTONES

### Phase 1: Foundation (Current)
- [x] Book content complete (30 chapters)
- [x] Images generated (150+)
- [x] Audiobook complete (Suno)
- [x] Video explainers complete (NotebookLM)
- [x] Landing page built
- [x] GHL integration scaffolded
- [ ] **Enhanced viral.js** (text selection + multi-platform share)
- [ ] **Paywall implementation** (GHL checkout integration)

### Phase 2: Launch
- [ ] Landing page live on custom domain
- [ ] Email sequence active
- [ ] Social campaign: "7 Levels, 7 Posts"
- [ ] Podcast outreach (3-5 appearances)

### Phase 3: Growth
- [ ] Persian translation
- [ ] Fan video showcase
- [ ] Community challenges
- [ ] Prime 2 development

### Phase 4: Scale
- [ ] French translation
- [ ] Enterprise/educational licensing
- [ ] Physical book publication
- [ ] Documentary/film rights

---

## APPENDIX: FILE STRUCTURE

```
shabrang/github/shabrang/
├── Book/
│   ├── index.html
│   ├── preface.html
│   ├── introduction.html
│   ├── chapter1.html ... chapter30.html
│   ├── conclusion.html
│   ├── appendices.html
│   ├── style.css
│   ├── style-social.css
│   ├── style-viral.css
│   ├── book.js
│   ├── social.js
│   ├── viral.js
│   └── images/ (150+ files)
├── Landing/
│   ├── index.html
│   ├── content_machine.py
│   ├── ghl_oauth.py
│   ├── ghl_sdk.py
│   ├── ghl_signup.py
│   └── images/
├── POC_Chapter1/
├── POC_Chapter2/
├── SHABRANG_MASTER_PLAN.md (this document)
├── ai_ru_score.md
├── environment_report.md
├── frc_self_analysis.md
├── frc_summary.md
├── infographic_helper.py
├── liquid_fortress_summary.md
└── task.md
```

---

## APPENDIX: KEY QUOTES FOR MARKETING

> "Shabrang is the avatar of the Persian Mind. He is the Carrier Wave."

> "States fall. Kings bleed. Cities crumble into dust. But the Idea—the resonant, living spirit that rides the beast—is indestructible."

> "This survival is a historical anomaly. It violates the law of entropy."

> "Persia built a Liquid Fortress. It constructed a civilization that integrated the rigidity of the Crystal with the adaptability of the Water."

> "The Horse is waiting. The saddle is empty. It is time to ride."

---

## APPENDIX: TOOL LINKS

- **Nano Banana Pro:** https://nanobananavideo.com/ | https://nanobananas.ai/
- **Veo 3.1:** https://gemini.google/overview/video-generation/ | https://deepmind.google/models/veo/
- **Suno AI:** https://suno.ai/
- **NotebookLM:** https://notebooklm.google.com/
- **GoHighLevel:** https://www.gohighlevel.com/

---

*Document maintained by Claude (Opus 4.5)*
*Shabrang Project — December 2025*
