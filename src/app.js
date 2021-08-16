const http = require('http')
const express = require('express')
const db = require('./models/authentification.js')
var session = require('express-session')
var multer = require('multer')
var socket = require('socket.io')
var cookieParser = require('cookie-parser') 
const query = require('./models/query.js')
const path = require('path')
var app = express()

app.use(express.static(__dirname + '/views'))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'dada',
  resave: 'false',
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(cookieParser())
app.set('view engine', 'ejs')

var ssn
var serverInfos = {
  connected : 0
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'views/users/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var uploads = multer({ storage: storage })

app.get('/', (req, res, next) => {
    res.render('index', { ssn })
})
app.get('/register', (req, res, next) => {
  res.render('register', { ssn })
})
app.get('/login', (req, res) => {
  res.render('login', { ssn })

})
app.post('/reg', (req, res, next) => {
  const usr = req.body
  ssn = req.session

  db.register(usr.email, usr.password, usr.age, usr.gender, usr.pseudo)
  .then(result => { 
    ssn.pseudo = usr.pseudo
    ssn.email = usr.email
    ssn.age = usr.age
    ssn.gender = usr.gender
    ssn.isPsychic = 0
    ssn.clientConnected = true
    serverInfos.connected += 1
    res.redirect('/')
  })
  .catch(err => {
    ssn.clientConnected = false
    res.redirect('/register')
  })
})

.post('/log', (req, res, next) => {
  ssn = req.session
  db.login(req.body.email, req.body.password)
  .then(result => {
    ssn.pseudo = result.pseudo
    ssn.email = result.email
    ssn.password = result.password
    ssn.isPsychic = result.psychic
    ssn.clientConnected = true
    serverInfos.connected += 1
    res.redirect('/')
  })
  .catch(err => {
    console.log(err)
    ssn.clientConnected = false
    res.redirect('/login')
  })
  
})
.get('/profil', (req, res) => {
  query.fetchAvatarFilename(ssn.email)
    .then(filename => {
    const path = 'users/uploads/' + filename
    ssn.avatarFilename = path
    res.render('profil', { ssn })
  })
  .catch(rej => {
    ssn.avatarFilename = rej
    res.render('profil', { ssn })
  })
})

.get('/logout', (req, res, next) => {
  ssn = null
  serverInfos.connected -= 1
  res.redirect('/')
  next()
})
.post('/user_informations_edit', uploads.single('avatar'), (req, res) => {
  query.updateAvatarFilename(ssn.email, req.file.filename)
  res.redirect('/profil')
})
.post('/user_email_edit', (req, res) => {
  console.log(ssn.email)
  query.updateUserEmail(ssn.email, req.body.email).then(resolve => {
    ssn.isEmailEdited = resolve
    ssn.email = req.body.email
    res.redirect('/profil')
  })
  .catch((rej) => {
    ssn.isEmailEdited = rej
    res.redirect('/profil')
  })
})

.post('/user_password_edit', (req, res) => {
  
})
.get('/register_psychic', (req, res) => {
  res.render('register-psychic', { ssn })
})

.post('/reg_psychic', (req, res) => {
  const isPsychic = 1
  const usr = req.body
  console.log(usr.email, usr.password, usr.age, usr.gender, usr.pseudo, isPsychic)
  db.register(usr.email, usr.password, usr.age, usr.gender, usr.pseudo, isPsychic)
  .then(result => {
    ssn.pseudo = usr.pseudo
    ssn.email = usr.email
    ssn.clientConnected = true
    serverInfos.connected += 1
    ssn.isPsychic = 1
    res.redirect('/', { ssn })
  }).catch(err => {
    ssn.clientConnected = false
    res.redirect('/register_psychic', { ssn })
  })
})
.get('/infos', (req, res) => {
  if (ssn.isPsychic) {

    res.render('informations', { ssn })

  }
})
.get('/administration', (req, res) => {
  res.render('admin', { serverInfos })
})
app.listen(8080)