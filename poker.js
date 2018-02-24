/**
 * @author Created by felix on 18-2-13.
 * @email   307253927@qq.com
 */
'use strict';

const {shuffle, sort} = require('./utils')

class Poker {
  constructor() {
    this._pokers  = [];  //初始牌
    this.cards    = [];  //底牌
    this.landlord = 0;   //地主
    this.u1Cards  = [];  //玩家1
    this.u2Cards  = [];  //玩家2
    this.u3Cards  = [];  //玩家3
    for (let i = 1; i <= 13; i++) {
      this._pokers.push(...[i, i, i, i])
    }
    this._pokers.push(...[53, 54])
  }
  
  shuffle() {
    this.cards    = [];
    this.u1Cards  = [];
    this.u2Cards  = [];
    this.u3Cards  = [];
    this.landlord = Math.floor(Math.random() * 3)
    return shuffle(this._pokers)
  }
  
  nextLandlord() {
    return this.landlord = (++this.landlord) % 3
  }
  
  deal() {
    const pokers = this.shuffle()
    while (pokers.length > 3) {
      this.u1Cards.push(pokers.pop())
      this.u2Cards.push(pokers.pop())
      this.u3Cards.push(pokers.pop())
    }
    sort(this.u1Cards)
    sort(this.u2Cards)
    sort(this.u3Cards)
    this.cards = [...pokers]
  }
}

module.exports = Poker