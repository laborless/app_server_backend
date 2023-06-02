import sqlite3 from 'sqlite3'

export default class UdpechoDAO {
	static createTable() {
		const db = new sqlite3.Database('./db/udpecho.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
			if (err) {
				console.error(err.message)
			}
		})

    db.run('CREATE TABLE messages(id integer primary key, time text not null, type text not null, address text not null, port text not null, payload blob)', (err) => {
      if (err) {
        console.error(err.message)
      }
    })
		db.close()
	}

	static printMessages() {
		const db = new sqlite3.Database('./db/udpecho.db', sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err.message)
        return
			}
		})

    db.all('SELECT * FROM messages', (err, rows) => {
      if (err) {
        console.error(err.message)
      } else {
        rows.forEach( row => {
        console.log(row)
        })
      }
    })

		db.close()
	}

	static async getMessages() {
    try {
      return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db/udpecho.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          } 
        })

        db.all('SELECT * FROM messages', (err, rows) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          }
          resolve(rows)
        })
        db.close()
      })
    } catch (e) {
      console.error(`Unable to get messages: ${e}`)
      return { error: e }
    }
	}

	static addMessage(type, time, address, port, msg) {
		const db = new sqlite3.Database('./db/udpecho.db', sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err.message)
        return
			} 
		})

    db.run(`INSERT INTO messages(type, time, address, port, payload) VALUES('${type}','${time}','${address}','${port}','${msg}')`, (err) => {
      if (err) {
        console.error(err.message)
      }
    })

    db.close()
	}
}