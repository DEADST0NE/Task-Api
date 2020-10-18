const express = require('express')
const authControllers = require('../controllers/auth')
const router = express.Router()



router.post('/login', authControllers.login) //api/auth/login 
router.post('/register', authControllers.register) //api/auth/register

module.exports = router