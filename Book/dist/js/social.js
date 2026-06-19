/**
 * Shabrang Engine - Social.js
 * Social reading features: comments, highlights, annotations
 */

document.addEventListener('DOMContentLoaded', () => {
    initHighlights();
    initAnnotations();
    initReadingProgress();
});

// =============================================================================
// HIGHLIGHTS
// =============================================================================

const HIGHLIGHTS_KEY = 'shabrang_highlights';

function initHighlights() {
    // Load saved highlights
    const highlights = getHighlights();
    applyHighlights(highlights);

    // Listen for text selection
    document.addEventListener('mouseup', handleTextSelection);
}

function getHighlights() {
    const chapterId = document.body.dataset.chapter || window.location.pathname;
    const stored = localStorage.getItem(HIGHLIGHTS_KEY);
    const all = stored ? JSON.parse(stored) : {};
    return all[chapterId] || [];
}

function saveHighlight(highlight) {
    const chapterId = document.body.dataset.chapter || window.location.pathname;
    const stored = localStorage.getItem(HIGHLIGHTS_KEY);
    const all = stored ? JSON.parse(stored) : {};

    if (!all[chapterId]) all[chapterId] = [];
    all[chapterId].push(highlight);

    localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(all));
}

function removeHighlight(id) {
    const chapterId = document.body.dataset.chapter || window.location.pathname;
    const stored = localStorage.getItem(HIGHLIGHTS_KEY);
    const all = stored ? JSON.parse(stored) : {};

    if (all[chapterId]) {
        all[chapterId] = all[chapterId].filter(h => h.id !== id);
        localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(all));
    }
}

function applyHighlights(highlights) {
    highlights.forEach(h => {
        // Find the text range and apply highlight
        const walker = document.createTreeWalker(
            document.querySelector('.chapter-content'),
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(h.text.substring(0, 50))) {
                const mark = document.createElement('mark');
                mark.className = 'user-highlight';
                mark.dataset.highlightId = h.id;
                mark.title = h.note || 'Click to remove';

                // Wrap the text (simplified - real implementation needs range handling)
                const range = document.createRange();
                const idx = node.textContent.indexOf(h.text.substring(0, 50));
                if (idx >= 0) {
                    range.setStart(node, idx);
                    range.setEnd(node, Math.min(idx + h.text.length, node.textContent.length));
                    try {
                        range.surroundContents(mark);
                    } catch(e) {
                        // Cross-element selection, skip
                    }
                }
                break;
            }
        }
    });

    // Click to remove
    document.querySelectorAll('.user-highlight').forEach(mark => {
        mark.addEventListener('click', () => {
            if (confirm('Remove this highlight?')) {
                removeHighlight(mark.dataset.highlightId);
                mark.replaceWith(mark.textContent);
            }
        });
    });
}

function handleTextSelection() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().trim().length < 10) return;

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);

    // Check if selection is within chapter content
    const content = document.querySelector('.chapter-content');
    if (!content || !content.contains(range.commonAncestorContainer)) return;

    // Show highlight option (integrated with viral.js share button)
    // For now, just log - the viral.js handles the UI
}

// =============================================================================
// ANNOTATIONS
// =============================================================================

const ANNOTATIONS_KEY = 'shabrang_annotations';

function initAnnotations() {
    // Create annotation sidebar toggle
    const toggle = document.createElement('button');
    toggle.className = 'annotations-toggle';
    toggle.innerHTML = '&#128221;'; // Memo emoji
    toggle.title = 'My Notes';
    toggle.setAttribute('aria-label', 'Toggle annotations panel');

    toggle.addEventListener('click', toggleAnnotationsPanel);
    document.body.appendChild(toggle);
}

function toggleAnnotationsPanel() {
    let panel = document.querySelector('.annotations-panel');

    if (panel) {
        panel.classList.toggle('open');
        return;
    }

    // Create panel
    panel = document.createElement('div');
    panel.className = 'annotations-panel';

    const annotations = getAnnotations();
    const chapterId = document.body.dataset.chapter || window.location.pathname;
    const chapterAnnotations = annotations[chapterId] || [];

    panel.innerHTML = `
        <div class="annotations-header">
            <h3>My Notes</h3>
            <button class="annotations-close" aria-label="Close">&times;</button>
        </div>
        <div class="annotations-list">
            ${chapterAnnotations.length ? chapterAnnotations.map(a => `
                <div class="annotation-item" data-id="${a.id}">
                    <div class="annotation-quote">"${a.quote.substring(0, 100)}..."</div>
                    <div class="annotation-note">${a.note}</div>
                    <div class="annotation-date">${new Date(a.date).toLocaleDateString()}</div>
                </div>
            `).join('') : '<p class="no-annotations">No notes yet. Highlight text to add notes.</p>'}
        </div>
    `;

    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('open'));

    panel.querySelector('.annotations-close').addEventListener('click', () => {
        panel.classList.remove('open');
    });
}

function getAnnotations() {
    const stored = localStorage.getItem(ANNOTATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
}

function saveAnnotation(quote, note) {
    const chapterId = document.body.dataset.chapter || window.location.pathname;
    const annotations = getAnnotations();

    if (!annotations[chapterId]) annotations[chapterId] = [];

    annotations[chapterId].push({
        id: Date.now().toString(),
        quote,
        note,
        date: new Date().toISOString()
    });

    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
}

// =============================================================================
// READING PROGRESS SYNC
// =============================================================================

function initReadingProgress() {
    const config = window.ShabrangConfig || {};
    if (!config.syncProgress) return;

    // Sync with GHL or custom backend
    const userId = getUserId();
    if (!userId) return;

    // Load server progress
    loadServerProgress(userId);

    // Save progress periodically
    let lastSave = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastSave > 10000) { // Every 10 seconds
            saveServerProgress(userId);
            lastSave = now;
        }
    });

    // Save on page leave
    window.addEventListener('beforeunload', () => {
        saveServerProgress(userId);
    });
}

function getUserId() {
    // Check for GHL contact ID or custom auth
    return localStorage.getItem('shabrang_user_id') ||
           window.ShabrangConfig?.userId ||
           null;
}

async function loadServerProgress(userId) {
    // Placeholder for API call
    // const response = await fetch(`/api/progress/${userId}`);
    // const data = await response.json();
    // Apply reading position
}

async function saveServerProgress(userId) {
    const chapterId = document.body.dataset.chapter || window.location.pathname;
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

    // Placeholder for API call
    // await fetch('/api/progress', {
    //     method: 'POST',
    //     body: JSON.stringify({ userId, chapterId, scrollPercent })
    // });

    // For now, just save locally
    const progress = JSON.parse(localStorage.getItem('shabrang_progress') || '{}');
    progress[chapterId] = { scrollPercent, lastRead: Date.now() };
    localStorage.setItem('shabrang_progress', JSON.stringify(progress));
}

// =============================================================================
// EXPORT
// =============================================================================

window.ShabrangSocial = {
    saveHighlight,
    removeHighlight,
    saveAnnotation,
    getAnnotations,
    getUserId
};
