/**
 * Created by fed on 2016/11/8.
 */
import co from 'co';

import { canvas, ctx } from './util/ctx';
import readImage from './util/read-image';
import floatEffect from './effects/float';


co(function *() {
  const img = yield readImage('./77.png');
  floatEffect(canvas, ctx, img);
});
