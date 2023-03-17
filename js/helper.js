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

      for (let index = 0; index < buttons.length; index++) {
          if (buttons[index].classList.length > 0) {
              if (buttons[index].classList[0] === 'btnMeet') {
                  continue;
              }
          } 
          
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

  static slide(Element, direction, slide, frames = 1, time = 3 * frames) {
      Element.style.transition = `background-color 2.8s, margin-top ${time}s, margin-left ${time}s`;
      switch (direction) {
          case "right":
              slide.left += 100 * frames;
              Element.style.marginLeft = `${slide.left}vw`;
              break;
          case "down":
              slide.top += 100 * frames;
              Element.style.marginTop = `${slide.top}vh`;
              break;
          case "left":
            slide.left -= 100 * frames;
              Element.style.marginLeft = `${slide.left}vw`;
              break;
          default:
              slide.top -= 100 * frames;
              Element.style.marginTop = `${slide.top}vh`;
              break;
      }

      sleep(time * 1000).then(() => {
          Element.style.transition = "background-color 2.8s";
      });

      return false;
  }
}

class Mobile {
  static prevent(e) {
    e.preventDefault();

    return false;
  }

  static isLay() {
    const notice = document.getElementById('prevent-horizontal-mobile');
    if (screen.width < 1024 && screen.width > screen.height) {
      notice.style.display = 'flex';
      return false;
    }

    notice.style.display = 'none';
    return false;
  }
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