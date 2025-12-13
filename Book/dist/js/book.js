/**
 * Shabrang Engine - Book.js
 * Core book functionality: language switcher, navigation, and utilities
 */

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initKeyboardNavigation();
    initImageLightbox();
    initDropcaps();
});

// =============================================================================
// LANGUAGE SWITCHER
// =============================================================================

function initLanguageSwitcher() {
    const config = window.ShabrangConfig || {};
    if (config.languages === false) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';

    const currentLang = localStorage.getItem('shabrang_lang') || 'en';

    switcher.innerHTML = `
        <select id="langSelect" aria-label="Select language">
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
            <option value="fa" ${currentLang === 'fa' ? 'selected' : ''}>فارسی</option>
        </select>
    `;

    document.body.appendChild(switcher);
    applyLanguage(currentLang);

    document.getElementById('langSelect').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}

function changeLanguage(lang) {
    localStorage.setItem('shabrang_lang', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const contentContainer = document.querySelector('.container');
    const warningId = 'lang-warning';
    let warning = document.getElementById(warningId);

    if (lang !== 'en') {
        if (!warning) {
            warning = document.createElement('div');
            warning.id = warningId;
            warning.className = 'lang-warning';
            contentContainer?.prepend(warning);
        }

        const messages = {
            'fa': 'ترجمه فارسی به زودی ارائه می‌شود.',
            'fr': 'La traduction française arrive bientôt.',
            'es': 'La traducción al español llegará pronto.',
            'de': 'Die deutsche Übersetzung kommt bald.'
        };
        warning.textContent = messages[lang] || 'Translation coming soon.';

        // Set RTL for Persian/Arabic
        if (lang === 'fa' || lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = lang;
        }
    } else {
        if (warning) warning.remove();
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
    }
}

// =============================================================================
// KEYBOARD NAVIGATION
// =============================================================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const prevLink = document.querySelector('a[title="Previous Chapter"]') ||
                        document.querySelector('.nav-btn[href*="chapter"]');
        const nextLink = document.querySelector('a[title="Next Chapter"]') ||
                        document.querySelectorAll('.nav-btn[href*="chapter"]')[1];

        switch(e.key) {
            case 'ArrowLeft':
                if (prevLink && !document.documentElement.dir === 'rtl') {
                    window.location.href = prevLink.href;
                } else if (nextLink && document.documentElement.dir === 'rtl') {
                    window.location.href = nextLink.href;
                }
                break;
            case 'ArrowRight':
                if (nextLink && !document.documentElement.dir === 'rtl') {
                    window.location.href = nextLink.href;
                } else if (prevLink && document.documentElement.dir === 'rtl') {
                    window.location.href = prevLink.href;
                }
                break;
            case 'Home':
                if (e.ctrlKey || e.metaKey) {
                    window.location.href = 'index.html';
                }
                break;
        }
    });
}

// =============================================================================
// IMAGE LIGHTBOX
// =============================================================================

function initImageLightbox() {
    const images = document.querySelectorAll('.chapter-content img, .img-container img');

    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(img));
    });
}

function openLightbox(img) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <img src="${img.src}" alt="${img.alt}">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            ${img.alt ? `<div class="lightbox-caption">${img.alt}</div>` : ''}
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    // Close handlers
    const close = () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 300);
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
            close();
        }
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// =============================================================================
// DROPCAPS ENHANCEMENT
// =============================================================================

function initDropcaps() {
    // Add decorative touch to dropcaps on hover
    const dropcaps = document.querySelectorAll('.dropcap');
    dropcaps.forEach(dc => {
        dc.setAttribute('data-letter', dc.textContent);
    });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle helper
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Expose to global scope
window.ShabrangBook = {
    changeLanguage,
    openLightbox,
    debounce,
    throttle
};
