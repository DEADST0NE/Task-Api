const express = require('express')
const authControllers = require('../controllers/auth')
const router = express.Router()
const passport = require('passport')

router.post('/signIn', authControllers.signIn) //api/auth/signIn 
router.post('/signUp', authControllers.signUp) //api/auth/signUp
router.post('/refreshToken', authControllers.refreshToken) //api/auth/refreshToken

router.get('/test', passport.authenticate('jwt', {session: false}), (req, res)=>{return res.status(200).json({ test: 'Все ок' });})

module.exports = router