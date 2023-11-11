var backtrack; 
var animateProp = {
    slide: {
        left: 0,
        top: -100
    }
}

var audio = {
  enable: false,
  volume: 0.5,
  scale: 0.05 
}

var playlist = {
    intro: new Audio('music/intro.mp3'),
    cv: new Audio('music/cv.mp3'),
    beginning: new Audio('music/beginning.mp3'),
    chess: new Audio('music/chess.mp3'),
    actually: new Audio('music/actually.mp3')
}

// Iniciate CV interative process
window.onload = function() { 
    Chapter.settings();
    document.addEventListener('touchmove', Mobile.prevent, {passive: false});

    Mobile.isLay();
    window.addEventListener('resize', Mobile.isLay, false);
}

class Chapter {
    static settings() {
      const config = document.getElementById('configuration');
      config.style.display = 'block';
      setTimeout(() => { config.style.opacity = 1; }, 100);

      return false;
    }

    static intro() {
        const buttonStart = document.getElementById("btnStartApresentation");
        const monologue = [
            "Oh!",
            "Hmm... Hi! I didn't expect you to come here",
            "Who am I?",
            "Okay okay, I'll tell my story..."
        ]

        typping(monologue, 50, 1, Animation.show, [[buttonStart]]);
        
        return false;
    }

    static chess() {
        const task = document.getElementById("task-chess");
        const btn = task.getElementsByTagName("button")[0];
        const text   = document.getElementById("apresentation-text");
        const apresentation = document.getElementById("apresentation-show");

        text.style.fontWeight = "300";

        const monologue = [
            ["At age 10, I started playing chess competitively", []],
            ["I started playing because I always found logic in general something amazing!", []],
            ["So I study with a lot of dedication", []],
            ["I have won several achievements, to the point of playing professionally representing my city", []],
        ]

        typeWithStops(monologue, 40, 1, Animation.show, [[apresentation, task, btn]]);
        
        return false;
    }

    static techBeginning() {
        const text = document.getElementById("techBeginning-text");

        text.style.fontWeight = "300";

        const monologue = [
            ["At age 12, I started learning programming", []],
            ["And so I started to get involved in every technology event that I had the opportunity", []],
            ["With that I got some very interesting achievements", []],
            ["Winning the CTF at CryptoRave 2016 was a great achievement, but I couldn't claim the prize for traveling to Las Vegas because my team was made up of minors", []],
            ["And of course, there are some other competitions such as robotics that were between the podium as well.", []],
        ]

        typeWithStops(monologue, 40, 2, Morse.run);

        return false;
    }

    static actually() {
        const task = document.getElementById("task-flyblock");
        const btn = task.getElementsByTagName("button")[0];
        const text = document.getElementById("actually-text");
        const actually = document.getElementById("actually-show");

        text.style.fontWeight = "300";

        const monologue = [
            ["It was at the age of 17 that I started doing big projects", []],
            ["I developed a system for a startup from start to finish, the team for this was me and two interns", []],
            ["I also developed something like an internal system to manage the products and services of an air conditioning company, as I literally did it myself so it was a coold experience.", []],
            ["After that I started working at Stone Co. as a developer in the infrastructure area", []],
            ["I'm learning a lot about... Infra as code, CI/CD, Kubernetes, Clouds, terraform, and so on", []],
            ["But despite where I work, I will always be passionate about full stack development, or at least front-end development", []],
            ["I cannot deny that I feel like a developer or engineer with very broad knowledge", []],
            ["But of course I will always be willing to learn more", []],

        ]

        typeWithStops(monologue, 60, 0, Animation.show, [[actually, task, btn]]);
        return false;
    }

    static cv() {
        const thanku = document.getElementById('cv-thanku');
        const text   = thanku.getElementsByTagName('h1')[0];
        const content = document.getElementById("contentCV");

        text.style.opacity = '1';
        sleep(2000).then(() => {
            text.style.opacity = '0';    
        });

        sleep(4000).then(() => {
            thanku.style.opacity = '0'
        });

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
        Music.start(playlist.intro, 0, 200);
        setTimeout(() => { Chapter.intro(); }, 1500);
      }, 1000);

      return false;
    }

    static intro() {
        Animation.reset();
        Animation.changeColors('apresentation', 
        'linear-gradient(45deg, #BF7A30 35%, 70%, #EDD599)'
        );

        Music.next(playlist.chess, 10, 95);
        setTimeout(() => {
            Chapter.chess();
        }, 850);

        return false;
    }

    static techBeginning() {
        const page = document.getElementById("contentContainer");
        Animation.reset();
        Animation.slide(page, "left", animateProp.slide);
        
        sleep(1400).then(() => (
            Chapter.techBeginning()
        ));
        
        Music.next(playlist.beginning, 0, 90);

        return false;
    }

    static actually() {
        const page = document.getElementById("contentContainer");
        Animation.reset();
        Animation.slide(page, "down", animateProp.slide);
        
        sleep(1400).then(() => (
            Chapter.actually()
        ));
        Music.next(playlist.actually, 0, 110);

        return false;
    }

    static cv() {
        const page = document.getElementById("contentContainer");
        const content = document.getElementById("contentCV");
        content.style.overflow = 'hidden';

        Animation.reset();
        Animation.slide(page, "left", animateProp.slide,2);

        sleep(5500).then(() => {
            Chapter.cv();
        });
        
        Music.next(playlist.cv, 0, 270);
        return false;
    }
}

class Music {
    static start(music, time, interval) {
        if (!audio.enable) {
          return false;
        }

        backtrack = music;
        backtrack.currentTime = time;
        backtrack.volume = 0;
        let vol = 0;
        let fadein = setInterval(() => {
            vol += audio.scale;
            if (vol >= audio.volume) { clearInterval(fadein); }
            else { backtrack.volume = vol; }
        }, interval);

        backtrack.addEventListener('ended', () => {
            backtrack.currentTime = 0;
            backtrack.play();
        });

        backtrack.play();
        return false;
    }

    static stop(interval) {
        let vol = audio.volume;
        let fadeout = setInterval(() => {
            vol -= audio.scale;
            if (vol <= 0) { 
                clearInterval(fadeout); 
                backtrack.pause();
            }
            else { backtrack.volume = vol; }
        }, interval);

        return false;
    }

    static next(music, time, interval) {
        if (!audio.enable) {
          return false;
        }

        let vol = audio.volume;
        let fadeout = setInterval(() => {
            vol -= audio.scale;
            if (vol <= 0) { 
                clearInterval(fadeout); 
                backtrack.pause();
                this.start(music, time, interval);
            }
            else { backtrack.volume = vol; }
        }, interval);
    }

    static enable() {
      audio.enable = true;
    }
}

function typping(text, velocity, index, func, args) {
    const textEle = document.getElementsByClassName("text")[index];
    let n = 0
    let i = 0

    let write = (phrase) => {
        if (i < phrase.length) {
            textEle.innerHTML += phrase.charAt(i);
            i++;
            setTimeout(write, velocity, phrase);  
        } else {
            if (n + 1 < text.length) {
                sleep(500).then(() => {
                    textEle.style.backgroundColor = "#FFF";
                    textEle.style.color = "#222";
                });
            }

            sleep(1600).then(() => {
                n++;
                selectPhrase(text);
            });
        }
    }

    let selectPhrase = (listText) => {
        if (n < listText.length) {
            textEle.innerHTML = "";
            textEle.style.backgroundColor = "transparent";
            textEle.style.color = "#FFF";
            i = 0;
            write(listText[n]);
        } else {
            func.apply(this, args);
        }
    }

    selectPhrase(text);

    return false;
}

function typeWithStops(text, velocity, index, func, args = null) {
    const textEle = document.getElementsByClassName("text")[index];
    const notice  = document.getElementsByClassName("notice")[index];
    const originVelocity = velocity;
    let n = 0
    let i = 0

    let jumpText = (e) => {
        if (e.code === 'Enter') { velocity = 0; }
    }

    let upSpace = (e) => {
        if (e.code === 'Space' || e.type == "mouseup" || e.type == "touchend") { velocity = originVelocity; }
    }

    let pressSpace = (e) => {
        if (e.code === 'Space' || e.type == "mousedown" || e.type == "touchstart") { velocity = originVelocity / 3; }
    }

    document.addEventListener("keypress", pressSpace);
    document.addEventListener("keyup", upSpace);
    document.addEventListener("keydown", jumpText);
    document.addEventListener("mousedown", pressSpace);
    document.addEventListener("mouseup", upSpace);
    document.addEventListener("touchstart", pressSpace);
    document.addEventListener("touchend", upSpace)

    let waitingKeypress = () => {
        return new Promise((resolve) => {
          document.addEventListener('keydown', onKeyHandler);
          document.addEventListener('mousedown', onKeyHandler);
          function onKeyHandler(e) {
            if (e.code === 'Enter' || e.type == "mousedown") {
              document.removeEventListener('keydown', onKeyHandler);
              document.removeEventListener('mousedown', onKeyHandler);
              resolve();
            }
          }
        });
      }

    let write = (phrase) => {
        if (i < phrase.length) {
            textEle.innerHTML += phrase.charAt(i);
            i++;
            setTimeout(write, velocity, phrase);  
        } else {
          if (text[n][1].length > 0) {
              text[n][1].forEach(funcs=> {
                  funcs[0].apply(this, funcs[1]);
              });
          }

            notice.innerHTML = "Click or press 'enter' to continue";
            notice.style.opacity = 1;
            waitingKeypress().then(() => {

                n++;
                notice.innerHTML = "";
                notice.style.opacity = 0;
                velocity = originVelocity;
                selectPhrase(text);
            });
        }
    }

    let selectPhrase = (listText) => {
        if (n < listText.length) {
            textEle.innerHTML = "";
            i = 0;
            write(listText[n][0]);
        } else {
            func.apply(this, args);
        }
    }

    selectPhrase(text);

    return false;
}