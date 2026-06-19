/* ==========================================
   DOM REFERENCES
   ========================================== */
const entryScreen = document.getElementById('entry-screen');
const mainPage = document.getElementById('main-page');
const typingText = document.getElementById('typing-text');
const typingCursor = document.getElementById('typing-cursor');
const readySection = document.getElementById('ready-section');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const noMessage = document.getElementById('no-message');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const cakeWrapper = document.getElementById('cake-wrapper');
const wishText = document.getElementById('wish-text');
const wishCursor = document.getElementById('wish-cursor');
const heartsBtn = document.getElementById('hearts-btn');
const confettiBtn = document.getElementById('confetti-btn');
const sparkleBtn = document.getElementById('sparkle-btn');
const colorBtn = document.getElementById('color-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const galleryItems = document.querySelectorAll('.gallery-item');
const ctx = fireworksCanvas.getContext('2d');

/* ==========================================
   CONFIGURATION
   ========================================== */
const ENTRY_MESSAGE =
    'Dear Belinda, you are one of the most special people in my life. ' +
    'Your kindness, your laughter, and your beautiful spirit make every day brighter. ' +
    'Today is all about celebrating the wonderful person you are. ' +
    'I\'ve put together a little surprise just for you...';

const WISH_MESSAGE =
    'Happy Birthday, Belinda! 🎂\n\n' +
    'Today is all about celebrating the incredible person you are. ' +
    'Your smile lights up every room, your kindness touches every heart, ' +
    'and your friendship is one of life\'s greatest gifts.\n\n' +
    'On this special day, I want you to know how much you mean to me. ' +
    'You\'re not just a friend — you\'re a rare gem that makes every moment more precious.\n\n' +
    'May this year bring you all the joy, love, and magic you deserve. ' +
    'Here\'s to another year of amazing adventures, endless laughter, and dreams coming true.\n\n' +
    'With all my love and warmest wishes,\nHappy Birthday! ❤️🌸✨';

const NO_BUTTON_STATES = [
    { emoji: '🎂', message: 'The cake disagrees!' },
    { emoji: '💕', message: 'Your heart says otherwise...' },
    { emoji: '🎁', message: 'There are surprises waiting!' },
    { emoji: '✨', message: 'Magic only works if you say yes!' },
    { emoji: '🌸', message: 'Even the flowers want you to!' },
    { emoji: '💖', message: 'Come on, don\'t break my heart!' },
    { emoji: '🥺', message: 'Pretty please with a cherry on top?' },
    { emoji: '🎂', message: 'The candles are burning for you!' },
    { emoji: '💝', message: 'One little click, that\'s all...' },
    { emoji: '🦋', message: 'Butterflies are waiting!' },
    { emoji: '🌟', message: 'You\'re running out of options!' },
    { emoji: '🎉', message: 'This is getting silly — just say YES!' },
];

const FIREWORK_COLORS = [
    '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB',
    '#EE82EE', '#DA70D6', '#BA55D3', '#FF00FF',
    '#00CED1', '#40E0D0', '#7FFFD4', '#00FFFF',
];

const EFFECT_COLORS = [
    '#FF1493', '#FF69B4', '#EE82EE', '#DA70D6',
    '#00CED1', '#40E0D0', '#FFB6C1', '#FF00FF',
];

// FEATURE #1: Dynamic color palette for neon mode
const NEON_COLORS = [
    '#FF1493', '#FF10F0', '#00FFFF', '#00FF88',
    '#FFFF00', '#FF6600', '#FF0088', '#00FF00',
];

let currentGalleryIndex = 0;

/* ==========================================
   ENTRY SCREEN — TYPING EFFECT
   ========================================== */
let entryCharIndex = 0;

function typeEntryMessage() {
    if (entryCharIndex < ENTRY_MESSAGE.length) {
        typingText.textContent += ENTRY_MESSAGE.charAt(entryCharIndex);
        entryCharIndex++;
        const delay = ENTRY_MESSAGE.charAt(entryCharIndex - 1) === '.' ? 350 :
                      ENTRY_MESSAGE.charAt(entryCharIndex - 1) === ',' ? 180 : 32;
        setTimeout(typeEntryMessage, delay);
    } else {
        typingCursor.style.display = 'none';
        setTimeout(showReadySection, 500);
    }
}

function showReadySection() {
    readySection.classList.add('visible');
}

/* ==========================================
   ENTRY SCREEN — NO BUTTON TRICK
   ========================================== */
let noClickCount = 0;

noBtn.addEventListener('click', function () {
    if (noClickCount >= NO_BUTTON_STATES.length) {
        noClickCount = 0;
    }

    const state = NO_BUTTON_STATES[noClickCount];
    noBtn.textContent = state.emoji;
    noMessage.textContent = state.message;
    noMessage.style.opacity = '1';

    // Grow YES button to gently guide user
    const scale = 1 + noClickCount * 0.12;
    yesBtn.style.transform = `scale(${Math.min(scale, 1.8)})`;
    yesBtn.style.boxShadow = `0 4px ${20 + noClickCount * 6}px rgba(255, 20, 147, ${0.4 + noClickCount * 0.04})`;

    // Add shake animation
    noBtn.style.animation = 'none';
    setTimeout(() => {
        noBtn.style.animation = 'button-shake 0.3s ease-in-out';
    }, 10);

    noClickCount++;
});

/* ==========================================
   ENTRY SCREEN — YES BUTTON & PAGE TRANSITION
   ========================================== */
yesBtn.addEventListener('click', function () {
    entryScreen.classList.add('hidden');
    setTimeout(activateMainPage, 800);
});

function activateMainPage() {
    entryScreen.style.display = 'none';
    mainPage.classList.add('active');
    initFireworks();
    startWishTyping();
    initScrollReveal();
    initCandleBlowOut();
}

/* ==========================================
   ENTRY SCREEN — FLOATING PARTICLES
   ========================================== */
function createEntryParticles() {
    const container = document.getElementById('entry-particles');
    const count = 35;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'entry-particle';
        particle.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = (Math.random() * 8 + 7) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.setProperty('--drift', (Math.random() * 50 - 25) + 'px');
        container.appendChild(particle);
    }
}

/* ==========================================
   WISH SECTION — TYPEWRITER TEXT EFFECT
   ========================================== */
let wishCharIndex = 0;

function startWishTyping() {
    wishText.textContent = '';
    wishCharIndex = 0;
    wishCursor.style.display = 'inline-block';
    typeWishMessage();
}

function typeWishMessage() {
    if (wishCharIndex < WISH_MESSAGE.length) {
        const char = WISH_MESSAGE.charAt(wishCharIndex);
        if (char === '\n') {
            wishText.innerHTML += '<br>';
        } else {
            wishText.textContent += char;
        }
        wishCharIndex++;
        const delay = char === '.' ? 250 :
                      char === ',' ? 130 : 
                      char === '\n' ? 50 : 20;
        setTimeout(typeWishMessage, delay);
    } else {
        wishCursor.style.display = 'none';
    }
}

/* ==========================================
   FIREWORKS SYSTEM
   ========================================== */
let fireworks = [];
let fireworksRunning = false;

function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 0.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.014 + 0.006;
        this.size = Math.random() * 2.2 + 0.6;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.025;
        this.vx *= 0.99;
        this.alpha -= this.decay;
        this.size *= 0.995;
    }

    draw(context) {
        if (this.alpha <= 0) return;
        context.save();
        context.globalAlpha = Math.max(0, this.alpha);
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
}

class Firework {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1;
        this.y = canvasHeight;
        this.targetY = Math.random() * canvasHeight * 0.35 + canvasHeight * 0.08;
        this.vy = -(Math.random() * 2.5 + 3.5);
        this.color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        this.exploded = false;
        this.particles = [];
        this.trail = [];
    }

    update() {
        if (!this.exploded) {
            this.trail.push({ x: this.x, y: this.y, alpha: 0.8 });
            if (this.trail.length > 6) this.trail.shift();
            this.trail.forEach(function (t) { t.alpha -= 0.13; });

            this.y += this.vy;
            this.vy += 0.018;

            if (this.y <= this.targetY || this.vy >= 0) {
                this.explode();
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    explode() {
        this.exploded = true;
        const count = Math.floor(Math.random() * 35) + 25;
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    draw(context) {
        if (!this.exploded) {
            // Trail
            for (let i = 0; i < this.trail.length; i++) {
                var t = this.trail[i];
                if (t.alpha <= 0) continue;
                context.save();
                context.globalAlpha = Math.max(0, t.alpha);
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
                context.fill();
                context.restore();
            }
            // Head
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, 2, 0, Math.PI * 2);
            context.fill();
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(context);
        }
    }

    isDead() {
        return this.exploded && this.particles.length === 0;
    }
}

let lastFireworkTime = 0;

function fireworksLoop(timestamp) {
    if (!fireworksRunning) return;

    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    // Launch new firework at random intervals
    if (timestamp - lastFireworkTime > Math.random() * 1200 + 600) {
        fireworks.push(new Firework(fireworksCanvas.width, fireworksCanvas.height));
        lastFireworkTime = timestamp;
    }

    // Update and draw
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        if (fireworks[i].isDead()) {
            fireworks.splice(i, 1);
        }
    }

    requestAnimationFrame(fireworksLoop);
}

function initFireworks() {
    resizeCanvas();
    fireworksRunning = true;
    lastFireworkTime = 0;
    requestAnimationFrame(fireworksLoop);
}

window.addEventListener('resize', function () {
    if (fireworksRunning) {
        resizeCanvas();
    }
});

/* ==========================================
   CAKE INTERACTION — AUDIO
   ========================================== */

// ============================================
// CUSTOM AUDIO
// ============================================
// Place your birthday song audio file (e.g., birthday-song.mp3)
// in the same directory as index.html, then update the path below.
// Supported formats: .mp3, .wav, .ogg
// ============================================
var birthdayAudio = new Audio('birthday-song.mp3');
birthdayAudio.preload = 'auto';

let audioPlaying = false;

cakeWrapper.addEventListener('click', function () {
    if (!audioPlaying) {
        birthdayAudio.play().then(function () {
            audioPlaying = true;
        }).catch(function () {
            // Audio file not found or playback blocked
            console.info(
                'Birthday song could not play. ' +
                'Make sure "birthday-song.mp3" is in the same folder as index.html.'
            );
        });
    }

    // Visual feedback — burst of sparkles around cake
    createCakeSparkles();
    
    // FEATURE #2: Add pulse glow effect
    cakeWrapper.style.filter = 'drop-shadow(0 0 20px #FF1493)';
    setTimeout(() => {
        cakeWrapper.style.filter = 'drop-shadow(0 15px 30px rgba(200, 100, 140, 0.2))';
    }, 400);
});

function createCakeSparkles() {
    var rect = cakeWrapper.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    for (var i = 0; i < 12; i++) {
        (function (index) {
            setTimeout(function () {
                var spark = document.createElement('div');
                spark.className = 'sparkle';
                spark.textContent = '✨';
                var angle = (index / 12) * Math.PI * 2;
                var dist = 60 + Math.random() * 40;
                spark.style.left = (cx + Math.cos(angle) * dist) + 'px';
                spark.style.top = (cy + Math.sin(angle) * dist) + 'px';
                spark.style.fontSize = (Math.random() * 10 + 12) + 'px';
                spark.style.color = EFFECT_COLORS[Math.floor(Math.random() * EFFECT_COLORS.length)];
                spark.style.animationDuration = (Math.random() * 0.4 + 0.4) + 's';
                spark.style.textShadow = `0 0 10px ${spark.style.color}`;
                document.body.appendChild(spark);
                setTimeout(function () { spark.remove(); }, 900);
            }, index * 50);
        })(i);
    }
}

/* ==========================================
   CANDLE BLOW-OUT FEATURE
   ========================================== */

let allCandlesBlown = false;

function initCandleBlowOut() {
    const candlesRow = document.getElementById('candles-row');
    if (!candlesRow) return;
    
    const candles = candlesRow.querySelectorAll('.candle');
    
    candlesRow.addEventListener('click', function (e) {
        // Only handle clicks on actual candles
        const clickedCandle = e.target.closest('.candle');
        if (!clickedCandle) return;
        
        // Prevent multiple clicks on same candle
        if (clickedCandle.classList.contains('blown-out')) return;
        
        // Blow out the clicked candle
        blowOutCandle(clickedCandle);
        
        // Check if all candles are blown out
        const blownOutCandles = candlesRow.querySelectorAll('.candle.blown-out');
        if (blownOutCandles.length === candles.length) {
            allCandlesBlown = true;
            setTimeout(() => {
                celebrateAllCandlesBlown();
            }, 600);
        }
    });
}

function blowOutCandle(candleElement) {
    // Add blow-out animation class
    candleElement.classList.add('blown-out');
    
    // Create wind/blow effect visual
    const candle = candleElement;
    const rect = candle.getBoundingClientRect();
    
    // Add slight shake to candle on blow
    candle.style.animation = 'none';
    setTimeout(() => {
        candle.style.animation = 'button-shake 0.2s ease-in-out';
    }, 10);
}

function celebrateAllCandlesBlown() {
    // When all candles are blown out, trigger special celebration!
    
    // Create burst of celebratory effects
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkleAtPosition(
                window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                window.innerHeight / 2 + (Math.random() - 0.5) * 200
            );
        }, i * 50);
    }
    
    // Create confetti burst
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createConfetti();
        }, Math.random() * 300);
    }
    
    // Create hearts burst
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 100);
    }
    
    // Show congratulations message
    showBlowOutMessage();
}

function showBlowOutMessage() {
    // Create and display a celebratory message
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '2.5rem';
    message.style.fontWeight = 'bold';
    message.style.color = '#FF1493';
    message.style.textShadow = '0 0 30px rgba(255, 20, 147, 0.8)';
    message.style.zIndex = '150';
    message.style.animation = 'message-pop 2s ease-out forwards';
    message.style.pointerEvents = 'none';
    message.textContent = '🎉 All Wishes Come True! 🎉';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2500);
}

/* ==========================================
   MAGIC BUTTONS — INTERACTIVE EFFECTS
   ========================================== */

// Heart Burst Effect
heartsBtn.addEventListener('click', function () {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 50);
    }
    heartsBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        heartsBtn.style.transform = '';
    }, 200);
});

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '💕';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 4500);
}

// Confetti Burst Effect
confettiBtn.addEventListener('click', function () {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            createConfetti();
        }, Math.random() * 200);
    }
    confettiBtn.style.transform = 'scale(1.1) rotate(5deg)';
    setTimeout(() => {
        confettiBtn.style.transform = '';
    }, 200);
});

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    
    const colors = ['#FF1493', '#00CED1', '#FFD700', '#FF69B4', '#00FF00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = color;
    confetti.style.width = (Math.random() * 8 + 4) + 'px';
    confetti.style.height = (Math.random() * 8 + 4) + 'px';
    confetti.style.setProperty('--sway', (Math.random() * 100 - 50) + 'px');
    confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
    
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4500);
}

// Sparkle Burst Effect
sparkleBtn.addEventListener('click', function () {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkleAtPosition(centerX, centerY);
        }, i * 40);
    }
    sparkleBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        sparkleBtn.style.transform = '';
    }, 200);
});

function createSparkleAtPosition(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = (Math.random() * 14 + 16) + 'px';
    sparkle.style.color = EFFECT_COLORS[Math.floor(Math.random() * EFFECT_COLORS.length)];
    sparkle.style.textShadow = `0 0 15px ${sparkle.style.color}`;
    sparkle.style.animationDuration = (Math.random() * 0.4 + 0.5) + 's';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Color Magic Effect - FEATURE #1: Dynamic neon color shifting
let colorMode = 0;
colorBtn.addEventListener('click', function () {
    colorMode = (colorMode + 1) % 3;
    
    if (colorMode === 1) {
        // Neon Mode
        mainPage.style.filter = 'hue-rotate(0deg) saturate(1.8) brightness(1.1)';
        mainPage.style.setProperty('--neon-glow', '0 0 20px #FF1493');
    } else if (colorMode === 2) {
        // Cool Mode (cyan/teal)
        mainPage.style.filter = 'hue-rotate(180deg) saturate(1.6) brightness(1.05)';
        mainPage.style.setProperty('--neon-glow', '0 0 20px #00CED1');
    } else {
        // Normal Mode
        mainPage.style.filter = 'none';
        mainPage.style.setProperty('--neon-glow', 'none');
    }
    
    // Visual feedback
    colorBtn.style.transform = 'scale(1.15) rotate(360deg)';
    colorBtn.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
        colorBtn.style.transition = 'all 0.3s ease';
        colorBtn.style.transform = '';
    }, 600);
});

/* ==========================================
   PHOTO GALLERY & LIGHTBOX
   ========================================== */

// Gallery item click handler - opens lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', function () {
        currentGalleryIndex = index;
        openLightbox(index);
    });
});

function openLightbox(index) {
    const imgSrc = galleryItems[index].querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Lightbox navigation
lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', function () {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    const imgSrc = galleryItems[currentGalleryIndex].querySelector('img').src;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = imgSrc;
        lightboxImg.style.opacity = '1';
    }, 200);
});

lightboxNext.addEventListener('click', function () {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    const imgSrc = galleryItems[currentGalleryIndex].querySelector('img').src;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = imgSrc;
        lightboxImg.style.opacity = '1';
    }, 200);
});

// Keyboard navigation in lightbox
document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        lightboxPrev.click();
    } else if (e.key === 'ArrowRight') {
        lightboxNext.click();
    } else if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Close lightbox on backdrop click
lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

/* ==========================================
   SCROLL REVEAL ANIMATION
   ========================================== */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.section');
    
    reveals.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.transitionDelay = (index * 0.1) + 's';
    });
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

/* ==========================================
   FEATURE #3: VOICE GREETING (Cool Feature)
   ==========================================
   Detects browser support for speech synthesis
   and allows users to hear Belinda's birthday greeting
   ========================================== */

const synth = window.speechSynthesis;

function addVoiceGreetingButton() {
    if (!synth) return;
    
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'magic-btn';
    voiceBtn.id = 'voice-btn';
    voiceBtn.innerHTML = '<span class="magic-btn-icon">🎤</span><span class="magic-btn-label">Hear Greeting</span>';
    
    const magicButtons = document.querySelector('.magic-buttons');
    if (magicButtons) {
        magicButtons.appendChild(voiceBtn);
    }
    
    voiceBtn.addEventListener('click', function () {
        if (synth.speaking) {
            synth.cancel();
            voiceBtn.style.opacity = '1';
        } else {
            const greeting = 'Happy Birthday Belinda! You are absolutely amazing!';
            const utterance = new SpeechSynthesisUtterance(greeting);
            utterance.rate = 0.95;
            utterance.pitch = 1.2;
            utterance.volume = 1;
            
            voiceBtn.style.opacity = '0.7';
            
            utterance.onend = function () {
                voiceBtn.style.opacity = '1';
            };
            
            synth.speak(utterance);
        }
        
        voiceBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            voiceBtn.style.transform = '';
        }, 200);
    });
}

/* ==========================================
   PAGE INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', function () {
    typeEntryMessage();
    createEntryParticles();
    addVoiceGreetingButton();
});

yesBtn.addEventListener('click', function () {
    entryScreen.classList.add('hidden');
    setTimeout(activateMainPage, 800);
});
