class Confetti {
    static fire() {
        let canvas = document.getElementById('confetti-canvas');
        if (canvas) canvas.remove();

        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '99999999'
        });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const random = (min, max) => Math.random() * (max - min) + min;
        const gravity = 0.15;
        const particles = [];

        const createBurst = (x, y, direction) => {
            for (let i = 0; i < 220; i++) {
                const angle = random(-0.9, -2.3);
                const power = random(8, 10);
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * power * direction + random(-1.5, 1.5),
                    vy: Math.sin(angle) * power,
                    size: random(5, 11),
                    rot: random(0, Math.PI),
                    vr: random(-0.25, 0.25),
                    life: random(180, 320),
                    flutter: random(0, Math.PI * 2),
                    drift: random(-1, 1),
                    chaos: random(0.002, 0.008),
                    color: `hsl(${random(0, 360)}, 90%, 60%)`
                });
            }
        };

        createBurst(0, canvas.height * 0.65, 1);
        createBurst(canvas.width, canvas.height * 0.65, -1);

        let wind = 0;
        let windTarget = 0;
        let frameId = null;

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            wind += (windTarget - wind) * 0.002;
            if (Math.random() < 0.01) {
                windTarget = random(-1.5, 1.5);
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                const boost = p.life > 260 ? 1.04 : 1;

                p.vy += gravity * 0.55;
                p.vx *= boost;
                p.vy *= boost;

                const noise = Math.sin(performance.now() * p.chaos + p.flutter);

                p.vx += p.drift * 0.02 + noise * 0.08;
                p.vx += wind * 0.015;

                p.flutter += 0.12;

                p.x += p.vx + Math.sin(p.flutter) * 0.4;
                p.y += p.vy;

                p.rot += p.vr;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();

                if (p.life-- <= 0 || p.y > canvas.height + 60) {
                    particles.splice(i, 1);
                }
            }

            if (particles.length > 0) {
                frameId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(frameId);
                window.removeEventListener('resize', resize);
                canvas.remove();
            }
        };

        update();
        return false;
    }
}
