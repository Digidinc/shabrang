/**
 * Shabrang Experience Engine
 * Makes reading immersive for GenZ
 *
 * Features:
 * - Reading progress tracking
 * - Ambient mode (background audio, atmosphere)
 * - Theme switching (light/dark/sepia)
 * - Scroll animations
 * - Keyboard navigation
 * - Reading time estimation
 */

const ShabrangExperience = {
    config: {
        ambient: true,
        progress: true,
        animations: true,
        savePosition: true,
        readingSpeed: 200 // words per minute
    },

    state: {
        scrollPercent: 0,
        ambientPlaying: false,
        currentTheme: 'light',
        readingStartTime: null,
        totalReadTime: 0
    },

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    init(userConfig = {}) {
        this.config = { ...this.config, ...userConfig };

        this.setupProgressBar();
        this.setupAmbientMode();
        this.setupThemeSwitcher();
        this.setupScrollAnimations();
        this.setupKeyboardNav();
        this.setupReadingTime();
        this.restorePosition();
        this.trackReadingSession();

        console.log('[Shabrang] Experience engine initialized');
    },

    // =========================================================================
    // READING PROGRESS
    // =========================================================================

    setupProgressBar() {
        if (!this.config.progress) return;

        // Create progress bar if not exists
        if (!document.getElementById('reading-progress')) {
            const bar = document.createElement('div');
            bar.id = 'reading-progress';
            bar.innerHTML = `
                <div class="progress-fill"></div>
                <div class="progress-text">0%</div>
            `;
            document.body.prepend(bar);
        }

        // Update on scroll
        window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
        this.updateProgress();
    },

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = Math.round((scrollTop / docHeight) * 100);

        this.state.scrollPercent = percent;

        const fill = document.querySelector('.progress-fill');
        const text = document.querySelector('.progress-text');

        if (fill) fill.style.width = `${percent}%`;
        if (text) text.textContent = `${percent}%`;

        // Save position
        if (this.config.savePosition) {
            this.savePosition();
        }
    },

    savePosition() {
        const chapterId = document.body.dataset.chapter || 'unknown';
        localStorage.setItem(`shabrang_position_${chapterId}`, window.scrollY);
    },

    restorePosition() {
        if (!this.config.savePosition) return;

        const chapterId = document.body.dataset.chapter || 'unknown';
        const saved = localStorage.getItem(`shabrang_position_${chapterId}`);

        if (saved && parseInt(saved) > 100) {
            // Show restore prompt
            this.showRestorePrompt(parseInt(saved));
        }
    },

    showRestorePrompt(position) {
        const prompt = document.createElement('div');
        prompt.className = 'restore-prompt glass-panel animate-slide-up';
        prompt.innerHTML = `
            <p>Continue where you left off?</p>
            <div class="restore-actions">
                <button class="btn-restore">Continue</button>
                <button class="btn-start-over">Start Over</button>
            </div>
        `;
        document.body.appendChild(prompt);

        prompt.querySelector('.btn-restore').onclick = () => {
            window.scrollTo({ top: position, behavior: 'smooth' });
            prompt.remove();
        };

        prompt.querySelector('.btn-start-over').onclick = () => {
            prompt.remove();
        };

        // Auto-dismiss after 5 seconds
        setTimeout(() => prompt.remove(), 5000);
    },

    // =========================================================================
    // AMBIENT MODE
    // =========================================================================

    setupAmbientMode() {
        if (!this.config.ambient) return;

        // Create ambient controls
        const controls = document.createElement('div');
        controls.id = 'ambient-controls';
        controls.innerHTML = `
            <button id="ambient-toggle" class="ambient-btn" title="Toggle Ambient Mode">
                <span class="icon-ambient">&#9835;</span>
            </button>
            <div id="ambient-panel" class="ambient-panel hidden">
                <div class="ambient-option">
                    <label>Background Music</label>
                    <input type="range" id="ambient-volume" min="0" max="100" value="30">
                </div>
                <div class="ambient-option">
                    <label>Atmosphere</label>
                    <select id="ambient-type">
                        <option value="none">None</option>
                        <option value="rain">Rain</option>
                        <option value="fire">Fireplace</option>
                        <option value="wind">Desert Wind</option>
                        <option value="night">Night</option>
                    </select>
                </div>
            </div>
        `;
        document.body.appendChild(controls);

        // Toggle panel
        document.getElementById('ambient-toggle').onclick = () => {
            document.getElementById('ambient-panel').classList.toggle('hidden');
        };

        // Volume control
        document.getElementById('ambient-volume').oninput = (e) => {
            this.setAmbientVolume(e.target.value / 100);
        };

        // Atmosphere type
        document.getElementById('ambient-type').onchange = (e) => {
            this.setAtmosphere(e.target.value);
        };

        // Create audio element
        this.ambientAudio = document.createElement('audio');
        this.ambientAudio.loop = true;
        this.ambientAudio.volume = 0.3;
    },

    setAmbientVolume(vol) {
        if (this.ambientAudio) {
            this.ambientAudio.volume = vol;
        }
    },

    setAtmosphere(type) {
        const sounds = {
            none: null,
            rain: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
            fire: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
            wind: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-in-the-desert-2720.mp3',
            night: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-1210.mp3'
        };

        if (type === 'none') {
            this.ambientAudio.pause();
            this.state.ambientPlaying = false;
        } else if (sounds[type]) {
            this.ambientAudio.src = sounds[type];
            this.ambientAudio.play().catch(() => {
                console.log('[Shabrang] Audio autoplay blocked - user interaction required');
            });
            this.state.ambientPlaying = true;
        }
    },

    // =========================================================================
    // THEME SWITCHING
    // =========================================================================

    setupThemeSwitcher() {
        // Create theme toggle
        const toggle = document.createElement('div');
        toggle.id = 'theme-switcher';
        toggle.innerHTML = `
            <button data-theme="light" class="theme-btn active" title="Light">&#9788;</button>
            <button data-theme="dark" class="theme-btn" title="Dark">&#9790;</button>
            <button data-theme="sepia" class="theme-btn" title="Sepia">&#9997;</button>
        `;
        document.body.appendChild(toggle);

        // Event listeners
        toggle.querySelectorAll('.theme-btn').forEach(btn => {
            btn.onclick = () => this.setTheme(btn.dataset.theme);
        });

        // Restore saved theme
        const saved = localStorage.getItem('shabrang_theme');
        if (saved) this.setTheme(saved);
    },

    setTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
        document.body.classList.add(`theme-${theme}`);

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        this.state.currentTheme = theme;
        localStorage.setItem('shabrang_theme', theme);
    },

    // =========================================================================
    // SCROLL ANIMATIONS
    // =========================================================================

    setupScrollAnimations() {
        if (!this.config.animations) return;

        // Add reveal class to paragraphs and images
        document.querySelectorAll('p, .img-container, h2, blockquote').forEach((el, i) => {
            el.classList.add('scroll-reveal');
            el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
        });

        // Intersection Observer for reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    },

    // =========================================================================
    // KEYBOARD NAVIGATION
    // =========================================================================

    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Arrow keys for prev/next chapter
            if (e.key === 'ArrowLeft' && e.altKey) {
                const prev = document.querySelector('.nav-btn[href*="prev"], .nav-btn:first-child');
                if (prev) prev.click();
            }
            if (e.key === 'ArrowRight' && e.altKey) {
                const next = document.querySelector('.nav-btn[href*="next"], .nav-btn:last-child');
                if (next) next.click();
            }

            // 't' for theme toggle
            if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
                const themes = ['light', 'dark', 'sepia'];
                const current = themes.indexOf(this.state.currentTheme);
                const next = themes[(current + 1) % themes.length];
                this.setTheme(next);
            }

            // 'a' for ambient toggle
            if (e.key === 'a' && !e.ctrlKey && !e.metaKey) {
                document.getElementById('ambient-panel')?.classList.toggle('hidden');
            }

            // 'Escape' to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-visible, .panel:not(.hidden)').forEach(el => {
                    el.classList.add('hidden');
                    el.classList.remove('modal-visible');
                });
            }
        });
    },

    // =========================================================================
    // READING TIME
    // =========================================================================

    setupReadingTime() {
        // Calculate reading time
        const text = document.querySelector('.container')?.innerText || '';
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / this.config.readingSpeed);

        // Display reading time
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'reading-time';
        timeDisplay.innerHTML = `<span>${minutes} min read</span>`;

        const h1 = document.querySelector('h1');
        if (h1) h1.after(timeDisplay);
    },

    trackReadingSession() {
        this.state.readingStartTime = Date.now();

        // Save reading time on page leave
        window.addEventListener('beforeunload', () => {
            const duration = Math.round((Date.now() - this.state.readingStartTime) / 1000);
            const chapterId = document.body.dataset.chapter || 'unknown';

            // Get existing time
            const existing = parseInt(localStorage.getItem(`shabrang_time_${chapterId}`)) || 0;
            localStorage.setItem(`shabrang_time_${chapterId}`, existing + duration);
        });
    },

    // =========================================================================
    // UTILITY
    // =========================================================================

    getReadingStats() {
        const stats = {
            totalChaptersRead: 0,
            totalTimeSpent: 0,
            lastRead: null
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('shabrang_time_')) {
                stats.totalChaptersRead++;
                stats.totalTimeSpent += parseInt(localStorage.getItem(key)) || 0;
            }
            if (key.startsWith('shabrang_position_')) {
                stats.lastRead = key.replace('shabrang_position_', '');
            }
        }

        return stats;
    }
};

// Auto-initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Get config from page data attributes or window
    const config = window.ShabrangConfig || {};
    ShabrangExperience.init(config);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShabrangExperience;
}
