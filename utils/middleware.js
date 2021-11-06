//const config = require('./utils/config') //part4.22
const logger = require('./logger')
const jwt = require('jsonwebtoken') //part4.22
const User = require('../models/user') //part 4.22
const config = require('../utils/config') //part4.22
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}
//part 4.19: 4.20 as middleware getTokenFrom renamed tokenExtractor
const tokenExtractor = async(request, response, next) => {
  const authorization = await request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token=authorization.substring(7)
    //console.log('tokenExtractor:token from substring =',request.token)
  }
  //console.log('tokenExtractor token befor next=',request.token)
  next()
}
//part4.20
const userExtractor = async(request, response, next) => {
  //new code
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //console.log('4. blogsPost user decodedToken.id=',decodedToken.id)
  request.user = await User.findById(decodedToken.id)
  //new code
  //console.log('5.userExtractor token befor next=',request.token)
  //console.log('6.userExtractor user befor next=',request.user)
  next()
}
//part4.20

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}