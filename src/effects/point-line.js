/**
 * Created by fed on 2016/11/10.
 */
import {
  random,
  PI,
} from '../math/math';

function outOfRange(width, height, x, y) {
  return x < 0 || y < 0 || x > width || y > height;
}

function positionGenerator(width) {
  return parseInt(width / 2 + (random() - 0.5) * width / 1.3, 10)
}

class Point {
  constructor(width, height, fn) {
    this.x = positionGenerator(width);
    this.y = positionGenerator(height);
    this.radius = parseInt(random() * 10) + 2;
    this.nextX = 0;
    this.nextY = 0;
    this.x0 = 0;
    this.y0 = 0;
    this.duration = 0;
    this.pastTime = 0;
    this.fn = fn;
    this.next(width, height);
  }
  draw({width, height}, ctx, points) {
    if (!outOfRange(width, height, this.x, this.y)) {
      ctx.beginPath();
      ctx.arc(this.x ,this.y, this.radius, 0, 2 * PI);
      ctx.fill();
      ctx.beginPath();
      points.forEach(point => {
        if (outOfRange(width, height, point.x, point.y)) return;
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
    }
    else {
      this.duration = 2500;
      this.pastTime = 0;
      if (outOfRange(width, height, this.x, this.y)) {
        this.x = positionGenerator(width);
        this.y = positionGenerator(height);
      }
      this.x0 = this.x;
      this.y0 = this.y;
      if (random() > 0.5) {
        this.nextX = random() > 0.5 ? -1 : width + 1;
        this.nextY = this.y + (random() - 0.5) * 2 * (height - this.y);
      } else {
        this.nextX = this.x + (random() - 0.5) * 2 * (width - this.x);
        this.nextY = random() > 0.5 ? -1 : height + 1;
      }
    }
  }
}

export default function (ctx, canvas, fillStyle, strokeStyle, fn) {
  const points = new Array(9).fill(0).map(() => new Point(canvas.width, canvas.height, fn));
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  function f() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => point.draw(canvas, ctx, points));
    requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
  // setInterval(f, 30;)
}
