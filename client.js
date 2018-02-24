/**
 * @author Created by felix on 18-2-13.
 * @email   307253927@qq.com
 */
'use strict';
require('colors')
const readline             = require('readline');
const {readPoker, compare} = require('./rules')
const inputStream          = process.stdin;
const outputStream         = process.stdout;
const socket               = require('socket.io-client')('http://192.168.6.155:6000')
const rl                   = readline.createInterface({
  input   : inputStream,
  output  : outputStream,
  terminal: true,
  prompt  : 'poker> '
});
const CMD                  = {
  out     : 0,
  pass    : 1,
  landlord: 2,
  restart : 3
};

let curCmd = -1, curPoker = 'pass', ownPoker = null;

function clear() {
  readline.cursorTo(inputStream, 0, 0)
  readline.cursorTo(outputStream, 0, 0)
  readline.clearScreenDown(inputStream)
  readline.clearScreenDown(outputStream)
}

function write(str) {
  readline.cursorTo(outputStream, 0, 0)
  readline.clearLine(outputStream, 0)
  outputStream.write(`${str}\n`)
  readline.cursorTo(outputStream, 7, 6)
  rl.prompt()
}

function showOutDesk(str) {
  readline.cursorTo(outputStream, 0, 2)
  readline.clearLine(outputStream, 0)
  outputStream.write(`${str}\n`)
  readline.cursorTo(outputStream, 7, 6)
  rl.prompt()
}

function showPoker(str) {
  readline.cursorTo(outputStream, 0, 5)
  readline.clearLine(outputStream, 0)
  outputStream.write(`${str}\n`)
  readline.cursorTo(outputStream, 7, 6)
  rl.prompt()
}

function afterOut() {
  curCmd = -1
  write('')
}

socket.on('connect', function () {
  clear()
  rl.question('输入用户名和房间号(用空格分割):\n', data => {
    const [name, room] = data.trim().split(/ +/)
    socket.emit('join', name, room)
    clear()
  })
});

socket.on('join', write)
socket.on('out', (cur, pokerStr) => {
  curPoker = cur
  showOutDesk(pokerStr)
})
socket.on('poker', pokers => {
  ownPoker = pokers
  showPoker(`[ ${pokers.join(' ').cyan} ] (${(pokers.length + '').green})`)
})
socket.on('message', write)
socket.on('own', (cmd) => {
  write(cmd.msg)
  curCmd = +cmd.cmd
})

socket.on('leave', msg => {
  clear()
  write(msg)
})

socket.on('gameover', (name) => {
  write('game over!  winner is ' + name.blue)
  curCmd = CMD.restart
})


rl.on('line', line => {
  line = line.replace('\n', '').trim()
  if (curCmd >= 0 && line) {
    switch (curCmd) {
      case CMD.out:
        if (line === 'pass' || line === 'p') {
          socket.emit('out', 'pass')
          afterOut()
        } else if (/^[0-9 ]+$/.test(line)) {
          const pokers = line.split(/ +/g).map(p => {
            return +p
          })
          let checked  = true, pks = [...ownPoker]
          pokers.forEach(p => {
            const idx = pks.indexOf(p)
            if (idx === -1) {
              write(`你没有这张牌: ${p}`.red)
              checked = false
            } else {
              pks.splice(idx, 1)
            }
          })
          if (checked) {
            if (curPoker === 'pass') {
              const pk = readPoker(pokers)
              if (pk) {
                socket.emit('out', pokers)
                afterOut()
              } else {
                write(`${pokers.join(' ')} 错误`.red)
              }
            } else {
              const ret = compare(readPoker(pokers), readPoker(curPoker))
              if (ret === 1) {
                socket.emit('out', pokers)
                write(`${pokers.join(' ')}`)
                afterOut()
              } else if (ret === 0 || ret === -1) {
                write(`${pokers.join(' ')} 太小了`.red)
              } else {
                write(`${pokers.join(' ')} 牌有问题`.red)
              }
            }
          }
        } else {
          write('你输入的牌不正确!'.red)
        }
        break;
      case CMD.landlord:
        socket.emit('landlord', line === 'y')
        write('')
        break;
      case CMD.restart:
        if (['start', 'restart', 's', 'r'].indexOf(line) > -1) {
          socket.emit('start')
        }
        break;
    }
  }
  readline.cursorTo(outputStream, 7, 6)
  readline.clearLine(outputStream, 1)
})
