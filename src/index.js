/**
 * Created by fed on 2016/11/8.
 */
import { canvas, ctx } from './ctx';
import readImage from './read-image';
import co from 'co';

const { random, sqrt } = Math;
const RANDOM_FACTOR = 5;

function square(x) {
  return x * x;
}

co(function *() {
  const img = yield readImage('./77.png');
  const imgWidth = parseInt(img.width / 4, 10);
  const imgHeight = parseInt(img.height / 4, 10);
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const startX = parseInt((canvasWidth - imgWidth) / 2, 10);
  const startY = parseInt((canvasHeight - imgHeight) / 2, 10);
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
      if (sum < 755) {
        newState.push({
          x: j + startX + (0.5 - random()) * RANDOM_FACTOR * 0,
          y: i + startY + (0.5 - random()) * RANDOM_FACTOR * 0,
          fillStyle: `rgba(${color.join(',')}, 0.99)`,
        });
      }
    }
  }
  let revCount = 0;
  let pauseCount = 0;
  const initLength = newState.length;
  function nextRandomParticle() {
    const l = newState.length;
    if (l <= 0) return null;
    const index = parseInt(random() * l, 10);
    let { x: x0, y: y0, fillStyle } = newState.splice(index, 1)[0];
    const liveTime = parseInt(random() * 10, 10) + 200;
    let kx = (random() - 0.5) * 0.2 ;
    let ky = (random() - 0.5) * 0.2;
    let pastTime = 0;
    let reversed = false;
    return {
      next() {
        if (pastTime >= liveTime) {
          if (!reversed)
            return null;
          else {
            revCount ++;
            if (revCount === initLength) {
              for (let i = 0; i < particles.length; i++) {
                particles[i].reverse();
              }
              revCount = 0;
              pauseCount = 1;
            }
            return;
          }
        }
        pastTime++;
        const factor = 1 - square(0.5 - pastTime/liveTime);
        return {
          x: x0 + (pastTime * kx + pastTime * pastTime * kx) * factor,
          y: y0 + (pastTime * ky + pastTime * pastTime * ky) * factor,
          fillStyle,
        };
      },
      reverse() {
        reversed = true;
        const factor = 1 - square(0.5 - pastTime/liveTime);
        x0 = x0 + (pastTime * kx + pastTime * pastTime * kx) * factor;
        y0 = y0 + (pastTime * ky + pastTime * pastTime * ky) * factor;
        pastTime = 0;
        kx = -kx;
        ky = -ky;
      }
    };
  }
  const pSize = 50000;
  const particles = [];
  setInterval(() => {
    if (pauseCount) {
      pauseCount--;
      return;
    }
    if (particles.length && !particles[particles.length - 1]) {
      particles.pop();
      for (let i = 0; i < particles.length; i++) {
        particles[i].reverse();
      }
      pauseCount = 1;
      nextRandomParticle = null;
    }
    else {
      const moving = [];
      if (typeof nextRandomParticle === 'function') {
        for (let i = 0; i < pSize; i++) {
          const func = nextRandomParticle();
          if (func) {
            particles.push(func);
          }
          else if (particles[particles.length - 1]) {
            particles.push(null);
          }
        }
      }
      for (let i = 0; i < particles.length; i++) {
        const info = particles[i].next();
        if (info) {
          moving.push(info);
        }
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#001';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      [...moving, ...newState].forEach(({ x, y, fillStyle }) => {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, 1, 1);
      });
    }
  }, 33);
});
