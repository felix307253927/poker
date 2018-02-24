/**
 * @author Created by felix on 18-2-13.
 * @email   307253927@qq.com
 */
'use strict';
const server          = require('http').createServer();
const socketIo        = require('socket.io')
const {RoomSev, User} = require('./room')
const {sort}          = require('./utils')
require('colors')

const roomSev = new RoomSev()


const io = socketIo(server);

io.on('connection', (socket) => {
  let room, user, roomId;
  socket.on('join', (name, roomNo) => {
    roomId = roomNo
    user   = new User(name, socket)
    room   = roomSev.join(roomId)
    if (room) {
      user.joinRoom(room, (ok) => {
        if (ok) {
          const start = (msg = '等待开始...') => {
            room.shuffle()
            io.to(roomId).send(msg)
            io.to(roomId).emit('out', 'pass', '')
            setTimeout(() => {
              io.to(roomId).send('')
              room.users.forEach((u, i) => {
                u.pokers = room.poker[`u${i + 1}Cards`];
                u.send('poker', u.pokers)
                if (room.poker.landlord === i) {
                  u.send('own', {
                    msg: '\x1b[32m是否要地主?(y/n)\x1b[39m',
                    cmd: 2
                  })
                }
              })
            }, 400)
            console.log(msg)
          }
          socket.on('out', pokers => {
            if (pokers !== 'pass') {
              pokers.forEach(p => {
                user.pokers.splice(user.pokers.indexOf(p), 1)
              })
              user.send('poker', user.pokers)
              if (!user.pokers.length) {
                return io.to(roomId).emit('gameover', user.isLd ? "地主" : "平民")
              }
            }
            const curOut = room.outPoker(user, pokers)
            console.log('cur:', curOut)
            io.to(roomId).emit('out', curOut, room.getDesktop())
            room.nextOut()
          })
          socket.on('landlord', isLandlord => {
            if (isLandlord) {
              let user = room.users[room.poker.landlord]
              io.to(roomId).emit('out', 'pass', `底牌:[ \x1b[36m${room.poker.cards.join(' ')}\x1b[39m ]`)
              user.pokers = sort(user.pokers.concat(room.poker.cards))
              user.isLd   = true
              user.send('poker', user.pokers)
              user.send('own', {
                cmd: 0,
                msg: '\x1b[32m请出牌\x1b[39m'
              })
            } else {
              room.poker.landlord = (room.poker.landlord + 1) % 3;
              if (room.landlord !== room.poker.landlord) {
                let user = room.users[room.poker.landlord]
                user.send('own', {
                  msg: '\x1b[32m是否要地主?(y/n)\x1b[39m',
                  cmd: 2
                })
              } else {
                start('重新开始...')
              }
            }
          })
          socket.on('start', start)
          // user.send('join', `${user.name} 你已加如room:${roomId}`)
          io.to(roomId).emit('join', `用户:\x1b[33m${user.name}\x1b[39m 已加入room:\x1b[33m${room.id}\x1b[39m`)
          if (room.users.length === 3) {
            start()
          }
        } else {
          socket.emit('join', `加入失败`)
        }
      })
    } else {
      socket.emit('join', `加入失败!`)
    }
  })
  socket.on('disconnect', () => {
    if (user && roomId) {
      room.leave(user)
      io.to(roomId).emit('leave', `用户:\x1b[33m${user.name}\x1b[39m 已离开`)
    }
  })
});

server.listen(6000)
  

