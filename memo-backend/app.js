const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const path = require('path');


const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const habitsRouter = require('./controllers/habits');
const dailiesRouter = require('./controllers/dailies');
const todosRouter = require('./controllers/todos');
const rewardsRouter = require('./controllers/rewards');
const historiesRouter = require('./controllers/histories');
const profilesRouter = require('./controllers/profiles');
const shopRouter = require('./controllers/shop')

const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

if (config.TEST == 1){
    mongoose.connect(config.TEST_MONGODB_URI);
    console.log("running in test mongodb uri")
} else {
    mongoose.connect(config.MONGODB_URI);
    console.log("running in production mongodb uri")
}

app.use(cors())
app.use(express.json())

// app.use(express.static('build'))
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/habits', habitsRouter)
app.use('/api/dailies', dailiesRouter)
app.use('/api/todos', todosRouter)
app.use('/api/rewards', rewardsRouter)
app.use('/api/history', historiesRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/shop', shopRouter)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use(middleware.errorHandler)

module.exports = app