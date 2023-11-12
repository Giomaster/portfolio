var taskProps = {
  chess: {
      piece: null,
      moving: false,
      coordinates: {
        x: 0,
        y: 0
      }
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

class Chess {
  static move(e) {
      if (!taskProps.chess.moving) {
          return false;
      }

      const piece = document.getElementById(taskProps.chess.piece);
      const pos = (e.pageX === undefined) ? e.touches[0] : e; 

      piece.style.left = `${pos.pageX - piece.offsetWidth / 2}px`;
      piece.style.top  = `${pos.pageY - piece.offsetHeight / 2}px`;

      taskProps.chess.coordinates = {x: pos.pageX, y: pos.pageY};
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

  static dropPiece() {
      const piece = document.getElementById(taskProps.chess.piece);
      const correctSquare = document.getElementById('e8');
      const coordinates = getScreenCordinates(correctSquare);
      const pos = taskProps.chess.coordinates; 

      if (
          pos.x >= coordinates.x && 
          pos.x <= coordinates.x + correctSquare.offsetWidth &&
          pos.y >= coordinates.y &&
          pos.y <= coordinates.y + correctSquare.offsetHeight
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
  }

  static async dash() {
      const output = document.getElementById('outputCTF');
      await sleep(taskProps.morse.delay).then(() => {
          output.style.backgroundColor = '#96ff9b';
      });

      await sleep(taskProps.morse.dash).then(() => {
          output.style.backgroundColor = '#EFEFEF';
      })
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
      if (input.value.toLowerCase() === 'love') {
          taskProps.morse.solved = true;
          input.disabled = true;
          solvePuzzle();
          sleep(1800).then(() => {
              Transition.actually();
          });
      }
  }

  static clickMobile(letter) {
    const allPressedLetters = document.getElementsByClassName('selected-letter');
    let checkPopLetter = 4;
    if (letter.classList.contains('selected-letter')) {
        letter.classList.remove('selected-letter');
    } else {
        letter.classList.add('selected-letter');
    }

    for (let i = 0; i < allPressedLetters.length; i++) {
        const l = allPressedLetters[i];
        if (!"love".includes(l.innerHTML)) return;
        if ("love".includes(l.innerHTML)) checkPopLetter--;
    }

    if (checkPopLetter > 0) return;
    taskProps.morse.solved = true;
    solvePuzzle();
    sleep(1800).then(() => {
        Transition.actually();
    });
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
      ele.style.opacity = '0';

      for (const key in taskProps.skyblock.block) {
          if (taskProps.skyblock.block[key].exist) {
              return false
          }
      }

      solvePuzzle();
      sleep(2000).then(() => {
          Transition.cv()
      });

      return false;
  }

  static collide(direction, ele) {
      const obstacle = taskProps.skyblock.block[ele.id].obstacle;
      if (obstacle === null) {
          return false;
      }

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