const db = require('./connection.js')

const updateAvatarFilename = (email, filename) => {

  db.pool.query(`UPDATE accounts SET avatar_filename='${filename}' WHERE email='${email}'`, (err, res) => {
    if (err) throw err
  })
}

const fetchAvatarFilename = (email) => new Promise((res, rej) => {

  db.pool.query('SELECT * from accounts', (err, results) =>  {
    if (err) throw err
    for(row of results.rows) {
      if(row.email == email && row.avatar_filename != null) {

        res(row.avatar_filename)
      }
    }
    rej('users/uploads/default.png')
  })
})

const updateUserEmail = (oldEmail, email) => new Promise((res, rej) => {
  // à optimisier

  db.pool.query('SELECT * from accounts ', (err, result) => {
    for(row of result.rows) {
      if (row.email == email) {
        rej(false)
      }
    }
    db.pool.query(`UPDATE accounts SET email='${email}' WHERE email='${oldEmail}'`, (err, result) => {
      if (err) throw (err)
      res(true)
    })
  })
})

module.exports.updateUserEmail = updateUserEmail
module.exports.fetchAvatarFilename = fetchAvatarFilename
module.exports.updateAvatarFilename = updateAvatarFilename 

