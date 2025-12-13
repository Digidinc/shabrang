/**
 * usage: <script src="book.js"></script>
 * Adds a floating language switcher to the page.
 */

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initSlideshows();
});

function initLanguageSwitcher() {
    // 1. Create the UI
    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';

    // Check local storage
    const currentLang = localStorage.getItem('frc_lang') || 'en';

    switcher.innerHTML = `
        <select id="langSelect" onchange="changeLanguage(this.value)">
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
            <option value="fa" ${currentLang === 'fa' ? 'selected' : ''}>فارسی (Persian)</option>
            <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français (French)</option>
        </select>
    `;

    document.body.appendChild(switcher);

    // 2. Apply initial state
    applyLanguage(currentLang);
}

function changeLanguage(lang) {
    localStorage.setItem('frc_lang', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    // In a full implementation, this would load JSON or toggle visibility of DOM elements.
    // For now, since we only have English text, we verify the capability.

    const contentContainer = document.querySelector('.container');
    const warningId = 'lang-warning';
    let warning = document.getElementById(warningId);

    if (lang !== 'en') {
        if (!warning) {
            warning = document.createElement('div');
            warning.id = warningId;
            warning.style.padding = '10px';
            warning.style.background = 'var(--crimson)';
            warning.style.color = 'white';
            warning.style.textAlign = 'center';
            warning.style.marginBottom = '20px';
            warning.style.borderRadius = '8px';
            contentContainer.prepend(warning);
        }

        const msg = lang === 'fa' ? 'ترجمه فارسی به زودی ارائه می‌شود.' : 'La traduction française arrive bientôt.';
        warning.innerText = msg;

        // Example of structural readiness:
        // document.documentElement.lang = lang;
        // if (lang === 'fa') document.body.dir = 'rtl';
        // else document.body.dir = 'ltr';

    } else {
        if (warning) warning.remove();
        // document.body.dir = 'ltr';
    }

    console.log(`Language set to: ${lang}`);
}

function initSlideshows() {
    // Placeholder for future slideshow logic if not using a separate class file
}
