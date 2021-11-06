const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  //console.log('1A.entered login post')
  const body = request.body

  //console.log('2.request.body.username=',request.body.username)

  const user = await User.findOne({ username: body.username })
  //console.log('3.user=',user)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  //console.log('5.ok user and password')
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  //console.log('6.token=',token)
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter