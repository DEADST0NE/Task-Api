const jwt = require('jsonwebtoken')
const config = require('../config')
const ClientFtp = require('ftp')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

//------------ signIn ------------
module.exports.signIn = async (req, res) => { 
  try {
    const condidate = await prisma.users.findOne({
      where: {
        email: req.body.email,
      },
    })
    if(condidate) {
      if(condidate.password === req.body.password) {
        const token = jwt.sign({ ...condidate }, config.token_config, {expiresIn: 60 * 60}) 
        return res.status(200).json({ token: `Bearer ${token}` });
      } 
      return res.status(401).json({ message: 'Неверный пароль' });
    }
    return res.status(401).json({ message: 'Текущий email не зарегистрирован' });
  }
  catch (err){
    return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
  }  
}
//--------------------------------

//--------- refreshToken ---------
module.exports.refreshToken = (req, res) => { 
  const refreshToken = req.body.token; 
  if(refreshToken){ 
    const user = jwt.decode(refreshToken); 
    delete user.exp;
    delete user.iat;
    const token = jwt.sign({ ...user }, config.token_config);
    return res.status(200).json({ token: `Bearer ${token}` });
  }
  return res.status(401).json({ message: 'Токен не указан' });
}
//--------------------------------

//------------ signUp ------------
module.exports.signUp = async (req, res) => { 
  const condidate = await prisma.users.findOne({
    where: {
      email: req.body.email,
    },
  })
  if(!condidate) {
    const newCondidate = await prisma.users.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      }
    })
    const token = jwt.sign({ ...newCondidate }, config.token_config, {expiresIn: 60 * 60}) 
    return res.status(200).json({ token: `Bearer ${token}` });
  }
  return res.status(401).json({ message: 'Текущий email зарегистрирован' });
}
//--------------------------------

const putFileFtp = (path, file, fileName, expansion) => {
  let client = new ClientFtp();
  client.on('ready', () => {  
    client.append(file, `${path}/${fileName}.${expansion}`, (err, list) => {
      if (err) {
        console.log('Ошибка записи файла в ФТП', err); 
      }else console.log('Файл успешно загружен')
      client.end();
    }); 
  })
  client.connect(config.ftp_config);
}