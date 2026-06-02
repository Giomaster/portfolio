var taskProps = {
  chess: {
      piece: null,
      moving: false,
      coordinates: {
        x: 0,
        y: 0
      }
  },
  anagram: {
      solved: false,
      word: 'KUBERNETES'
  },
  flyblock: {
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
}

class Anagram {
  static run() {
      const task = document.getElementById("task-anagram");
      const btn = task.getElementsByTagName("button")[0];
      const techBeginning = document.getElementById("techBeginning-show");

      Anagram.build();
      Animation.show([techBeginning, task, btn]);

      return false;
  }

  static build() {
      const word = taskProps.anagram.word;
      const slots = document.getElementById('anagram-slots');
      const pool  = document.getElementById('anagram-pool');

      slots.replaceChildren();
      pool.replaceChildren();
      slots.classList.remove('solved', 'wrong');

      for (let i = 0; i < word.length; i++) {
          const slot = document.createElement('div');
          slot.className = 'anagram-slot';
          slot.dataset.index = i;
          slot.addEventListener('click', () => Anagram.removeLetter(slot));
          slots.appendChild(slot);
      }

      const letters = word.split('');
      do {
          for (let i = letters.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [letters[i], letters[j]] = [letters[j], letters[i]];
          }
      } while (letters.join('') === word);

      letters.forEach((letter, i) => {
          const tile = document.createElement('div');
          tile.className = 'anagram-tile';
          tile.dataset.poolIndex = i;
          tile.textContent = letter;
          tile.addEventListener('click', () => Anagram.placeLetter(tile));
          pool.appendChild(tile);
      });
  }

  static placeLetter(tile) {
      if (tile.classList.contains('used') || taskProps.anagram.solved) return;

      const slots = document.getElementById('anagram-slots');
      const emptySlot = Array.from(slots.children)
          .find(s => !s.dataset.poolIndex);
      if (!emptySlot) return;

      emptySlot.textContent = tile.textContent;
      emptySlot.dataset.poolIndex = tile.dataset.poolIndex;
      emptySlot.classList.add('filled');
      tile.classList.add('used');

      Anagram.check();
  }

  static removeLetter(slot) {
      if (!slot.dataset.poolIndex || taskProps.anagram.solved) return;

      const pool = document.getElementById('anagram-pool');
      const tile = pool.querySelector(`[data-pool-index="${slot.dataset.poolIndex}"]`);
      if (tile) tile.classList.remove('used');

      slot.textContent = '';
      slot.classList.remove('filled');
      delete slot.dataset.poolIndex;
  }

  static check() {
      const word = taskProps.anagram.word;
      const slots = document.getElementById('anagram-slots');
      const current = Array.from(slots.children)
          .map(s => s.textContent)
          .join('');

      if (current.length < word.length) return;

      if (current === word) {
          taskProps.anagram.solved = true;
          slots.classList.add('solved');
          solvePuzzle();
          sleep(1800).then(() => Transition.actually());
          return;
      }

      slots.classList.add('wrong');
      setTimeout(() => {
          slots.classList.remove('wrong');
          Array.from(slots.children).forEach(s => Anagram.removeLetter(s));
      }, 500);
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

      taskProps.flyblock.block[ele.id].exist = false;
      ele.style.opacity = '0';

      for (const key in taskProps.flyblock.block) {
          if (taskProps.flyblock.block[key].exist) {
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
      const obstacle = taskProps.flyblock.block[ele.id].obstacle;
      if (obstacle === null) {
          return false;
      }

      if (!(taskProps.flyblock.block[obstacle].exist)) {
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
  Confetti.fire();
  return false;
}