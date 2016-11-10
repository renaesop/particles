/**
 * Created by fed on 2016/11/9.
 */
import co from 'co';
import easing from 'easing-js';

import { canvas, ctx } from './util/ctx';
import selectBox from './menu/easing';
import readImage from './util/read-image';
import flowerEffect from './effects/flower';

let insStop = () => {};
function startAnimation() {
  insStop();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const val = selectBox.value;
  co(function *() {
    const img = yield readImage('./77.png');
    insStop = flowerEffect(canvas, ctx, img, easing[val]);
  });
}
selectBox.addEventListener('change', startAnimation);
startAnimation();

