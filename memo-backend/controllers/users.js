const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Profile = require('../models/profile')


usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.username || body.username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  }
  if (!body.password || body.password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!body.email || !emailRegex.test(body.email)) {
    return response.status(400).json({ error: 'invalid email address' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash
  })

  const savedUser = await user.save()

  // create profile
  const initialProfile = new Profile({
    userId: savedUser._id,
    health: 100,
    level: 1,
    experience: 0,
    coins: 0,
  })

  const savedProfile = await initialProfile.save();

  response.status(201).json(savedUser)
  // response.status(201).json({
  //   user: savedUser,
  //   profile: savedProfile
  // })
})


module.exports = usersRouter