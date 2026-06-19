/**
 * Shabrang Engine - TTS.js
 * Text-to-Speech integration with Web Speech API and ElevenLabs
 */

document.addEventListener('DOMContentLoaded', () => {
    initTTS();
});

// =============================================================================
// TTS CONTROLLER
// =============================================================================

class TTSController {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.currentParagraph = 0;
        this.paragraphs = [];
        this.rate = parseFloat(localStorage.getItem('shabrang_tts_rate') || '1');
        this.voice = null;
        this.audioMode = 'browser'; // 'browser' or 'elevenlabs'
        this.audioElement = null;
    }

    init() {
        this.paragraphs = Array.from(document.querySelectorAll('.chapter-content p, .chapter-content h2, .chapter-content h3, .chapter-content blockquote'))
            .filter(p => p.textContent.trim().length > 0);

        if (this.paragraphs.length === 0) return;

        this.createUI();
        this.loadVoices();
    }

    createUI() {
        const controls = document.createElement('div');
        controls.className = 'tts-controls';
        controls.innerHTML = `
            <button class="tts-btn tts-play" aria-label="Play" title="Read aloud">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </button>
            <button class="tts-btn tts-pause" aria-label="Pause" title="Pause" style="display:none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            </button>
            <button class="tts-btn tts-stop" aria-label="Stop" title="Stop" style="display:none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h12v12H6z"/>
                </svg>
            </button>
            <div class="tts-speed">
                <button class="tts-speed-btn" data-speed="0.75">0.75x</button>
                <button class="tts-speed-btn active" data-speed="1">1x</button>
                <button class="tts-speed-btn" data-speed="1.25">1.25x</button>
                <button class="tts-speed-btn" data-speed="1.5">1.5x</button>
            </div>
        `;

        // Insert after sticky header or at top of container
        const header = document.querySelector('.sticky-header');
        if (header) {
            header.after(controls);
        } else {
            document.querySelector('.container')?.prepend(controls);
        }

        // Event listeners
        controls.querySelector('.tts-play').addEventListener('click', () => this.play());
        controls.querySelector('.tts-pause').addEventListener('click', () => this.pause());
        controls.querySelector('.tts-stop').addEventListener('click', () => this.stop());

        controls.querySelectorAll('.tts-speed-btn').forEach(btn => {
            if (parseFloat(btn.dataset.speed) === this.rate) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                controls.querySelectorAll('.tts-speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setRate(parseFloat(btn.dataset.speed));
            });
        });

        this.controls = controls;
    }

    loadVoices() {
        if (!window.speechSynthesis) return;

        const setVoice = () => {
            const voices = speechSynthesis.getVoices();
            // Prefer high-quality English voices
            this.voice = voices.find(v => v.name.includes('Samantha')) ||
                        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0];
        };

        setVoice();
        speechSynthesis.onvoiceschanged = setVoice;
    }

    play() {
        if (this.isPaused && this.currentUtterance) {
            speechSynthesis.resume();
            this.isPaused = false;
            this.updateUI();
            return;
        }

        if (this.isPlaying) return;

        this.isPlaying = true;
        this.speakParagraph(this.currentParagraph);
        this.updateUI();
    }

    pause() {
        if (!this.isPlaying) return;
        speechSynthesis.pause();
        this.isPaused = true;
        this.updateUI();
    }

    stop() {
        speechSynthesis.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentParagraph = 0;
        this.clearHighlight();
        this.updateUI();
    }

    setRate(rate) {
        this.rate = rate;
        localStorage.setItem('shabrang_tts_rate', rate.toString());

        if (this.isPlaying) {
            // Restart from current paragraph with new rate
            const wasPlaying = this.isPlaying;
            this.stop();
            if (wasPlaying) {
                this.play();
            }
        }
    }

    speakParagraph(index) {
        if (index >= this.paragraphs.length) {
            this.stop();
            return;
        }

        const paragraph = this.paragraphs[index];
        const text = paragraph.textContent.trim();

        // Highlight current paragraph
        this.clearHighlight();
        paragraph.classList.add('tts-speaking');
        paragraph.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = 1;

        utterance.onend = () => {
            this.currentParagraph++;
            if (this.isPlaying && !this.isPaused) {
                this.speakParagraph(this.currentParagraph);
            }
        };

        utterance.onerror = (event) => {
            console.error('TTS Error:', event);
            this.stop();
        };

        this.currentUtterance = utterance;
        speechSynthesis.speak(utterance);
    }

    clearHighlight() {
        document.querySelectorAll('.tts-speaking').forEach(el => {
            el.classList.remove('tts-speaking');
        });
    }

    updateUI() {
        if (!this.controls) return;

        const playBtn = this.controls.querySelector('.tts-play');
        const pauseBtn = this.controls.querySelector('.tts-pause');
        const stopBtn = this.controls.querySelector('.tts-stop');

        if (this.isPlaying && !this.isPaused) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
            stopBtn.style.display = 'flex';
        } else if (this.isPaused) {
            playBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'flex';
        } else {
            playBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'none';
        }
    }
}

// =============================================================================
// ELEVENLABS INTEGRATION (Premium)
// =============================================================================

class ElevenLabsTTS extends TTSController {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        this.audioMode = 'elevenlabs';
        this.voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Default voice (Sarah)
    }

    async speakParagraph(index) {
        if (index >= this.paragraphs.length) {
            this.stop();
            return;
        }

        const paragraph = this.paragraphs[index];
        const text = paragraph.textContent.trim();

        this.clearHighlight();
        paragraph.classList.add('tts-speaking');
        paragraph.scrollIntoView({ behavior: 'smooth', block: 'center' });

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            if (this.audioElement) {
                this.audioElement.pause();
            }

            this.audioElement = new Audio(audioUrl);
            this.audioElement.playbackRate = this.rate;

            this.audioElement.onended = () => {
                this.currentParagraph++;
                if (this.isPlaying && !this.isPaused) {
                    this.speakParagraph(this.currentParagraph);
                }
            };

            this.audioElement.play();

        } catch (error) {
            console.error('ElevenLabs TTS Error:', error);
            // Fallback to browser TTS
            super.speakParagraph(index);
        }
    }

    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
        }
        this.isPaused = true;
        this.updateUI();
    }

    play() {
        if (this.isPaused && this.audioElement) {
            this.audioElement.play();
            this.isPaused = false;
            this.updateUI();
            return;
        }
        super.play();
    }

    stop() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        super.stop();
    }

    setRate(rate) {
        this.rate = rate;
        localStorage.setItem('shabrang_tts_rate', rate.toString());
        if (this.audioElement) {
            this.audioElement.playbackRate = rate;
        }
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

function initTTS() {
    const config = window.ShabrangConfig || {};

    // Check if TTS is enabled
    if (config.tts === false) return;

    // Check for Web Speech API support
    if (!window.speechSynthesis) {
        console.warn('Web Speech API not supported');
        return;
    }

    // Use ElevenLabs if API key provided
    if (config.elevenLabsKey) {
        const tts = new ElevenLabsTTS(config.elevenLabsKey);
        tts.init();
        window.ShabrangTTS = tts;
    } else {
        const tts = new TTSController();
        tts.init();
        window.ShabrangTTS = tts;
    }
}

// Expose for external use
window.initTTS = initTTS;
