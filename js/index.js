var rotateDeg = 0;
var slideLeft = 0;
var slideTop  = -100;
var backtrack;

var audio = {
  enable: false,
  volume: 0.5,
  scale: 0.05 
}

var taskProps = {
    chess: {
        piece: null,
        moving: false,
        dimension: 0
    },
    morse: {
        solved: false,
        delay: 150,
        dot: 300,
        dash: 750
    },
    skyblock: {
        block: {
            fb1: {exist: true, obstacle: null},
            fb2: {exist: true, obstacle: 'fb1'},
            fb3: {exist: true, obstacle: 'fb4'},
            fb4: {exist: true, obstacle: 'fb2'}
        }
    }
}

window.onload = function() { Chapter.settings() }

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
            ["At age 10, I started playing chess competitively.", []],
            ["I played because I always found logic in general something amazing!", []],
            ["So I started to study with a lot of dedication", []],
            ["I achieved several achievements, to the point of playing professionally representing my city", []],
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
            ["I developed the startup system from end to end, the team for this was me and two interns", []],
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
}

class Transition {
    static settings() {
      const config = document.getElementById('configuration');
      config.style.opacity = 0;
      setTimeout(() => { 
        config.style.display = 'none';
        Music.start("intro.mp3", 0, 200);
        setTimeout(() => { Chapter.intro(); }, 1500);
      }, 1000);

      return false;
    }

    static intro() {
        Animation.reset();
        Animation.changeColors('apresentation', 
        'linear-gradient(45deg, #BF7A30 35%, 70%, #EDD599)'
        );

        Music.next("chess.mp3", 10, 95);
        setTimeout(() => {
            Chapter.chess();
        }, 850);

        return false;
    }

    static techBeginning() {
        const page = document.getElementById("contentContainer");
        Animation.reset();
        Animation.slide(page, "left");
        
        sleep(1400).then(() => (
            Chapter.techBeginning()
        ));
        
        Music.next("beginning.mp3", 0, 90);

        return false;
    }

    static actually() {
        const page = document.getElementById("contentContainer");
        Animation.reset();
        Animation.slide(page, "down");
        
        sleep(1400).then(() => (
            Chapter.actually()
        ));
        Music.next("actually.mp3", 0, 110);

        return false;
    }
}

class Music {
    static start(music, time, interval) {
        if (!audio.enable) {
          return false;
        }

        backtrack = new Audio('music/' + music);
        backtrack.currentTime = time;
        backtrack.volume = 0;
        let vol = 0;
        let fadein = setInterval(() => {
            vol += audio.scale;
            if (vol >= audio.volume) { clearInterval(fadein); }
            else { backtrack.volume = vol; }
        }, interval);

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

class Chess {
    static move(e) {
        if (!taskProps.chess.moving) {
            return false;
        }

        const piece = document.getElementById(taskProps.chess.piece);

        piece.style.left = `${e.pageX - piece.offsetWidth / 2}px`;
        piece.style.top  = `${e.pageY - piece.offsetHeight / 2}px`; 
        return false;
    }

    static getPiece(ele) {
        taskProps.chess.moving = true;
        taskProps.chess.piece = ele.id;

        ele.style.width = `${ele.offsetWidth}px`;
        ele.style.height = `${ele.offsetHeight}px`;
        ele.style.position = 'fixed';
        return false;
    }

    static dropPiece(e) {
        const piece = document.getElementById(taskProps.chess.piece);
        const correctSquare = document.getElementById('e8');
        const coordinates = getScreenCordinates(correctSquare);

        if (
            e.pageX >= coordinates.x && 
            e.pageX <= coordinates.x + correctSquare.offsetWidth &&
            e.pageY >= coordinates.y &&
            e.pageY <= coordinates.y + correctSquare.offsetHeight
        ) {
            correctSquare.appendChild(piece);
            solvePuzzle();
            setTimeout(() => {
                Transition.techBeginning();
            }, 1900);
        }

        piece.style.position = 'initial';
        piece.style.width = `100%`;
        piece.style.height = `100%`;
        piece.style.removeProperty('left');
        piece.style.removeProperty('top');

        taskProps.chess.moving = false;
        taskProps.chess.piece = null;
        return false;
    }

    static correctMove(parent) {
        const piece = document.getElementById(taskProps.chess.piece);
        parent.appendChild(piece);

        return false;
    }
}

class Morse {
    static async dot() {
        const output = document.getElementById('outputCTF');
        await sleep(taskProps.morse.delay).then(() => {
            output.style.backgroundColor = '#96ff9b';
        });

        await sleep(taskProps.morse.dot).then(() => {
            output.style.backgroundColor = '#EFEFEF';
        })
        console.log('dot');
    }

    static async dash() {
        const output = document.getElementById('outputCTF');
        await sleep(taskProps.morse.delay).then(() => {
            output.style.backgroundColor = '#96ff9b';
        });

        await sleep(taskProps.morse.dash).then(() => {
            output.style.backgroundColor = '#EFEFEF';
        })

        console.log('dash');
    }

    static run() {
        const task = document.getElementById("task-ctf");
        const btn = task.getElementsByTagName("button")[0];
        const techBeginning = document.getElementById("techBeginning-show");
        
        Animation.show([techBeginning, task, btn]);
        Morse.message();

        return false;
    }

    static async message() {
        const msg = [
            this.dot,
            this.dash,
            this.dot,
            this.dot,
            this.dash,
            this.dash,
            this.dash,   
            this.dot,
            this.dot,
            this.dot,
            this.dash,
            this.dot,
        ];
        
        
        while (!taskProps.morse.solved) {
            for (let index = 0; index < msg.length; index++) {
                const func = msg[index];
                await func();
            }
            await sleep(5000);              
        }
        
    }

    static key(input) {
        if (input.toLowerCase() === 'love') {
            taskProps.morse.solved = true;
            solvePuzzle();
            sleep(1800).then(() => {
                Transition.actually();
            });
        }
    } 
}

class Animation { 
    static show(Elements) {
        for (let index = 0; index < Elements.length; index++) {
          const element = Elements[index];
          
          element.style.display = "flex";
          sleep(100).then(() => {
              element.style.opacity = 1;
          });
        }

        return false;
    }

    static reset() {
        const buttons = document.getElementsByTagName("button");
        const texts    = document.getElementsByClassName("text");
        rotateDeg = 0;

        for (let index = 0; index < buttons.length; index++) {
            buttons[index].style.display = "none";
            buttons[index].style.opacity = 0;
        }

        for (let index = 0; index < texts.length; index++) {
            texts[index].innerHTML = "";
        }

    }

    static changeColors(id, color) {
        const faded = document.createElement("div");
        let painel = document.getElementById(id);

        faded.setAttribute("class", "fadedEfem");
        faded.style.background = window.getComputedStyle(painel).backgroundColor;

        painel.appendChild(faded);
        painel.style.background = color;
        sleep(100).then(() => {
            faded.style.opacity = 0;
        });

        sleep(900).then(() => {
            faded.remove();
        });

        return false;
    }

    static slide(Element, direction) {
        let time = 3;
        Element.style.transition = `background-color 2.8s, margin-top ${time}s, margin-left ${time}s`;
        switch (direction) {
            case "right":
                slideLeft += 100;
                Element.style.marginLeft = `${slideLeft}vw`;
                break;
            case "down":
                slideTop += 100;
                Element.style.marginTop = `${slideTop}vh`;
                break;
            case "left":
                slideLeft -= 100;
                Element.style.marginLeft = `${slideLeft}vw`;
                break;
            default:
                slideTop -= 100;
                Element.style.marginTop = `${slideTop}vh`;
                break;
        }

        sleep(time * 1000).then(() => {
            Element.style.transition = "background-color 2.8s";
        });

        return false;
    }
}

class Flyblock {
    static trigger(ele) {
        const direction = ele.classList[1];

        if (this.collide(direction, ele)) {
            return false;
        }

        switch (direction) {
            case 'fb-up':
                ele.style.top = `-${screen.width * 2}px`;
                break;
            case 'fb-left':
                ele.style.left = `-${screen.width * 2}px`;
                break;
            case 'fb-right':
                ele.style.left = `${screen.width * 2}px`;
                break;
        }

        taskProps.skyblock.block[ele.id].exist = false;

        for (const key in taskProps.skyblock.block) {
            if (taskProps.skyblock.block[key].exist) {
                return false
            }
        }

        solvePuzzle();
        // Transition.cv()
        return false;
    }

    static collide(direction, ele) {
        const obstacle = taskProps.skyblock.block[ele.id].obstacle;
        if (obstacle === null) {
            return false;
        }

        console.log(taskProps.skyblock.block[obstacle].exist);
        if (!(taskProps.skyblock.block[obstacle].exist)) {
            return false;
        }
        
        const obj = document.getElementById(obstacle);
        const coordinates = {
            ele: {y: ele.offsetTop, x: ele.offsetLeft},
            obj: {y: obj.offsetTop, x: obj.offsetLeft}
        };
        obj.style.transition = 'all 0.3s';
        ele.style.transition = 'all 0.3s';
        switch (direction) {
            case 'fb-up':
                ele.style.top = `${coordinates.ele.y - 5}px`
                sleep(200).then(() => {
                    obj.style.top = `${coordinates.obj.y - 20}px`;
                })
                sleep(500).then(() => {
                    obj.style.top = `${coordinates.obj.y}px`;
                })
                sleep(800).then(() => {
                    ele.style.top = `${coordinates.ele.y}px`;
                })
                break;
            case 'fb-left':
                ele.style.left = `${coordinates.ele.x - 5}px`
                sleep(200).then(() => {
                    obj.style.left = `${coordinates.obj.x - 20}px`;
                })
                sleep(500).then(() => {
                    obj.style.left = `${coordinates.obj.x}px`;
                })
                sleep(800).then(() => {
                    ele.style.left = `${coordinates.ele.x}px`;
                })
                break;
        
            case 'fb-right':
                ele.style.left = `${coordinates.ele.x + 5}px`
                sleep(200).then(() => {
                    obj.style.left = `${coordinates.obj.x + 20}px`;
                })
                sleep(500).then(() => {
                    obj.style.left = `${coordinates.obj.x}px`;
                })
                sleep(800).then(() => {
                    ele.style.left = `${coordinates.ele.x}px`;
                })
                break;
        }

        sleep(1000).then(() => {
            ele.removeAttribute('style');
            obj.removeAttribute('style');
        });
        return true;
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
        if (e.code === 'Space' || e.type == "mouseup") { velocity = originVelocity; }
    }

    let pressSpace = (e) => {
        if (e.code === 'Space' || e.type == "mousedown") { velocity = originVelocity / 3; }
    }

    document.addEventListener("keypress", pressSpace);
    document.addEventListener("keyup", upSpace);
    document.addEventListener("keydown", jumpText);
    document.addEventListener("mousedown", pressSpace);
    document.addEventListener("mouseup", upSpace);

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

            notice.innerHTML = "Clique ou pressione 'enter' para continuar";
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getScreenCordinates(obj) {
    var p = {};
    p.x = obj.offsetLeft;
    p.y = obj.offsetTop;
    while (obj.offsetParent) {
        p.x = p.x + obj.offsetParent.offsetLeft;
        p.y = p.y + obj.offsetParent.offsetTop;
        if (obj == document.getElementsByTagName("body")[0]) {
            break;
        }
        else {
            obj = obj.offsetParent;
        }
    }
    return p;
}

function solvePuzzle() {
    const html = document.getElementsByTagName('html')[0];
    const yay = document.createElement('img');
    yay.setAttribute('class', 'yay');
    yay.setAttribute('src', 'img/yay.gif');

    html.appendChild(yay);

    setTimeout(() => {
        yay.remove();
    }, 1800);

    return false;
}