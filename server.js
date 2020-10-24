const http = require('http')
const express = require('express')
const socket = require('socket.io')
const { formatMessage } = require('./utils/messages')
const { 
    userJoin, 
    getCurrentUser, 
    leaveChat, 
    getRoomUsers 
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socket(server)

// set bot name
const botName = 'ChatCord Bot'

// set static folder
app.use(express.static('public'))

// run when client connects
io.on('connection', socket => {
    console.log("new connection...")

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        // welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

        // broadcast when user connects
        socket.broadcast.to(user.room).emit(
            'message', 
            formatMessage(botName, `${user.username} has joined the chat`)
        )

        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // listen for chatMessage
    socket.on('chatMessage', data => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, data))
    })

    // run when client disonnect
    socket.on('disconnect', () => {
        const user = leaveChat(socket.id)

        if (user) {
            io.to(user.room).emit('message', 
                formatMessage(botName, `${user.username} has left the chat`)
            )

            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

// set port
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})