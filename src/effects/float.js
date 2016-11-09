/**
 * Created by fed on 2016/11/9.
 */
import {
  random,
  square,
} from '../math/math';

const RANDOM_FACTOR = 5;
const bgColor = '#fff';

function nextPosition(x0, y0, kx, ky, pastTime, liveTime, fillStyle) {
  const factor = 1 - square(0.5 - pastTime/liveTime);
  return {
    x: x0 + (pastTime * kx + square(pastTime) * kx) * factor,
    y: y0 + (pastTime * ky + square(pastTime) * ky) * factor,
    fillStyle,
  };
}

export default function (canvas, ctx, img) {
  const imgWidth = parseInt(img.width / 4, 10);
  const imgHeight = parseInt(img.height / 4, 10);
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
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
    let kx = (random() - 0.5) * 0.1 ;
    let ky = (random() - 0.5) * 0.1;
    let pastTime = 0;
    let added = false;
    return {
      next() {
        if (pastTime == liveTime) {
          if (!added) {
            revCount ++;
            added = true;
          }
          else {
            if (revCount === initLength) {
              for (let i = 0; i < particles.length; i++) {
                particles[i].reverse();
              }
              revCount = 0;
              pauseCount = 30;
            }
          }
        }
        else {
          pastTime++;
        }
        return nextPosition(x0, y0, kx, ky, pastTime, liveTime, fillStyle);
      },
      reverse() {
        added = false;
        const factor = 1 - square(0.5 - pastTime/liveTime);
        x0 = x0 + (pastTime * kx + pastTime * pastTime * kx) * factor;
        y0 = y0 + (pastTime * ky + pastTime * pastTime * ky) * factor;
        pastTime = 0;
        kx = -kx;
        ky = -ky;
      },
    };
  }
  const pSize = 100;
  const particles = [];
  let lastResult;
  function traverse(ctx) {

  }
  const animationFn = () => {
    if (pauseCount) {
      pauseCount--;
    }
    else {
      if (particles.length && !particles[particles.length - 1]) {
        // particles.pop();
        // for (let i = 0; i < particles.length; i++) {
        //   particles[i].reverse();
        // }
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
          }
        }
        for (let i = 0; i < particles.length; i++) {
          const info = particles[i].next();
          if (info) {
            moving.push(info);
          }
        }
        lastResult = [...moving, ...newState];
      }
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    const l = lastResult.length;
    for (let i = 0; i < lastResult.length; i++) {
      const { x, y, fillStyle } = lastResult[i];
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x, y, 1, 1);
    }
    requestAnimationFrame(animationFn);
  };
  requestAnimationFrame(animationFn);
}