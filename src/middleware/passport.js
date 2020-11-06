const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keysJwt = require('../config').token_config
const { PrismaClient } = require('@prisma/client') 

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keysJwt
}

const prisma = new PrismaClient()

module.exports = passport => { 
  passport.use(
    new JwtStrategy(options, async(payload, done) => { 
      try {
        const user = await prisma.users.findOne({
          where: {
            email: payload.email,
          },
        })
        if(user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (error) {
        console.log(error);
      } 
    })
  )
}