import sqlite3 from 'sqlite3'

export default class TcpechoDAO {
	static createTable() {
		const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
			if (err) {
				console.error(err.message)
			}
		})

    db.run('CREATE TABLE messages(id integer primary key, time text not null, type text not null, address text not null, port text not null, payload blob, payload_len integer not null)', (err) => {
      if (err) {
        console.error(err.message)
      }
    })
		db.close()
	}

	static printMessages() {
		const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
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
        const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
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

  static async getLatestMessages() {
    try {
      return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          } 
        })

        db.all('SELECT * FROM messages ORDER BY rowid DESC LIMIT 10', (err, rows) => {
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

  static async getPage(num) {
    try {
      return new Promise((resolve, reject) => {
        const rowStart = num * 10
        const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          } 
        })

        // db.all(`SELECT * FROM messages ORDER BY rowid DESC LIMIT ${rowStart}, 10`, (err, rows) => {
        db.all(`SELECT * FROM messages ORDER BY rowid DESC LIMIT ${rowStart}, 10`, (err, rows) => {
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

  static async getIds() {
    try {
      return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          } 
        })

        db.all('SELECT id FROM messages', (err, rows) => {
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

  static async getCount() {
    try {
      return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          } 
        })

        db.all('SELECT COUNT(*) FROM messages', (err, rows) => {
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

  static async getMessage(id) {
    try {
      return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error(err.message)
            reject({ error: err })
          } 
        })

        db.all(`SELECT * FROM messages WHERE id = ${id}`, (err, rows) => {
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

	static addMessage(type, time, address, port, msg, size) {
		const db = new sqlite3.Database('./db/tcpecho.db', sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err.message)
        return
			} 
		})

    db.run(`INSERT INTO messages(type, time, address, port, payload, payload_len) VALUES('${type}','${time}','${address}','${port}','${msg}','${size}')`, (err) => {
      if (err) {
        console.error(err.message)
      }
    })

    db.close()
	}
}