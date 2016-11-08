/**
 * Created by fed on 2016/11/8.
 */
import { canvas, ctx } from './ctx';
import readImage from './read-image';
import co from 'co';

const { random } = Math;
const RANDOM_FACTOR = 5;

co(function *() {
  const img = yield readImage('./jiongxiong.jpeg');
  const imgWidth = parseInt(img.width / 2, 10);
  const imgHeight = parseInt(img.height / 2, 10);
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
      debugger;
      const sum = color.reduce((sumed, x) => sumed + x, 0);
      if (sum < 755) {
        newState.push({
          x: j + startX + (0.5 - random()) * RANDOM_FACTOR,
          y: i + startY + (0.5 - random()) * RANDOM_FACTOR,
          fillStyle: `rgba(${color.join(',')}, 0.5)`,
        });
      }
    }
  }
  function nextRandomParticle() {
    const l = newState.length;
    const index = parseInt(random() * l, 10);
    const { x: x0, y: y0, fillStyle } = newState[index];
    const liveTime = parseInt(random() * 500, 10) + 100;
    const kx = (random() - 0.5) * 2 ;
    const ky = (random() - 0.5) * 2;
    let pastTime = 0;
    return function next() {
      if (pastTime > liveTime) return null;
      pastTime++;
      return {
          x: x0 + pastTime * kx,
          y: y0 + pastTime * ky,
          fillStyle,
      };
    };
  }
  const pSize = 400;
  const particles = new Array(pSize).fill(0).map(() => nextRandomParticle());
  setInterval(() => {
    const moving = [];
    for (var i = 0; i < pSize; i++) {
      const info = particles[i]();
      if (!info) {
        particles[i] = nextRandomParticle();
      }
      else {
        moving.push(info);
      }
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#fefefe';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    [...moving, ...newState].forEach(({ x, y, fillStyle }) => {
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x, y, 2, 2);
    });
  }, 33);
});
