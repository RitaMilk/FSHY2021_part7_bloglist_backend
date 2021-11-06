const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users.map(u => u.toJSON()))
})
usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.password === undefined) {
    return response.status(400).json({ error: 'password missing' }).end()
  }
  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password have to be 3 or more marks' }).end()
  }
  {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    //response.json(savedUser)
    if (savedUser) {
      response.json(savedUser.toJSON())
    } else {
      response.status(404).end()
    }
  }
})

module.exports = usersRouter