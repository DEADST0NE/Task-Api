const express = require('express') 
const bodyParser = require('body-parser') 
const authRoutes = require('./routs/auth')
const passport = require('passport')

const app = express()

// Вспомогательные модули 
  app.use(require('morgan')('dev'))
  app.use(passport.initialize())
  require('./middleware/passport')(passport)
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(require('cors')())
// ======================

// Роуты
  app.use('/api/auth', authRoutes) 
// =====

module.exports = app