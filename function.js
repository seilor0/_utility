
// ---------------------------
//            calc
// ---------------------------

export function xor(a,b) {
  if ( a&&!b || (!a)&&b ) return true;
  return false;
}

export function xnor(a,b) {
  if ( a&&b || (!a)&&(!b) ) return true;
  return false;
}

/**
 * 元の数値を小数点第n位で四捨五入する関数
 * @param {number} num 元の数値
 * @param {int} digit 四捨五入する桁数
 * @returns 
 */
export function floatRound(num, digit) {
  const levarage = Math.pow(10,digit);
  return Math.round(num*levarage)/levarage;
}

export function rgb2hex (rgb) {
  if (!rgb)  return undefined;
  return '#' + rgb.match(/\d+/g).map(x => Number(x).toString(16).padStart(2,'0')).join('');
}

// ---------------------------
//    create html element
// ---------------------------
/**
 * マルチセレクトエレメントをparentエレメントに追加する関数
 * @param {HTMLElement} parent 
 * @param {any has 'forEach' method} options
 * @returns {HTMLDivElement}
 */
export function createMultiSelect(parent, options=undefined, clickFunc=null) {
  const wrapper = document.createElement('div');
  const select  = document.createElement('div');
  const icon    = document.createElement('div');
  const background  = document.createElement('div');
  const multiPicker = document.createElement('div');
  
  wrapper.classList.add('multi-select','modal-close');
  icon.className = 'arrow';
  background.className  = 'background';
  multiPicker.className = 'multi-picker';

  select.appendChild(document.createElement('span'));
  select.appendChild(icon);
  
  wrapper.appendChild(select);
  wrapper.appendChild(background);
  wrapper.appendChild(multiPicker);

  setOptions2MultiSelect(wrapper,options);
  parent.appendChild(wrapper);

  // click events
  select.addEventListener('click', e=>e.currentTarget.closest('.multi-select').classList.remove('modal-close'));
  background.addEventListener('click', e=>e.currentTarget.closest('.multi-select').classList.add('modal-close'));

  multiPicker.addEventListener('click', e => {
    const selectedOptions = Array.from(e.currentTarget.querySelectorAll('input:checked'), input=>input.value).join(', ');
    e.currentTarget.parentElement.querySelector(':first-child > span').innerText = selectedOptions;
  });
  if (clickFunc) multiPicker.addEventListener('click', clickFunc);
  return wrapper;
}

/**
 * マルチセレクトエレメントに選択肢をセットする関数
 * @param {HTMLDivElement} multiSelect 
 * @param {any has 'forEach' method} options 
 */
export function setOptions2MultiSelect (multiSelect, options) {
  if(!options) return;
  const multiPicker = multiSelect.querySelector('.multi-picker');
  multiPicker.innerHTML = '';
  options.forEach(option => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = option;
    
    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    multiPicker.appendChild(label);
  });
  return;
}

/**
 * 指定のテーブルに行を追加する関数
 * @param {HTMLTableElement} parent 行を追加するエレメント(theader of tbody)
 * @param {Array || Int} content 追加する内容(forEach持ち) or 列数
 * @param {Number} thCol ヘッダーにする列の列数 デフォルトは-1(ヘッダーセルを作らない)
 * @param {Boolean} editable デフォルトfalse
 * @param {Map} eListener dragStart, dropが必要. nullならundraggableになる.
 * @returns {HTMLTableRowElement} 追加した行エレメント
 */
export function addRow(parent, content, thCol=-1, eListener=null, editable=false) {
  if (!parent || !content) return;
  if (Number.isInteger(content))  {
    content = Array(content).fill(null);
  }
  const row = document.createElement('tr');

  if (eListener) {
    row.draggable = true;
    row.addEventListener('dragenter', dragEnter);
    row.addEventListener('dragleave', dragLeave);
    row.addEventListener('dragover',  dragOver);
    
    eListener.forEach((value,key) => {
      if (typeof(value)=='function') row.addEventListener(key,value);
      else value.forEach(val=>row.addEventListener(key,val));
    });
  }

  content.forEach((value,i) => {
    const cell = document.createElement(i==thCol ? 'th' : 'td');
    // nullとundefinedだけ空にする
    cell.innerHTML = value!=null ? value : null;
    if (editable)  cell.contentEditable = 'plaintext-only';
    row.appendChild(cell);
  });

  parent.appendChild(row);
  return row;
}

// ---------------------------
//       Event Listener
// ---------------------------
export function dragEnter (e) {e.currentTarget.classList.add('target')}
export function dragLeave (e) {e.currentTarget.classList.remove('target')}
export function dragOver  (e) {e.preventDefault()};
export function clickNextInput (e) {
  if(e.currentTarget.nextElementSibling?.tagName=='INPUT') e.currentTarget.nextElementSibling.click();
}


// ---------------------------
//        get Element
// ---------------------------
export function batchMove(el, dirStr) {
  const func = (html, direction) => {
    if (!html) return null;
    switch (direction) {
      case '↑':
        return html.parentElement;
      case '←':
        return html.previousElementSibling;
      case '→':
        return html.nextElementSibling;
      case '↓':
        return html.firstElementChild;
      default:
        return null;
    }
  };
  dirStr.split('').forEach(direction => el = func(el, direction));
  return el;
}