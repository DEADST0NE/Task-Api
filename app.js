const express = require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    const url = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
    mongoose.set('useUnifiedTopology', true); // The new parser
    await mongoose.connect(url, {useNewUrlParser: true})
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) {
    console.log('Ошибка подключения к базе данных', e );
  }
}

start();