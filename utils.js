/**
 * @author Created by felix on 18-2-13.
 * @email   307253927@qq.com
 */
'use strict';

function shuffle(arr) {
  const ret    = [...arr]
  const length = arr.length
  let index    = -1
  while (++index < length) {
    const idx  = index + Math.floor(Math.random() * (length - index))
    const temp = ret[index]
    ret[index] = ret[idx]
    ret[idx]   = temp
  }
  return ret;
}

function sort(arr) {
  return arr.sort((a, b) => a - b)
}


module.exports = {
  shuffle,
  sort
}