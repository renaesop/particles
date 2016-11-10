/**
 * Created by fed on 2016/11/8.
 */
const Promise = require('promise');
const req = require.context('../assets');

export default function readImage(name) {
  return new Promise(function (resolve) {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = req(name);
  })
}