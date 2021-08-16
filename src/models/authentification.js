const db = require('./connection.js')
const bcrypt = require('bcrypt')

const register = (email, passwd, age, gender, pseudo, isPsychic) => new Promise((res, rej) => {

	db.pool.query('SELECT email FROM accounts', (err, result) => {
		if (err) throw err

		for (row of result.rows) {
			if (row.email == email) {
				return rej('Acc already exist')
			}
		}
		const hashedPasswd = bcrypt.hashSync(passwd, 10)
		const date = Date.now()
		if (isPsychic) {
			db.pool.query(`INSERT INTO accounts(email, password, age, gender, created_on, pseudo, psychic)
			VALUES('${email}', '${hashedPasswd}', '${age}', '${gender}', '${date}', '${pseudo}', '${isPsychic}')`, (err, results) => {
				if (err) rej(err)
				res('Record acc')
			})	
		} else {
			db.pool.query(`INSERT INTO accounts(email, password, age, gender, created_on, pseudo)
			VALUES('${email}', '${hashedPasswd}', '${age}', '${gender}', '${date}', '${pseudo}')`, (err, results) => {
				if (err) rej(err)
				res('Record acc')
			})
		}
	})

})

const login = (email, passwd) => new Promise((res, rej) => {
	db.pool.query('SELECT * FROM accounts', (err, result) => {
		if (err) throw err	
		for(let row of result.rows) {
			if (row.email == email && bcrypt.compareSync(passwd, row.password)) {
				res(row)
			}
		}
		rej('Acc already exist')
	})
})


module.exports.login = login
module.exports.register = register
