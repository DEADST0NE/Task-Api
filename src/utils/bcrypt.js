const bcrypt = require('bcrypt')

module.exports.hash = async (password) => await bcrypt.hash(password, 10)

module.exports.compare = async (password, hash) => await bcrypt.compare(password, hash)