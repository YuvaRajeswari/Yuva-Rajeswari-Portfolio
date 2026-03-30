// ===== OPTIMIZED NEURAL NETWORK PARTICLE BACKGROUND =====
class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 120; // Reduced particle count
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        const maxDist = 150;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.25;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
        
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinks = document.getElementById('nav-links');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
        
        this.mobileMenuBtn.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
        });
        
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
            });
        });
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// ===== TILT EFFECT (SIMPLIFIED) =====
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .skill-card, .cert-card, .education-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease';
            });
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
            });
        });
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = element.textContent;
        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        const suffix = target.replace(num, '');
        let current = 0;
        const inc = num / 40;
        const timer = setInterval(() => {
            current += inc;
            if (current >= num) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 40);
    }
}

// ===== SIMPLE CURSOR (PERFORMANCE OPTIMIZED) =====
class SimpleCursor {
    constructor() {
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            this.dot = document.createElement('div');
            this.dot.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #6366f1, #ec4899);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease;
            `;
            document.body.appendChild(this.dot);
            
            document.addEventListener('mousemove', (e) => {
                this.dot.style.left = e.clientX + 'px';
                this.dot.style.top = e.clientY + 'px';
            });
        }
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);
    
    // Initialize canvas
    const canvas = document.getElementById('bg-canvas');
    if (canvas) new ParticleBackground(canvas);
    
    // Initialize effects
    new ScrollAnimations();
    new Navigation();
    new TiltEffect();
    new CounterAnimation();
    new SimpleCursor();
});
