/*
 * Shabrang Auth - Premium access gating
 */

(function () {
    const ShabrangAuth = {
        apiValidateUrl: '/api/ghl/validate',
        apiChapterUrl: '/api/book/chapter',
        apiResendUrl: '/api/ghl/resend',
        sessionKey: 'shabrang_session',
        sessionDays: 30,

        getSession() {
            try {
                const raw = localStorage.getItem(this.sessionKey);
                if (!raw) return null;
                const session = JSON.parse(raw);
                if (!session.expiresAt) return session;
                if (new Date(session.expiresAt) < new Date()) {
                    this.clearSession();
                    return null;
                }
                return session;
            } catch (err) {
                return null;
            }
        },

        saveSession(data) {
            const expiresAt = new Date(Date.now() + this.sessionDays * 24 * 60 * 60 * 1000);
            const session = {
                token: data.token,
                name: data.name || 'Reader',
                email: data.email || null,
                accessLevel: data.accessLevel || 'premium',
                validatedAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString()
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            document.body.classList.add('is-authenticated');
        },

        clearSession() {
            localStorage.removeItem(this.sessionKey);
            document.body.classList.remove('is-authenticated');
        },

        getTokenFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('token');
        },

        clearTokenFromUrl() {
            const url = new URL(window.location.href);
            if (url.searchParams.has('token')) {
                url.searchParams.delete('token');
                window.history.replaceState({}, '', url.toString());
            }
        },

        getChapterNumber() {
            const dataChapter = document.body?.dataset?.chapter || '';
            if (dataChapter.startsWith('chapter')) {
                return parseInt(dataChapter.replace('chapter', ''), 10);
            }
            const match = window.location.pathname.match(/chapter(\d+)\.html/);
            return match ? parseInt(match[1], 10) : null;
        },

        async validateToken(token) {
            const response = await fetch(this.apiValidateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await response.json();
            if (!response.ok) {
                return { valid: false, error: data.error || 'Validation failed' };
            }
            return data;
        },

        async unlockWithToken(token) {
            if (!token) return { valid: false, error: 'No token provided' };
            const data = await this.validateToken(token);
            if (data.valid) {
                this.saveSession({
                    token,
                    name: data.name,
                    email: data.email,
                    accessLevel: 'premium'
                });
                this.clearTokenFromUrl();
            }
            return data;
        },

        async loadPremiumContent() {
            const chapterNum = this.getChapterNumber();
            if (!chapterNum) return;
            const session = this.getSession();
            if (!session) return;

            const url = `${this.apiChapterUrl}/${chapterNum}?token=${encodeURIComponent(session.token)}`;
            const response = await fetch(url);
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            if (!data.html) return;

            const previewContent = document.querySelector('.preview-content');
            const article = document.querySelector('.chapter-content');
            const paywall = document.querySelector('.paywall-section');
            const fade = document.querySelector('.preview-fade');

            if (previewContent) {
                previewContent.innerHTML = data.html;
            }
            if (article) {
                article.classList.remove('chapter-preview');
            }
            if (fade) {
                fade.remove();
            }
            if (paywall) {
                paywall.remove();
            }

            document.body.classList.add('is-authenticated');

            if (window.ShabrangBook && window.ShabrangBook.initDropcaps) {
                window.ShabrangBook.initDropcaps();
            }
            if (window.ShabrangBook && window.ShabrangBook.initImageLightbox) {
                window.ShabrangBook.initImageLightbox();
            }
        },

        showLoginModal() {
            if (document.querySelector('.login-modal')) return;
            const modal = document.createElement('div');
            modal.className = 'login-modal';
            modal.innerHTML = `
                <div class="login-modal-content">
                    <button class="login-close" aria-label="Close">&times;</button>
                    <h2>Access Your Purchase</h2>
                    <p>Enter the email you used to purchase:</p>
                    <input type="email" id="login-email" placeholder="you@example.com" />
                    <button id="login-submit" class="paywall-btn">Send Access Link</button>
                    <p class="login-note" id="login-status"></p>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.login-close').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            });

            const submit = modal.querySelector('#login-submit');
            submit.addEventListener('click', async () => {
                const email = modal.querySelector('#login-email').value.trim();
                const status = modal.querySelector('#login-status');
                if (!email) {
                    status.textContent = 'Please enter your email.';
                    return;
                }
                status.textContent = 'Sending access link...';
                try {
                    const response = await fetch(this.apiResendUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        status.textContent = 'Check your email for your access link.';
                    } else {
                        status.textContent = data.error || 'Unable to send link.';
                    }
                } catch (err) {
                    status.textContent = 'Unable to send link. Please try again.';
                }
            });
        },

        async init() {
            const tier = document.body?.dataset?.tier || '';
            if (tier !== 'premium') return;

            const tokenFromUrl = this.getTokenFromUrl();
            if (tokenFromUrl) {
                await this.unlockWithToken(tokenFromUrl);
            }

            const session = this.getSession();
            if (session) {
                await this.loadPremiumContent();
            }

            const loginLink = document.getElementById('login-link');
            if (loginLink) {
                loginLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.showLoginModal();
                });
            }
        },

        async initUnlockPage() {
            const statusEl = document.getElementById('unlock-status');
            if (!statusEl) return;
            const token = this.getTokenFromUrl();
            if (!token) {
                statusEl.innerHTML = '<p class="error">No access token found.</p>';
                return;
            }
            statusEl.innerHTML = '<p>Validating your access...</p>';
            const result = await this.unlockWithToken(token);
            if (result.valid) {
                statusEl.innerHTML = '<p class="success">Access verified. You can return to the book.</p>';
            } else {
                statusEl.innerHTML = `<p class="error">${result.error || 'Access could not be verified.'}</p>`;
            }
        }
    };

    window.ShabrangAuth = ShabrangAuth;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body?.dataset?.page === 'unlock') {
            ShabrangAuth.initUnlockPage();
        } else {
            ShabrangAuth.init();
        }
    });
})();
