const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, email, password } = request.body

  if (!username && !email) {
    return response.status(400).json({
      error: 'Username or email is required'
    })
  }

  let user
  if (username) {
    user = await User.findOne({ username })
  }
  else {
    user = await User.findOne({ email })
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, email: user.email, id: user._id })
})

module.exports = loginRouter