//const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config')
const ClientFtp = require('ftp')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports.login = async (req, res) => {
  const users = await prisma.users.findMany()
  console.log(users); 
  res.status(409).json({ message: 'Ошибка подключения к базе данных' })
  // let condidate;
  // await postgres.query(`SELECT * FROM users WHERE upper(email) = upper('${req.body.email}')`, (err, response)=>{
  //   if(err) {
  //     res.status(409).json({ message: 'Ошибка подключения к базе данных' })
  //     return;
  //   }else { 
  //     condidate = {...response.rows[0]};
  //     if(condidate){
  //       if(condidate.password == req.body.password){
  //         const token = jwt.sign({ ...condidate }, config.token_config, {expiresIn: 60 * 60})
  //         res.status(200).json({ token: token })
  //         return;
  //       }else {
  //         res.status(401).json({
  //           message: 'Неверный пароль'
  //         })
  //         return;
  //       }
  //     }else{
  //       res.status(404).json({
  //         message: 'Пользователь с указаным Email не найден'
  //       })
  //       return;
  //     }
    
  //     res.status(200).json({
  //       email: req.body.email, 
  //       password: req.body.password,
  //     })
  //   }
  // });  
}


module.exports.register = async (req, res) => { 
  // const response = await postgres.query(`SELECT * FROM users WHERE upper(email) = '${req.body.email.toUpperCase()}'`);
  // const condidate = response.rows
  // if (condidate.length) {
  //   res.status(409).json({
  //     message: 'Пользователь с таким email уже существует.'
  //   })
  // }
  // else {
  //   const user = new User({
  //     email: req.body.email, 
  //     password: req.body.password,
  //   })
  //   try{ 
  //     await user.save().then(() => {
  //       res.status(201).json(user)
  //     }).then(() => {
  //       ftpListFile();
  //     })
  //   } catch (e) {  
  //     res.status(409).json({
  //       message: `Ошибка при сохранении пользователя в базу данных. ${e?.errors?.email?.properties?.message}`
  //     })
  //   } 
  // } 
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