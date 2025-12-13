/**
 * Shabrang Viral Sharing System
 *
 * Features:
 * - Text selection → Share button
 * - Beautiful quote cards (Canvas)
 * - Multi-platform sharing (Twitter, Instagram, WhatsApp, Telegram)
 * - Multiple card sizes (Square, Story, Twitter)
 * - Referral tracking
 * - Download & copy functionality
 */

const ShabrangViral = {
    config: {
        enabled: true,
        platforms: ['twitter', 'whatsapp', 'telegram', 'copy', 'download'],
        card: {
            width: 1080,
            height: 1080,
            background: '#1a1a1d',
            borderColor: '#d4af37',
            textColor: '#ffffff',
            accentColor: '#4dc0b5',
            titleFont: 'bold 40px Cinzel, Georgia, serif',
            quoteFont: 'italic 46px Georgia, serif',
            footerFont: '28px Arial, sans-serif',
            title: 'THE LIQUID FORTRESS',
            footer: 'READ THE BOOK',
            logo: null
        },
        referral: {
            enabled: true,
            prefix: 'REF',
            code: null // Set dynamically or from user session
        },
        bookUrl: window.location.origin
    },

    state: {
        selectedText: '',
        selectedContext: '',
        currentSize: 'square',
        modalOpen: false
    },

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    init(userConfig = {}) {
        this.config = this.deepMerge(this.config, userConfig);

        this.createShareButton();
        this.createShareModal();
        this.setupTextSelection();
        this.setupKeyboardShortcuts();

        console.log('[Shabrang] Viral sharing system initialized');
    },

    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                result[key] = this.deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },

    // =========================================================================
    // FLOATING SHARE BUTTON
    // =========================================================================

    createShareButton() {
        const btn = document.createElement('div');
        btn.id = 'share-float-btn';
        btn.className = 'share-float-btn hidden';
        btn.innerHTML = `
            <button class="share-trigger">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Share</span>
            </button>
        `;
        document.body.appendChild(btn);

        btn.querySelector('.share-trigger').onclick = () => {
            this.openModal();
        };
    },

    // =========================================================================
    // SHARE MODAL
    // =========================================================================

    createShareModal() {
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.className = 'share-modal hidden';
        modal.innerHTML = `
            <div class="share-modal-content">
                <button class="share-close">&times;</button>

                <h3>Share this Quote</h3>

                <!-- Size Selector -->
                <div class="size-selector">
                    <button class="size-btn active" data-size="square">Square</button>
                    <button class="size-btn" data-size="story">Story</button>
                    <button class="size-btn" data-size="twitter">Twitter</button>
                </div>

                <!-- Canvas Preview -->
                <div class="canvas-container">
                    <canvas id="quote-canvas"></canvas>
                </div>

                <!-- Platform Buttons -->
                <div class="platform-buttons">
                    <button class="platform-btn" data-platform="twitter" title="Share on X/Twitter">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </button>
                    <button class="platform-btn" data-platform="whatsapp" title="Share on WhatsApp">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                    <button class="platform-btn" data-platform="telegram" title="Share on Telegram">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </button>
                    <button class="platform-btn" data-platform="copy" title="Copy Link">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </button>
                    <button class="platform-btn" data-platform="download" title="Download Image">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </button>
                </div>

                <!-- Referral Code -->
                <div class="referral-display">
                    <span class="referral-label">Your referral code:</span>
                    <code class="referral-code"></code>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close button
        modal.querySelector('.share-close').onclick = () => this.closeModal();

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal();
        };

        // Size buttons
        modal.querySelectorAll('.size-btn').forEach(btn => {
            btn.onclick = () => {
                modal.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.currentSize = btn.dataset.size;
                this.generateCard();
            };
        });

        // Platform buttons
        modal.querySelectorAll('.platform-btn').forEach(btn => {
            btn.onclick = () => this.shareToplatform(btn.dataset.platform);
        });
    },

    // =========================================================================
    // TEXT SELECTION
    // =========================================================================

    setupTextSelection() {
        document.addEventListener('mouseup', (e) => this.handleSelection(e));
        document.addEventListener('touchend', (e) => this.handleSelection(e));
    },

    handleSelection(e) {
        // Don't trigger in modal
        if (e.target.closest('#share-modal')) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text.length > 10 && text.length < 500) {
            this.state.selectedText = text;

            // Get context (chapter, paragraph)
            const container = selection.anchorNode?.parentElement?.closest('p, blockquote, h2');
            this.state.selectedContext = container?.id || '';

            // Position and show button
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            const btn = document.getElementById('share-float-btn');
            btn.style.top = `${rect.top + window.scrollY - 50}px`;
            btn.style.left = `${rect.left + (rect.width / 2) - 40}px`;
            btn.classList.remove('hidden');
        } else {
            // Hide button if selection too short/long
            setTimeout(() => {
                if (!window.getSelection().toString().trim()) {
                    document.getElementById('share-float-btn').classList.add('hidden');
                }
            }, 200);
        }
    },

    // =========================================================================
    // MODAL CONTROL
    // =========================================================================

    openModal() {
        const modal = document.getElementById('share-modal');
        modal.classList.remove('hidden');
        this.state.modalOpen = true;

        // Set referral code
        const code = this.getReferralCode();
        modal.querySelector('.referral-code').textContent = code;

        // Generate card
        this.generateCard();

        // Hide float button
        document.getElementById('share-float-btn').classList.add('hidden');
    },

    closeModal() {
        document.getElementById('share-modal').classList.add('hidden');
        this.state.modalOpen = false;
    },

    // =========================================================================
    // CARD GENERATION
    // =========================================================================

    generateCard() {
        const canvas = document.getElementById('quote-canvas');
        const ctx = canvas.getContext('2d');
        const cfg = this.config.card;

        // Set size based on selected format
        const sizes = {
            square: { w: 1080, h: 1080 },
            story: { w: 1080, h: 1920 },
            twitter: { w: 1200, h: 675 }
        };
        const size = sizes[this.state.currentSize];
        canvas.width = size.w;
        canvas.height = size.h;

        // Background
        ctx.fillStyle = cfg.background;
        ctx.fillRect(0, 0, size.w, size.h);

        // Border
        ctx.strokeStyle = cfg.borderColor;
        ctx.lineWidth = 16;
        ctx.strokeRect(30, 30, size.w - 60, size.h - 60);

        // Inner border
        ctx.strokeStyle = cfg.accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, size.w - 100, size.h - 100);

        // Title
        ctx.fillStyle = cfg.borderColor;
        ctx.font = cfg.titleFont;
        ctx.textAlign = 'center';
        const titleY = this.state.currentSize === 'story' ? 150 : (this.state.currentSize === 'twitter' ? 80 : 120);
        ctx.fillText(cfg.title, size.w / 2, titleY);

        // Decorative line under title
        const lineY = titleY + 30;
        ctx.beginPath();
        ctx.moveTo(size.w / 2 - 150, lineY);
        ctx.lineTo(size.w / 2 + 150, lineY);
        ctx.strokeStyle = cfg.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Quote text with wrapping
        ctx.fillStyle = cfg.textColor;
        ctx.font = cfg.quoteFont;
        ctx.textAlign = 'center';

        const text = `"${this.state.selectedText}"`;
        const maxWidth = size.w - 200;
        const lineHeight = 56;
        // Center quote in the middle area of the card
        const quoteAreaTop = lineY + 60;
        const quoteAreaBottom = size.h - 160;
        const quoteAreaCenter = (quoteAreaTop + quoteAreaBottom) / 2;

        this.wrapText(ctx, text, size.w / 2, quoteAreaCenter, maxWidth, lineHeight);

        // Source URL
        ctx.fillStyle = cfg.accentColor;
        ctx.font = cfg.footerFont;
        ctx.fillText('shabrang.ca', size.w / 2, size.h - 100);

        // Referral code
        ctx.fillStyle = '#666666';
        ctx.font = '20px Arial, sans-serif';
        ctx.fillText(this.getReferralCode(), size.w / 2, size.h - 60);
    },

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lines = [];

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Limit lines based on card size
        const maxLines = this.state.currentSize === 'twitter' ? 4 : 8;
        if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            lines[maxLines - 1] = lines[maxLines - 1].trim() + '...';
        }

        // Center vertically
        const totalHeight = lines.length * lineHeight;
        let startY = y - totalHeight / 2;

        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), x, startY + (i * lineHeight));
        });
    },

    getChapterName() {
        const title = document.querySelector('h1')?.textContent || 'The Liquid Fortress';
        return title;
    },

    // =========================================================================
    // SHARING
    // =========================================================================

    shareToplatform(platform) {
        const url = this.getShareUrl();
        const text = this.state.selectedText.substring(0, 200);
        const title = this.getChapterName();

        switch (platform) {
            case 'twitter':
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${text}..." — ${title}`)}&url=${encodeURIComponent(url)}`,
                    '_blank',
                    'width=550,height=420'
                );
                break;

            case 'whatsapp':
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(`"${text}..." — ${title}\n\n${url}`)}`,
                    '_blank'
                );
                break;

            case 'telegram':
                window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`"${text}..." — ${title}`)}`,
                    '_blank'
                );
                break;

            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showToast('Link copied to clipboard!');
                });
                break;

            case 'download':
                this.downloadCard();
                break;
        }

        // Track share event
        this.trackShare(platform);
    },

    downloadCard() {
        const canvas = document.getElementById('quote-canvas');
        const link = document.createElement('a');
        const filename = `shabrang-quote-${this.state.currentSize}.png`;
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();

        this.showToast('Image downloaded!');
    },

    getShareUrl() {
        let url = this.config.bookUrl + window.location.pathname;

        if (this.config.referral.enabled) {
            const code = this.getReferralCode();
            url += `?${this.config.referral.param || 'ref'}=${code}`;
        }

        return url;
    },

    getReferralCode() {
        if (this.config.referral.code) {
            return this.config.referral.code;
        }

        // Generate or retrieve from localStorage
        let code = localStorage.getItem('shabrang_referral_code');
        if (!code) {
            const prefix = this.config.referral.prefix || 'REF';
            code = `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            localStorage.setItem('shabrang_referral_code', code);
        }
        return code;
    },

    // =========================================================================
    // UTILITY
    // =========================================================================

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 10);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    trackShare(platform) {
        // Analytics event
        if (typeof gtag === 'function') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'quote',
                item_id: this.getChapterName()
            });
        }

        // Custom event for other tracking
        window.dispatchEvent(new CustomEvent('shabrang:share', {
            detail: {
                platform,
                text: this.state.selectedText,
                chapter: this.getChapterName()
            }
        }));
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 's' to share selection
            if (e.key === 's' && !e.ctrlKey && !e.metaKey && !this.state.modalOpen) {
                const selection = window.getSelection().toString().trim();
                if (selection.length > 10) {
                    this.state.selectedText = selection;
                    this.openModal();
                }
            }

            // Escape to close modal
            if (e.key === 'Escape' && this.state.modalOpen) {
                this.closeModal();
            }
        });
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    const config = window.ShabrangViralConfig || {};
    ShabrangViral.init(config);
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShabrangViral;
}
