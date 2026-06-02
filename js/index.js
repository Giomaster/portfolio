var backtrack;
var animateProp = {
    slide: {
        left: 0,
        top: -100
    }
};

var audio = {
    enable: false,
    volume: 0.5
};

var musicSrcs = {
    intro:      'music/intro.mp3',
    cv:         'music/cv.mp3',
    beginning:  'music/beginning.mp3',
    chess:      'music/chess.mp3',
    actually:   'music/actually.mp3'
};

document.addEventListener('DOMContentLoaded', () => {
    Chapter.settings();
    document.addEventListener('touchmove', Mobile.prevent, { passive: false });

    Mobile.isLay();
    window.addEventListener('resize', Mobile.isLay, false);
});

class Chapter {
    static settings() {
        const config = document.getElementById('configuration');
        config.style.display = 'flex';
        setTimeout(() => { config.style.opacity = 1; }, 100);
        return false;
    }

    static intro() {
        const buttonStart = document.getElementById('btnStartApresentation');
        const monologue = [
            'Oh.',
            'You actually showed up.',
            'Most people scroll past a CV — but you stayed.',
            'Let me tell you how I got here...'
        ];

        typing(monologue, 50, 1, Animation.show, [[buttonStart]]);
        return false;
    }

    static chess() {
        const task = document.getElementById('task-chess');
        const btn = task.getElementsByTagName('button')[0];
        const text = document.getElementById('apresentation-text');
        const apresentation = document.getElementById('apresentation-show');

        text.style.fontWeight = '300';

        const monologue = [
            ["I was 10 when I learned that every move has consequences.", []],
            ["Chess wasn't a game — it was the first system I ever debugged.", []],
            ["City tournaments, late nights studying openings, a few trophies along the way.", []],
            ["Thinking three moves ahead became muscle memory. Turns out that's just system design with extra steps.", []]
        ];

        typeWithStops(monologue, 40, 1, Animation.show, [[apresentation, task, btn], 4500]);
        return false;
    }

    static techBeginning() {
        const text = document.getElementById('techBeginning-text');
        text.style.fontWeight = '300';

        const monologue = [
            ["Three years later, I traded the chessboard for a terminal.", []],
            ["Same obsession with logic — different opponent.", []],
            ["At 13, my team won the CTF at CryptoRave 2016.", []],
            ["The prize was a trip to Las Vegas. We were all minors. We never claimed it.", []],
            ["Some wins you cash in. Others you carry as proof you can figure things out.", []]
        ];

        typeWithStops(monologue, 40, 2, Anagram.run);
        return false;
    }

    static actually() {
        const task = document.getElementById('task-flyblock');
        const btn = task.getElementsByTagName('button')[0];
        const text = document.getElementById('actually-text');
        const actually = document.getElementById('actually-show');

        text.style.fontWeight = '300';

        const monologue = [
            ["I'm 23 — self-taught, shipping production software since I was 17.", []],
            ["Six years of it now: small companies first, then a major fintech, plus the open source work that ties it all together.", []],
            ["2019 to 2021 — founding engineer at mech4u and freelancing for SandreFrio. Python driving AutoCAD to price parts straight off CAD drawings, and a Django app to digitize a whole company's data entry.", []],
            ["2021 to 2026 — Stone Pagamentos. One of the engineers who built their Internal Developer Platform from its early days: Backstage, Crossplane, Terraform, multi-cloud, GitOps end to end. Today it's used by dozens of squads.", []],
            ["I grew there from junior to Backend Engineer II — backend services in Node.js, NestJS and TypeScript, versioned REST/OpenAPI contracts, PostgreSQL, Docker and CI/CD, owned end to end.", []],
            ["In parallel I started Yggdrasil — an open source control plane (Apache-2.0) that operates infrastructure instead of just cataloging it: declarative apply, diff and rollback, plus an event-driven workflow engine.", []],
            ["Written in Go, with a full-lifecycle CLI and SDK and pluggable adapters for AWS, GCP, Kubernetes, Stripe, RabbitMQ and more — self-hosted, one command to install.", []],
            ["AI tools sit beside me every day. They speed up the work — the calls that matter still go through me.", []],
            ["Twenty-three. Six years in production, from small-company chaos to platform scale. Still chasing the next thing that doesn't quite work yet.", []],
            ["Got something interesting in mind? Drop a line — let's talk.", []]
        ];

        typeWithStops(monologue, 55, 0, Animation.show, [[actually, task, btn], 4500]);
        return false;
    }

    static cv() {
        const thanku = document.getElementById('cv-thanku');
        const text = thanku.getElementsByTagName('h1')[0];
        const content = document.getElementById('contentCV');

        text.style.opacity = '1';
        sleep(2200).then(() => { text.style.opacity = '0'; });
        sleep(4000).then(() => {
            thanku.style.opacity = '0';
            // opacity:0 ainda intercepta cliques — torna o overlay click-through
            // para liberar os botões abaixo da foto (Download CV / Email me)
            thanku.style.pointerEvents = 'none';
        });
        sleep(4800).then(() => { thanku.style.display = 'none'; });
        sleep(4700).then(() => {
            content.style.overflow = 'auto';
            content.addEventListener('touchmove', (e) => { e.stopPropagation(); }, false);
        });
    }
}

class Transition {
    static settings() {
        const config = document.getElementById('configuration');
        config.style.opacity = 0;
        setTimeout(() => {
            config.style.display = 'none';
            Music.start('intro', 0, 2200);
            setTimeout(() => { Chapter.intro(); }, 1500);
        }, 1000);
        return false;
    }

    static intro() {
        Animation.reset();
        Animation.changeColors('apresentation',
            'linear-gradient(45deg, #BF7A30 35%, 70%, #EDD599)'
        );

        Music.next('chess', 75, 1200);
        setTimeout(() => { Chapter.chess(); }, 850);
        return false;
    }

    static techBeginning() {
        const page = document.getElementById('contentContainer');
        Animation.reset();
        Animation.slide(page, 'left', animateProp.slide);

        sleep(1400).then(() => Chapter.techBeginning());
        Music.next('beginning', 0, 1100);
        return false;
    }

    static actually() {
        const page = document.getElementById('contentContainer');
        Animation.reset();
        Animation.slide(page, 'down', animateProp.slide);

        sleep(1400).then(() => Chapter.actually());
        Music.next('actually', 0, 1300);
        return false;
    }

    static cv() {
        const page = document.getElementById('contentContainer');
        const content = document.getElementById('contentCV');
        content.style.overflow = 'hidden';

        Animation.reset();
        Animation.slide(page, 'left', animateProp.slide, 2);

        sleep(5500).then(() => Chapter.cv());
        Music.next('cv', 0, 2400);
        return false;
    }
}

class Music {
    static cache = {};

    static load(key) {
        if (!this.cache[key]) {
            const a = new Audio(musicSrcs[key]);
            a.preload = 'auto';
            a.loop = true;
            this.cache[key] = a;
        }
        return this.cache[key];
    }

    static fadeTo(track, targetVol, durationMs) {
        return new Promise(resolve => {
            const startVol = track.volume;
            const startTime = performance.now();
            const step = (now) => {
                const t = Math.min(1, (now - startTime) / durationMs);
                // ease-in-out cubic — natural perceived loudness curve
                const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                track.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * ease));
                if (t < 1) requestAnimationFrame(step);
                else resolve();
            };
            requestAnimationFrame(step);
        });
    }

    static async start(key, time = 0, fadeMs = 1500) {
        if (!audio.enable) return false;
        const track = this.load(key);
        backtrack = track;
        track.currentTime = time;
        track.volume = 0;
        try { await track.play(); } catch (_) { return false; }
        await this.fadeTo(track, audio.volume, fadeMs);
        return false;
    }

    static async next(key, time = 0, fadeMs = 1500) {
        if (!audio.enable) return false;
        if (backtrack) {
            const old = backtrack;
            await this.fadeTo(old, 0, fadeMs);
            old.pause();
        }
        return this.start(key, time, fadeMs);
    }

    static enable() {
        audio.enable = true;
    }
}

function typing(text, velocity, index, func, args) {
    const textEle = document.getElementsByClassName('text')[index];
    let n = 0;
    let i = 0;

    const write = (phrase) => {
        if (i < phrase.length) {
            textEle.textContent += phrase.charAt(i);
            i++;
            setTimeout(write, velocity, phrase);
        } else {
            if (n + 1 < text.length) {
                sleep(500).then(() => {
                    textEle.style.backgroundColor = '#FFF';
                    textEle.style.color = '#222';
                });
            }
            sleep(1600).then(() => { n++; selectPhrase(text); });
        }
    };

    const selectPhrase = (listText) => {
        if (n < listText.length) {
            textEle.textContent = '';
            textEle.style.backgroundColor = 'transparent';
            textEle.style.color = '#FFF';
            i = 0;
            write(listText[n]);
        } else {
            func.apply(this, args);
        }
    };

    selectPhrase(text);
    return false;
}

function typeWithStops(text, velocity, index, func, args = null) {
    const textEle = document.getElementsByClassName('text')[index];
    const notice = document.getElementsByClassName('notice')[index];
    const originVelocity = velocity;
    let n = 0;
    let i = 0;

    const jumpText = (e) => { if (e.code === 'Enter') { velocity = 0; } };
    const upSpace = (e) => {
        if (e.code === 'Space' || e.type === 'mouseup' || e.type === 'touchend') velocity = originVelocity;
    };
    const pressSpace = (e) => {
        if (e.code === 'Space' || e.type === 'mousedown' || e.type === 'touchstart') velocity = originVelocity / 3;
    };

    document.addEventListener('keypress', pressSpace);
    document.addEventListener('keyup', upSpace);
    document.addEventListener('keydown', jumpText);
    document.addEventListener('mousedown', pressSpace);
    document.addEventListener('mouseup', upSpace);
    document.addEventListener('touchstart', pressSpace);
    document.addEventListener('touchend', upSpace);

    const waitingKeypress = () => new Promise((resolve) => {
        const onKeyHandler = (e) => {
            if (e.code === 'Enter' || e.type === 'mousedown') {
                document.removeEventListener('keydown', onKeyHandler);
                document.removeEventListener('mousedown', onKeyHandler);
                resolve();
            }
        };
        document.addEventListener('keydown', onKeyHandler);
        document.addEventListener('mousedown', onKeyHandler);
    });

    const write = (phrase) => {
        if (i < phrase.length) {
            textEle.textContent += phrase.charAt(i);
            i++;
            setTimeout(write, velocity, phrase);
        } else {
            if (text[n][1].length > 0) {
                text[n][1].forEach(funcs => { funcs[0].apply(this, funcs[1]); });
            }
            notice.textContent = "Click or press 'enter' to continue";
            notice.style.opacity = 1;
            waitingKeypress().then(() => {
                n++;
                notice.textContent = '';
                notice.style.opacity = 0;
                velocity = originVelocity;
                selectPhrase(text);
            });
        }
    };

    const selectPhrase = (listText) => {
        if (n < listText.length) {
            textEle.textContent = '';
            i = 0;
            write(listText[n][0]);
        } else {
            func.apply(this, args);
        }
    };

    selectPhrase(text);
    return false;
}
