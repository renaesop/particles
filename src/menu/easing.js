/**
 * Created by fed on 2016/11/10.
 */
import easing from 'easing-js';
const selectBox = document.createElement('select');
Object.keys(easing).forEach(key => {
  const option = document.createElement('option');
  option.value = key;
  option.innerText = key;
  selectBox.appendChild(option);
});
const container = document.createElement('div');
container.innerText = '选择动画效果';
container.appendChild(selectBox);
document.body.appendChild(container);

export default selectBox;