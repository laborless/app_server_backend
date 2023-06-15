import app from "./server.js"
// import http from "http"
// import https from "https"
// import fs from "fs"

import UdpechoDAO from "./dao/udpechoDAO.js"
import dgram from 'node:dgram'
import moment from 'moment-timezone'
import validator from 'validator'

const server = dgram.createSocket('udp4')

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

server.bind(5000)

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

