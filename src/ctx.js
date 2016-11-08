/**
 * Created by fed on 2016/11/8.
 */
export const canvas = document.createElement('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);
