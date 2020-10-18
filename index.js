const app = require('./src/app') 

const PORT = process.env.PORT || 3000

const start = async(err, req) => {
  app.listen(PORT); 
}

start();