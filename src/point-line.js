/**
 * Created by fed on 2016/11/10.
 */
import easing from 'easing-js';
import {
  canvas,
  ctx,
} from './util/ctx';
import pointLine from './effects/point-line';

pointLine(ctx, canvas, 'rgba(244, 244, 244, 0.8)', 'rgba(222, 222, 222, 0.2)', easing.easeOutQuad);
