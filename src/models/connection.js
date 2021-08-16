const { Pool } = require('pg')

const pool = new Pool({
	host: 'localhost',
	user: 'abbaoui',
	password: '',
	max: 20,
	database: 'voyance',
	port: '5432'
})

pool.query('SELECT NOW()', (err, res) => {
	console.log(err, res)
})

module.exports.pool = pool