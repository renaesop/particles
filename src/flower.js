/**
 * Created by fed on 2016/11/9.
 */
import co from 'co';

import { canvas, ctx } from './ctx';
import readImage from './read-image';
import flowerEffect from './effects/flower';


co(function *() {
  const img = yield readImage('./77.png');
  flowerEffect(canvas, ctx, img);
});
