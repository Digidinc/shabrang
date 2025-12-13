// Simple Infographic Slideshow logic
class FRC_Slideshow {
    constructor(elementId, images) {
        this.container = document.getElementById(elementId);
        this.images = images;
        this.currentIndex = 0;
        
        this.render();
        this.attachEvents();
    }

    render() {
        // Clear container
        this.container.innerHTML = '';
        
        // Image Element
        const img = document.createElement('img');
        img.src = this.images[this.currentIndex].src;
        img.alt = this.images[this.currentIndex].caption;
        img.className = 'slide-image';
        
        // Caption
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.innerText = this.images[this.currentIndex].caption;
        
        // Controls
        const controls = document.createElement('div');
        controls.className = 'slide-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerText = '←';
        prevBtn.onclick = () => this.prev();
        
        const nextBtn = document.createElement('button');
        nextBtn.innerText = '→';
        nextBtn.onclick = () => this.next();
        
        const counter = document.createElement('span');
        counter.innerText = `${this.currentIndex + 1} / ${this.images.length}`;
        
        controls.appendChild(prevBtn);
        controls.appendChild(counter);
        controls.appendChild(nextBtn);
        
        this.container.appendChild(img);
        this.container.appendChild(caption);
        this.container.appendChild(controls);
    }
    
    attachEvents() {
        // Add style dynamically
        const style = document.createElement('style');
        style.textContent = `
            .slide-controls {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 10px;
                font-family: sans-serif;
            }
            .slide-controls button {
                background: var(--teal);
                color: #fff;
                border: none;
                padding: 5px 15px;
                cursor: pointer;
                border-radius: 4px;
            }
            .slide-controls button:hover {
                background: var(--gold);
            }
        `;
        document.head.appendChild(style);
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.render();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.render();
    }
}
