const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')
const { formatMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socket(server)

// set bot name
const botName = 'ChatCord Bot'

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// run when client connects
io.on('connection', socket => {
    console.log("new connection...")

    // welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

    // broadcast when user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'))

    // run when client disonnect
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'))
    })

    // listen for chatMessage
    socket.on('chatMessage', data => {
        io.emit('message', formatMessage('azmirf20', data))
    })
})

// set port
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})