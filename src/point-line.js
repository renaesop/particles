/**
 * Created by fed on 2016/11/10.
 */
import easing from 'easing-js';
import {
  canvas,
  ctx,
} from './util/ctx';
import pointLine from './effects/point-line';

pointLine(ctx, canvas, [188, 188, 188], [188, 188, 188], easing.easeOutQuad);
