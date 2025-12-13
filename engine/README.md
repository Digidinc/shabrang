# Shabrang Engine

**Transform books into immersive, viral web experiences.**

A GoHighLevel plugin for interactive books that GenZ actually wants to read.

---

## What It Does

```
INPUT                          OUTPUT
─────────────────────────────────────────────────────────────
Markdown/LaTeX/EPUB    →    Immersive Web Experience
config.yaml            →    with viral sharing, AI audio,
media assets           →    ambient mode, social features
```

## Features

### For Readers (GenZ-First)
- **Ambient Reading Mode** - Background music, immersive atmosphere
- **AI Voice Narration** - ElevenLabs/OpenAI TTS integration
- **Quote Sharing** - Select text → beautiful cards → share to socials
- **Reading Progress** - Visual progress, bookmarks, streaks
- **Dark/Light/Sepia modes** - Easy on the eyes
- **Offline Support** - PWA, read anywhere

### For Authors
- **Write in Markdown** - No HTML knowledge needed
- **One Command Build** - `python build.py` generates everything
- **Media Console** - Audio, video, slides per chapter
- **Automatic Context Links** - Wikipedia, internal references
- **Multi-language** - RTL support (Persian, Arabic)
- **Paywall Ready** - GoHighLevel integration

### For Virality
- **Text Selection Sharing** - Highlight → Share
- **Multi-Platform Cards** - Instagram, Twitter/X, WhatsApp, Telegram
- **Referral Tracking** - `?ref=` codes for community growth
- **Open Graph Ready** - Beautiful link previews

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create your book
cp -r examples/starter my-book
cd my-book

# 3. Edit config
vim config.yaml

# 4. Add chapters
echo "# Chapter 1\n\nYour content here..." > content/chapters/01-intro.md

# 5. Build
python ../build.py

# 6. Preview
python -m http.server -d dist 8000
# Open http://localhost:8000
```

---

## Project Structure

```
engine/
├── build.py              # Main build script
├── config.schema.yaml    # Configuration schema
├── requirements.txt      # Python dependencies
│
├── parsers/
│   ├── __init__.py
│   ├── markdown.py       # Markdown → HTML
│   ├── latex.py          # LaTeX → HTML (via Pandoc)
│   └── epub.py           # EPUB → HTML (via Pandoc)
│
├── templates/
│   ├── base.html         # Base template
│   ├── chapter.html      # Chapter page
│   ├── index.html        # Table of contents
│   └── components/
│       ├── header.html
│       ├── media_console.html
│       ├── resource_box.html
│       ├── share_modal.html
│       ├── paywall.html
│       └── reading_progress.html
│
├── static/
│   ├── css/
│   │   ├── base.css      # Core styles
│   │   ├── experience.css # Immersive features
│   │   ├── social.css    # Comments sidebar
│   │   └── viral.css     # Share modal
│   ├── js/
│   │   ├── book.js       # Core functionality
│   │   ├── experience.js # Ambient mode, progress
│   │   ├── social.js     # Comments
│   │   ├── viral.js      # Sharing
│   │   └── tts.js        # Text-to-speech
│   └── fonts/
│
├── themes/
│   ├── alette.yaml       # Persian miniature (default)
│   ├── midnight.yaml     # Dark mode
│   └── paper.yaml        # Classic book
│
└── examples/
    ├── starter/          # Minimal starter template
    └── liquid-fortress/  # Full example (this book)
```

---

## Configuration (config.yaml)

```yaml
book:
  title: "The Liquid Fortress"
  subtitle: "A Structural History of the Persian Mind"
  author: "Hadi Servat"
  language: en
  rtl: false

theme: alette  # or: midnight, paper, custom

experience:
  ambient_audio: true
  reading_progress: true
  ai_narration: true

sharing:
  enabled: true
  platforms: [twitter, instagram, whatsapp, telegram]
  referral_prefix: "REF"

paywall:
  enabled: true
  free_chapters: [preface, introduction, 1, 2, 3, 4, 5, appendices]
  checkout_url: "https://your-ghl-checkout.com"

integrations:
  gohighlevel:
    enabled: true
    # API keys in .env file
  elevenlabs:
    enabled: true
    voice_id: "your-voice-id"
```

---

## AI Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **ElevenLabs** | AI voice narration | Supported |
| **OpenAI TTS** | Alternative voice | Supported |
| **Nano Banana Pro** | Quote card images | Planned |
| **Veo 3.1** | Video clips | Planned |
| **GoHighLevel** | Paywall, community | Supported |

---

## Themes

### ALETTE (Default)
Persian miniature aesthetic with:
- Sand background (#F5E6C8)
- Teal accents (#2D5A6B)
- Crimson highlights (#8B3535)
- Gold sacred elements (#C9A227)

### Midnight
Dark mode for night readers:
- Deep black background
- Soft white text
- Amber accents

### Paper
Classic book feel:
- Off-white background
- Serif typography
- Minimal decoration

---

## License

MIT License - Use freely, build amazing books.

---

## Credits

Built by the Shabrang team.
Powered by: Pandoc, Jinja2, ElevenLabs, GoHighLevel.

*"The Horse is waiting. The saddle is empty. It is time to ride."*
