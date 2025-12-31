document.addEventListener('DOMContentLoaded', () => {
    // Target: January 1, 2026
    const targetDate = new Date('January 1, 2026 00:00:00').getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const overlay = document.getElementById('celebration-overlay');
    const welcomeText = document.getElementById('welcome-text');
    const welcomeSub = document.getElementById('welcome-sub');

    let celebrationTriggered = false;
    let isReplayMode = false;
    let replayTime = 10; // 10 second replay

    function checkTime() {
        const now = new Date().getTime();
        let distance = targetDate - now;

        // Logic check: After midnight?
        if (distance < 0 && !celebrationTriggered) {
            // If it's the first load after midnight, go into "Replay Mode"
            if (!isReplayMode) {
                isReplayMode = true;
                startReplayCountdown();
                return;
            }
        }

        if (distance < 0 && celebrationTriggered) return;

        displayTime(distance);

        if (distance <= 0 && !celebrationTriggered) {
            triggerCelebration();
        }
    }

    function displayTime(ms) {
        if (ms < 0) ms = 0;
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? '0' + days : days;
        hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    function startReplayCountdown() {
        // Set display to 0s except for the 10-second replay
        daysEl.innerText = '00';
        hoursEl.innerText = '00';
        minutesEl.innerText = '00';
        
        const replayInterval = setInterval(() => {
            secondsEl.innerText = replayTime < 10 ? '0' + replayTime : replayTime;
            if (replayTime <= 0) {
                clearInterval(replayInterval);
                triggerCelebration();
            }
            replayTime--;
        }, 1000);
    }

    function triggerCelebration() {
        celebrationTriggered = true;
        
        // Hide the original countdown and text for a clean modern look
        document.querySelector('.hero-section').classList.add('celebration-active');
        
        // Update status text
        document.getElementById('countdown-status').innerText = 'WELCOME TO THE NEW YEAR';
        
        overlay.style.display = 'flex';
        setTimeout(() => {
            welcomeText.classList.add('active');
            welcomeSub.classList.add('active');
        }, 100);

        initFireworks();
    }

    // --- Firework Engine ---
    function initFireworks() {
        const canvas = document.getElementById('celebration-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.velocity = {
                    x: (Math.random() - 0.5) * 8,
                    y: (Math.random() - 0.5) * 8
                };
                this.alpha = 1;
                this.friction = 0.95;
            }

            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                this.velocity.x *= this.friction;
                this.velocity.y *= this.friction;
                this.y += 0.05; // gravity
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.01;
            }
        }

        function createFirework(x, y) {
            const colors = ['#ff0000', '#ffd700', '#ffffff', '#00ff00', '#0000ff', '#ff00ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 40; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        function animate() {
            if (!celebrationTriggered) return;
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                if (p.alpha > 0) {
                    p.update();
                    p.draw();
                } else {
                    particles.splice(i, 1);
                }
            });

            if (Math.random() < 0.05) {
                createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.5);
            }
        }

        animate();
    }

    // Start checking
    setInterval(checkTime, 1000);
    checkTime();
});
