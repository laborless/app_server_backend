import app from "./server.js"
import UdpechoDAO from "./dao/udpechoDAO.js"
import dgram from 'node:dgram'
import moment from 'moment-timezone'

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
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
  //add to db
  UdpechoDAO.addMessage('Rx', timestamp, rinfo.address, rinfo.port, msg)

  //send echo and add to db
  if (echodelayms > 0) {
      setTimeout((address, port, message) => {
        server.send(message, port, address, (err) => {
          if (err) {
            console.error(err.message)
          } else {
            let timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
            console.log(`server sent: ${message} to ${address}:${port}`)
            UdpechoDAO.addMessage('Tx', timestamp, address, port, message)
          }
        })
      }, echodelayms, rinfo.address, rinfo.port, msg)
  } else {
    server.send(msg, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error(err.message)
      } else {
        timestamp = moment().tz("Europe/Rome").format('YYYY-MM-DD kk:mm:ss.SSS')
        console.log(`server sent: ${msg} to ${rinfo.address}:${rinfo.port}`)
        UdpechoDAO.addMessage('Tx', timestamp, rinfo.address, rinfo.port, msg)
      }
    })
  }
  
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`)
});

server.bind(5683)

//Express setup
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})


/* example codes */

// server.send(message, 41234, 'localhost', (err) => {
//   client.close();
// })

