import app from "./server.js"
// import http from "http"
// import https from "https"
// import fs from "fs"

import UdpechoDAO from "./dao/udpechoDAO.js"
import dgram from 'node:dgram'
import moment from 'moment-timezone'
import validator from 'validator'
import net from 'node:net'

const server = dgram.createSocket('udp4')
const server1 = dgram.createSocket('udp4')

let echodelayms = 0

//SQLite3 DB Setup
UdpechoDAO.createTable()
//debug
//UdpechoDAO.printMessages()

// UDP Server
server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`)
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg}[${rinfo.size}] from ${rinfo.address}:${rinfo.port}`)
  let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
  //add to db
  // UdpechoDAO.addMessage('Rx', timestamp, rinfo.address, rinfo.port, msg, rinfo.size)
  //to prevent xss atack
  UdpechoDAO.addMessage('Rx', timestamp, rinfo.address, rinfo.port, validator.escape(msg.toString()), rinfo.size)

  //send echo and add to db
  if (echodelayms > 0) {
      setTimeout((address, port, message) => {
        server.send(message, port, address, (err) => {
          if (err) {
            console.error(err.message)
          } else {
            let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
            console.log(`server sent: ${message}[${rinfo.size}] to ${address}:${port}`)
            UdpechoDAO.addMessage('Tx', timestamp, address, port, validator.escape(message.toString()), rinfo.size)
          }
        })
      }, echodelayms, rinfo.address, rinfo.port, msg)
  } else {
    server.send(msg, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error(err.message)
      } else {
        timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
        console.log(`server sent: ${msg}[${rinfo.size}] to ${rinfo.address}:${rinfo.port}`)
        UdpechoDAO.addMessage('Tx', timestamp, rinfo.address, rinfo.port, validator.escape(msg.toString()), rinfo.size)
      }
    })
  }
  
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`)
});

server1.on('error', (err) => {
  console.error(`server1 error:\n${err.stack}`)
  server1.close();
});

server1.on('message', (msg, rinfo) => {
  console.log(`server1 got: ${msg}[${rinfo.size}] from ${rinfo.address}:${rinfo.port}`)
  let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
  //add to db
  // UdpechoDAO.addMessage('Rx', timestamp, rinfo.address, rinfo.port, msg, rinfo.size)
  //to prevent xss atack
  UdpechoDAO.addMessage('Rx', timestamp, rinfo.address, rinfo.port, validator.escape(msg.toString()), rinfo.size)
});

server1.on('listening', () => {
  const address = server1.address();
  console.log(`server1 listening ${address.address}:${address.port}`)
});

server.bind(5000)
server1.bind(5001)

const tcpServer = net.createServer((socket) => {
  
  const remoteAddress = socket.remoteAddress;
  const remotePort = socket.remotePort;
		
  console.log('TCP Client connected');

  socket.setTimeout(30000)

  socket.on('data', (data) => {
    console.log(`Tserver got: ${data}[${data.length}] from ${remoteAddress}:${remotePort}`)
    let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
    UdpechoDAO.addMessage('Rx', timestamp, remoteAddress, remotePort, validator.escape(data.toString()), data.length)

    socket.write(data, (err) => {
      if (err) {
        console.error(err.message)
      } else {
        timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
        console.log(`Tserver sent: ${data}[${data.length}] to ${remoteAddress}:${remotePort}`)
        UdpechoDAO.addMessage('Tx', timestamp, remoteAddress, remotePort, validator.escape(data.toString()), data.length)
      }
    })
  });

  socket.on('end', () => {
    console.log('TCP Client disconnected')
  });

  socket.on('error', (err) => {
    console.log(`TCP socket error:{err}`)
  });
});
tcpServer.listen(3000, () => {
  console.log('TCP Server listening')
});
tcpServer.on('error', (err) => {
  console.log(`TCP Server Error:${err}`);
});

const tcpServer1 = net.createServer((socket) => {
  
  const remoteAddress = socket.remoteAddress;
  const remotePort = socket.remotePort;
		
  console.log('TCP Client1 connected');

  socket.setTimeout(30000)

  socket.on('data', (data) => {
    console.log(`Tserver got: ${data}[${data.length}] from ${remoteAddress}:${remotePort}`)
    let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
    UdpechoDAO.addMessage('Rx', timestamp, remoteAddress, remotePort, validator.escape(data.toString()), data.length)
  });

  socket.on('end', () => {
    console.log('TCP Client1 disconnected')
  });

  socket.on('error', (err) => {
    console.log(`TCP socket1 error:{err}`)
  });
});
tcpServer1.listen(3001, () => {
  console.log('TCP Server1 listening')
});
tcpServer1.on('error', (err) => {
  console.log(`TCP Server1 Error:${err}`);
});

//Express setup
const HTTP_PORT = process.env.PORT || 8000
// const HTTPS_PORT = process.env.PORT || 8001
// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
//   requestCert: false,
//   rejectUnauthorized: false
// };

app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`)
})
// Create an HTTP server.
// http.createServer(app).listen(HTTP_PORT, () => {
//   console.log(`http listening on port ${HTTP_PORT}`)
// });

// Create an HTTPS server.
// https.createServer(options, app).listen(HTTPS_PORT, () => {
//   console.log(`https listening on port ${HTTPS_PORT}`)
// });

