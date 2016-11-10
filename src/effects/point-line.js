/**
 * Created by fed on 2016/11/10.
 */
import {
  random,
  PI,
  sqrt,
  square,
} from '../math/math';

function outOfRange(width, height, x, y) {
  return x < 0 || y < 0 || x > width || y > height;
}

function positionGenerator(width) {
  return parseInt(width / 2 + (random() - 0.5) * width / 1.3, 10)
}

class Point {
  constructor(width, height, fn, given) {
    this.x = given ? width : positionGenerator(width);
    this.y = given ? height : positionGenerator(height);
    this.radius = parseInt(random() * 10) + 2;
    this.nextX = 0;
    this.nextY = 0;
    this.x0 = 0;
    this.y0 = 0;
    this.duration = 0;
    this.pastTime = 0;
    this.fadedCount = 0;
    this.startCount = 0;
    this.fn = fn;
    this.max = sqrt(square(given ? given.width : width), square(given ? given.height : height));
    this.next(given ? given.width : width, given ? given.height : height);
  }
  draw({width, height}, ctx, points, fillStyle, strokeStyle) {
    if (!outOfRange(width, height, this.x, this.y)) {
      ctx.fillStyle = `rgba(${fillStyle.concat([0.8 * (1 - this.startCount / 100)]).join(',')})`;
      ctx.beginPath();
      ctx.arc(this.x ,this.y, this.radius, 0, 2 * PI);
      ctx.fill();
      ctx.beginPath();
      points.forEach(point => {
        if (outOfRange(width, height, point.x, point.y)) {
          point.fadedCount < 100 && point.fadedCount++;
        }
        const d = sqrt(square(this.x - point.x) + square(this.y - point.y));
        ctx.strokeStyle = `rgba(${strokeStyle.concat([0.4 * (1 - d / this.max) * (1 - point.fadedCount / 100) * (1 - this.startCount / 100)]).join(',')})`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
      });
    }
    this.next(width, height);
  }
  next(width, height) {
    if (this.pastTime < this.duration) {
      this.x = this.fn(this.pastTime, this.x0, this.nextX - this.x0, this.duration);
      this.y = this.fn(this.pastTime, this.y0, this.nextY - this.y0, this.duration);
      this.pastTime++;
      this.startCount && this.startCount--;
    }
    else {
      this.duration = parseInt(1500 + ((0.5 - random()) * 2000), 10);
      this.pastTime = 0;
      this.fadedCount = 0;
      this.startCount = 100;
      if (outOfRange(width, height, this.x, this.y)) {
        this.x = positionGenerator(width);
        this.y = positionGenerator(height);
      }
      this.x0 = this.x;
      this.y0 = this.y;
      if (random() > 0.5) {
        this.nextX = random() > 0.5 ? - 8 : (width + 8);
        this.nextY = this.y + (random() - 0.5) * 2 * (height - this.y) + 50;
      }
      else {
        this.nextX = this.x + (random() - 0.5) * 2 * (width - this.x) + 50;
        this.nextY = random() > 0.5 ? - 8 : (height + 8);
      }
    }
  }
}

export default function (ctx, canvas, fillStyle, strokeStyle, fn) {
  const points = new Array(9)
    .fill(0)
    .map((_, index) => {
      return {
        x: parseInt((canvas.width / 4) * (index % 3 + 1 + (0.5 - random())), 10),
        y: parseInt((canvas.height / 4) * (parseInt(index / 3, 10) + 1 + (0.5 - random())), 10),
      };
    })
    .map(({x, y}) => new Point(x, y, fn, canvas));
  function f() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => point.draw(canvas, ctx, points, fillStyle, strokeStyle));
    requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}
