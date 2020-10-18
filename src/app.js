const express = require('express')
const app = express()
const bodyParser = require('body-parser') 
const authRoutes = require('./routs/auth')

// Вспомогательные модули
  app.use(require('morgan')('dev'))
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(require('cors')())
// ======================

// Роуты
  app.use('/api/auth', authRoutes)
// =====

module.exports = app