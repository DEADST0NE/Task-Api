const jwt = require('jsonwebtoken')
const tokenConfig = require('../config').token_config

module.exports.getToken = (data) => jwt.sign({ data }, tokenConfig.salt, tokenConfig.time)