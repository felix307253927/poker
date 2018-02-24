/**
 * @author Created by felix on 18-2-13.
 * @email   307253927@qq.com
 */
'use strict';
const Poker = require('./poker')

class User {
  constructor(name, socket) {
    this.name   = name
    this.id     = socket.id
    this.isLd   = false
    this.pokers = []
    this.score  = 0
    this.socket = socket
    this.roomId = null
  }
  
  send(...args) {
    if (args.length > 1) {
      this.socket.emit(...args)
    } else {
      this.socket.send(args[0])
    }
  }
  
  out() {
  
  }
  
  joinRoom(room, cb) {
    if (room.add(this)) {
      this.socket.join(room.id, () => {
        this.roomId = room.id
        cb && cb(true)
      })
    } else {
      cb && cb(false)
    }
  }
}

class Room {
  constructor(id = Date.now()) {
    this.id       = id;
    this.poker    = new Poker()
    this.users    = [];
    this.isStart  = false;
    this.desktop  = [];
    this.curUser  = -1
    this.curOut   = null
    this.landlord = 0
  }
  
  outPoker(user, pokers) {
    this.curUser = this.users.indexOf(user)
    if (this.desktop.length >= 2) {
      this.desktop.shift()
    }
    this.desktop.push({name: user.name, pokers, number: user.pokers.length})
    for (let i = this.desktop.length - 1; i >= 0; i--) {
      let p = this.desktop[i]
      if (p.pokers !== 'pass') {
        return p.pokers
      }
    }
    return 'pass'
  }
  
  nextOut() {
    const user = this.users[(this.curUser + 1) % 3]
    user.send('own', {
      msg: '请出牌',
      cmd: 0
    })
  }
  
  add(user) {
    this.leave(user)
    if (this.users.length < 3) {
      this.users.push(user)
      return user
    }
    return false
  }
  
  leave(user) {
    if (user.roomId) {
      for (let i = 0, len = this.users.length; i < len; i++) {
        const u = this.users[i]
        if (u.id === user.id) {
          this.users.splice(i, 1)
          u.socket.leave(user.roomId)
          return u
        }
      }
    }
    return null
  }
  
  shuffle() {
    this.isStart = false
    this.users.forEach(u => {
      u.isLd = false
    })
    this.poker.deal()
    this.landlord = this.poker.landlord
  }
  
  start() {
    this.isStart = true;
  }
  
  getDesktop() {
    let out = ''
    this.desktop.forEach(d => {
      out += `${d.name}:(\x1b[32m${d.number}\x1b[39m) ${Array.isArray(d.pokers) ? `[ \x1b[36m${d.pokers.join(' ')}\x1b[39m ]` : d.pokers}   `
    })
    return out;
  }
}

class RoomSev {
  constructor() {
    this._rooms = new Map()
  }
  
  join(id) {
    if (this._rooms.has(id)) {
      return this._rooms.get(id)
    } else {
      const room = new Room(id)
      this._rooms.set(id, room)
      return room
    }
  }
}

module.exports = {
  RoomSev,
  User
}