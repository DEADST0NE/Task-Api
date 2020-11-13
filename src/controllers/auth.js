const jwt = require('jsonwebtoken')
const config = require('../config')
const ClientFtp = require('ftp')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const { getToken } = require('../utils/token')
const { hash, compare } = require('../utils/bcrypt')

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
      if(compare(condidate.password, req.body.password)) {
        delete condidate.password; 
        return res.status(200).json({ token: getToken({ ...condidate }) });
      } 
      return res.status(412).json({ password: 'Неверный пароль' });
    }
    return res.status(412).json({ email: 'Текущий email не зарегистрирован' });
  }
  catch (err){
    console.log(err);
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
    return res.status(200).json({ token: getToken({ ...user }) });
  }
  return res.status(401).json({ message: 'Токен не указан' });
}
//--------------------------------

//------------ signUp ------------
module.exports.signUp = async (req, res) => { 
  const coincident = await prisma.users.findOne({
    where: {
      email: req.body.email, 
    },
  })

  if(!coincident) {  
    const coincident = await prisma.users.findOne({
      where: {
        alias: req.body.alias, 
      },
    }) 
    if(!coincident) {
      const newCondidate = await prisma.users.create({
        data: {
          email: req.body.email,
          alias: req.body.alias,
          fio: req.body.fio,
          password: await hash(req.body.password)
        }
      })
      delete newCondidate.password;
      return res.status(200).json({ token: getToken({ ...newCondidate }) });
    } 
    return res.status(412).json({ alias: 'Текущий псевдоним зарегистрирован' });
  }
  return res.status(412).json({ email: 'Текущий email зарегистрирован' });
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