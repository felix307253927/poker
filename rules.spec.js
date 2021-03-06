const assert               = require('assert')
const {readPoker, compare} = require('./rules')


function testRule() {
  assert(readPoker([1]), '单张')
  assert(!readPoker([1, 2]), '不是对子')
  assert(readPoker([2, 2]), '对子')
  assert(readPoker([53, 54]), '王炸')
  assert(readPoker([2, 2, 2]), '三带')
  assert(readPoker([2, 2, 2, 3]), '三带一')
  assert(!readPoker([2, 2, 4, 3]), '错错误的牌')
  assert(readPoker([2, 2, 2, 2]), '炸弹')
  assert(!readPoker([2, 2, 3, 3]), '错误的牌')
  assert(readPoker([2, 2, 2, 3, 3]), '三带二')
  assert(readPoker([2, 2, 2, 2, 3]), '四带一')
  assert(readPoker([3, 4, 5, 6, 7]), '顺子')
  assert(readPoker([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), '顺子')
  assert(readPoker([3, 4, 5, 6, 7, 8, 9]), '顺子')
  assert(!readPoker([2, 3, 4, 5, 6, 7]), '错误')
  assert(readPoker([3, 3, 4, 4, 5, 5]), '连对')
  assert(!readPoker([6, 3, 4, 5, 6, 7]), '错误')
  assert(readPoker([2, 2, 2, 2, 3, 3]), '四带二')
  assert(readPoker([2, 2, 2, 2, 3, 4]), '四带二')
  assert(readPoker([2, 2, 2, 1, 1, 1]), '飞机')
  assert(readPoker([3, 3, 3, 4, 4, 4]), '飞机')
  assert(!readPoker([3, 3, 3, 4, 4, 5]), '错误')
  assert(!readPoker([3, 3, 3, 4, 4, 4, 1]), '错误')
  assert(readPoker([3, 3, 3, 4, 4, 4, 1, 2]), '飞机')
  assert(readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5]), '飞机')
  assert(readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 8, 9]), '飞机')
  assert(!readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 7, 8, 8, 9, 9]), '错误')
  assert(readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 8, 8, 9, 9]), '飞机')
  assert(readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 11, 8, 9, 13]), '飞机')
  assert(readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 11, 11, 8, 8, 9, 9, 13, 13]), '飞机')
  assert(!readPoker([3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 10, 11, 8, 8, 9, 9]), '错误')
}

function testCompare() {
  assert(compare(readPoker([1]), readPoker([2])) === 0)
  assert(compare(readPoker([1]), readPoker([11])) === 1)
  assert(compare(readPoker([1, 1]), readPoker([11, 11])) === 1)
  assert(compare(readPoker([1, 1, 1]), readPoker([11, 11, 11])) === 1)
  assert(compare(readPoker([12, 12, 12, 4]), readPoker([11, 11, 11, 4])) === 1)
  assert(compare(readPoker([5]), readPoker([4])) === 1)
  assert(compare(readPoker([5, 5]), readPoker([4, 4])) === 1)
  assert(compare(readPoker([5, 5]), readPoker([5, 5])) === -1)
  assert(compare(readPoker([3, 4, 5, 6, 7]), readPoker([4, 5, 6, 7, 8])) === 0)
  assert(compare(readPoker([3, 4, 5, 6, 7]), readPoker([4, 5, 6, 7, 8, 9])) === -2)
  assert(compare(readPoker([3, 3, 3]), readPoker([9, 9, 9])) === 0)
  assert(compare(readPoker([3, 3, 3, 1]), readPoker([9, 9, 9, 3])) === 0)
  assert(compare(readPoker([3, 3, 4, 4, 5, 5]), readPoker([4, 4, 5, 5, 6, 6])) === 0)
  assert(compare(readPoker([3, 3, 3, 4, 4]), readPoker([4, 4, 4, 6, 6])) === 0)
  assert(compare(readPoker([3, 3, 3, 3, 4, 4]), readPoker([4, 4, 4, 4, 3, 3])) === 0)
  assert(compare(readPoker([3, 3, 3, 3]), readPoker([4, 4, 4, 4, 3, 3])) === 1)
  assert(compare(readPoker([3, 3, 3, 3]), readPoker([53, 54])) === 0)
  assert(compare(readPoker([3, 3, 3, 4, 4, 4, 1, 2]), readPoker([53, 54])) === 0)
  assert(compare(readPoker([3, 3, 3, 4, 4, 4, 1, 2]), readPoker([5, 5, 5, 6, 6, 6, 7, 8])) === 0)
  assert(compare(readPoker([3, 3, 3, 4, 4, 4, 1, 2]), readPoker([5, 5, 5, 6, 6, 6, 7, 7, 8, 8])) === -2)
  assert(compare(readPoker([53, 54]), readPoker([5, 5, 5, 6, 6, 6, 7, 7, 8, 8])) === 1)
  assert(compare(readPoker([7, 7, 7, 7]), readPoker([5, 5, 5, 6, 6, 6, 7, 7, 8, 8])) === 1)
}

// testRule()
// testCompare()

// console.log(readPoker([3,4, 5, 6, 7, 8, 9, 10, 11, 12, 13]))

console.log(readPoker([12, 12, 12, 4]))
console.log(readPoker([11, 11, 11, 4]))
console.log(compare(readPoker([11, 11, 11, 4]), readPoker([12, 12, 12, 4])))