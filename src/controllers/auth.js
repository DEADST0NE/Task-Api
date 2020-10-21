const jwt = require('jsonwebtoken')
const config = require('../config')
const ClientFtp = require('ftp')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports.login = async (req, res) => {
  try {
    const condidate = await prisma.users.findOne({
      where: {
        email: req.body.email,
      },
    })
    if(condidate) {
      if(condidate.password === req.body.password) {
        const token = jwt.sign({ ...condidate }, config.token_config, {expiresIn: 60 * 60})
        res.status(200).json({ token: token })
        return;
      } 
      else{
        res.status(401).json({
          message: 'Неверный пароль'
        })
        return;
      }
    }else{
      res.status(401).json({
          message: 'Текущий email не зарегистрирован'
        })
      return;
    }
  }
  catch (err){
    res.status(500).json({ message: 'Ошибка подключения к базе данных' })
    return;
  }  
}


module.exports.register = async (req, res) => { 
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
    console.log(newCondidate);
    const token = jwt.sign({ ...newCondidate }, config.token_config, {expiresIn: 60 * 60})
    res.status(200).json({ token: token })
    return;
  } else{
    res.status(401).json({
        message: 'Текущий email зарегистрирован'
      })
    return;
  }
}

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