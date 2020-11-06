const app = require('./src/app') 

const PORT = process.env.PORT || 3001

const start = async(err, req) => {
  console.log('start api url:',PORT)
  app.listen(PORT); 
}

start();