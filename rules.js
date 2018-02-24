/**
 * @author Created by felix on 18-2-13.
 * @email   307253927@qq.com
 */
'use strict';
const {sort} = require('./utils')

const types  = {
  single  : 1,  //单张
  twain   : 2,  //对子
  twains  : 3,  //连对
  straight: 4,  //顺子
  three   : 5,  //三带
  four    : 6,  //四带
  airplane: 7,  //飞机
  bomb    : 8,  //炸弹
  kingBomb: 9   //王炸
}

function getMap(arr) {
  const map = {}
  arr.forEach((e) => {
    if (!map[e]) {
      map[e] = {value: e > 2 ? e : (13 + e), size: 1}
    } else {
      map[e].size++
    }
  })
  const keys   = sort(Reflect.ownKeys(map))
  const values = keys.map(k => map[k])
  Reflect.defineProperty(map, 'keys', {
    value() {
      return keys
    }
  })
  Reflect.defineProperty(map, 'size', {
    value: keys.length
  })
  Reflect.defineProperty(map, 'values', {
    value() {
      return values
    }
  })
  return map
}

function getMaxSizeValue(m1, m2) {
  return m1.size > m2.size ? m1.value : m2.value
}

//对子或王炸
function two(map) {
  if (map.size === 1) {
    return {type: types.twain, value: map.values()[0].value}
  } else {
    const values = map.values()
    if (values[0].value === 53 && values[1].value === 54) {
      return {type: types.kingBomb}
    }
  }
  return false
}

function three(map) {
  if (map.size === 1) {
    return {type: types.three, value: map.values()[0].value}
  } else {
    return false
  }
}

function four(map) {
  if (map.size === 1) {
    return {type: types.bomb, value: map.values()[0].value}
  } else if (map.size === 2) {
    const values = map.values()
    if (Math.max(values[0].size, values[1].size) === 3) {
      return {type: types.three, value: getMaxSizeValue(values[0], values[1])}
    }
  }
  return false
}

function airplane(map) {
  let sv = {}, values = map.values();
  values.forEach(v => {
    if (sv[v.size]) {
      sv[v.size].push(v.value)
    } else {
      sv[v.size] = [v.value]
    }
  })
  let keys = sort(Reflect.ownKeys(sv));
  if (Math.max(...keys) === 3) {
    if (keys.length === 1) {
      return {type: types.airplane, value: sort(sv[3])[0]}
    } else if (keys.length === 2 && sv[keys[0]].length === sv[keys[1]].length && Math.min(...keys) <= 2) {
      const vs = sort(sv[3])
      if ((vs[0] + vs.length - 1) === vs[vs.length - 1]) {
        return {type: types.airplane, value: vs[0]}
      }
    }
  }
  return false
}

function other(map, arr) {
  const length = arr.length;
  if (map.size === length) {  //顺子
    if (arr[0] > 2 && arr[0] + length - 1 === arr[length - 1]) {
      return {type: types.straight, value: arr[0]}
    }
  } else if (map.size === length / 2) {
    let temp = sort([...new Set(arr)]), key;
    if (map.size === 3 && map.keys().some(k => (key = k, map[k].size === 4))) {
      return {type: types.four, value: key}
    } else if (temp[0] > 2 &&
      temp[0] + temp.length - 1 === temp[temp.length - 1] &&
      map.keys().every(k => map[k].size === 2)) {
      return {type: types.twains, value: temp[0]}
    } else {
      return airplane(map)
    }
    
  } else if (map.size === 2) {
    const values  = map.values()
    const maxSize = Math.max(values[0].size, values[1].size)
    const minSize = Math.min(values[0].size, values[1].size)
    //三带一
    if (maxSize === 3 && minSize < 3) {
      return {type: types.three, value: getMaxSizeValue(values[0], values[1])}
    }
    //四带一
    if (maxSize === 4 && minSize < 3) {
      return {type: types.four, value: getMaxSizeValue(values[0], values[1])}
    }
    //2飞机 不带
    if (values[0].size === values[1].size && Math.abs(values[0].value - values[1].value) === 1) {
      return {type: types.airplane, value: Math.min(values[0].value, values[1].value)}
    }
  } else {
    return airplane(map)
  }
  return false
}

function readPoker(arr) {
  if (!arr || !arr.length) {
    return false
  }
  const temp = sort(arr);
  const map  = getMap(temp);
  let poker;
  switch (arr.length) {
    case 1:
      poker = {type: types.single, value: map.values()[0].value}
      break;
    case 2:
      poker = two(map)
      break;
    case 3:
      poker = three(map)
      break;
    case 4:
      poker = four(map)
      break;
    default:
      poker = other(map, arr)
      break;
  }
  if (poker) {
    poker.bufs = temp
  }
  return poker
}

/**
 * 比较牌面大小
 * @param poker1
 * @param poker2
 * @return {number}  1:大于, 0:小于 -1:等于 -2:无法比较
 */
function compare(poker1, poker2) {
  if (!poker1 || !poker2) {
    return -2
  } else if (poker1.type !== poker2.type) {
    if (poker1.type === types.kingBomb) {
      return 1
    } else if (poker2.type === types.kingBomb || poker2.type === types.bomb) {
      return 0
    } else if (poker1.type === types.bomb) {
      return 1
    }
    return -2
  } else if (poker1.bufs.length !== poker2.bufs.length) {
    return -2
  } else if (poker1.value === poker2.value) {
    return -1
  } else {
    return poker1.value > poker2.value ? 1 : 0
  }
}

module.exports = {
  readPoker,
  compare
}