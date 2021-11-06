//require('dotenv').config()
const app=require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
//const express = require('express')
//const app = express()
//const cors = require('cors')


//const mongoUrl = 'mongodb://localhost/bloglist'
///const mongoUrl = process.env.MONGODB_URI
//4.2console.log('connecting to', config.MONGODB_URI)
/*4.2 logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json()) 4.2*/


//const PORT = 3003
const server = http.createServer(app)
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
  //console.log(`Server running on port ${config.PORT}`)
})