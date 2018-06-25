const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const port = process.env.PORT || 3020
const mongoose = require('mongoose')
const config = require('./config/db')
const passport = require('passport')
const router = require('./routes/index')
const chalk = require('chalk')
const http = require('http')
const cors = require('cors')
const compression = require('compression')
const error = require('./middlewares/error')

const server = http.createServer(app)
const io = require('socket.io')(server)

require('./startup/logging')()

io.on('connection', (socket) => {
  console.log(`Nueva conexión, id: ${socket.id}`)
})

mongoose.Promise = require('bluebird')
mongoose.connect(config.database, {
  useMongoClient: true
})

//app.set('view engine', 'ejs')

app.use(compression())
app.use(bodyParser.json({
  limit: '4mb'
}))
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '4mb'
}))
//app.use(cookieParser())
app.use(cors())
app.use(logger('dev'))
app.use(helmet())
app.use(passport.initialize())

server.listen(port, () => {
  console.log(`${chalk.green('[berel-api]')} server listening on port ${port}`)
})

router(app, io)
app.use(error)
