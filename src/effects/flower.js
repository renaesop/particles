/**
 * Created by fed on 2016/11/9.
 */
import {
  random,
} from '../math/math';

const bgColor = '#fff';

function nextPosition(x0, y0, dx, dy, pastTime, liveTime, fillStyle, fn) {
  return {
    x: fn(pastTime, x0, dx, liveTime),
    y: fn(pastTime, y0, dy, liveTime),
    fillStyle,
  };
}

export default function (canvas, ctx, img, fn) {
  let forceExit = false;
  const imgWidth = parseInt(img.width / 4, 10);
  const imgHeight = parseInt(img.height / 4, 10);
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const x0 = parseInt(canvasWidth / 2, 10);
  const y0 = parseInt(canvasHeight - 10, 10);
  const startX = parseInt((canvasWidth - imgWidth) / 2, 10);
  const startY = parseInt((canvasHeight - imgHeight) / 2, 10);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img,
    startX,
    startY,
    imgWidth,
    imgHeight,
  );
  let imgInfo = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const newState = [];
  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
      const N = (i + startY) * canvasWidth + j + startX;
      const color = [0, 1, 2].map(index => imgInfo.data[4 * N + index]);
      const sum = color.reduce((sumed, x) => sumed + x, 0);
      if (sum < 665 && random() > 0.5) {
        const liveTime = parseInt(random() * 100, 10) + 50;
        newState.push({
          liveTime,
          fillStyle: `rgba(${color.join(',')}, 0.99)`,
          x: j + startX,
          y: i + startY,
        });
      }
    }
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  function nextRandomParticle() {
    const l = newState.length;
    if (l <= 0) return null;
    const index = parseInt(random() * l, 10);
    const { liveTime, fillStyle, x, y } = newState.splice(index, 1)[0];
    let pastTime = 0;
    return function next() {
      if (pastTime >= liveTime) {
        return {
          x,
          y,
          fillStyle,
        };
      }
      pastTime++;
      return nextPosition(x0, y0, x - x0, y - y0, pastTime, liveTime, fillStyle, fn);
    };
  }
  let pSize = 100;
  const particles = [];
  const moving = [];
  let nextStart = 0;
  const animationFn = () => {
    for (let i = 0; i < pSize && newState.length; i++) {
      const func = nextRandomParticle();
      if (func) {
        particles.push(func);
      }
    }
    for (let i = nextStart; i < particles.length; i += 2) {
      const info = particles[i]();
      if (info) {
        moving[i] = info;
      }
    }
    nextStart = nextStart ? 0 : 1;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    const l = moving.length;
    for (let i = 0; i < moving.length; i++) {
      if (!moving[i]) continue;
      const { x, y, fillStyle } = moving[i];
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x, y, 1, 1);
    }
    !forceExit && requestAnimationFrame(animationFn);
    if (pSize > 5) {
      pSize -= 3;
    }
  };
  requestAnimationFrame(animationFn);
  return function () {
   forceExit = true;
  }
}