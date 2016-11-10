/**
 * Created by fed on 2016/11/10.
 */
import easing from 'easing-js';
import {
  canvas,
  ctx,
} from './util/ctx';
import pointLine from './effects/point-line';

pointLine(ctx, canvas, 'rgba(188, 188, 188, 0.8)', 'rgba(188, 188, 188, 0.2)', easing.easeOutQuad);
