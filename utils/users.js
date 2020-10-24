const users = []

// join user to chat
exports.userJoin = (id, username, room) => {
    const user = { id, username, room }
    users.push(user)

    return user
}

// get current user
exports.getCurrentUser = id => {
    return users.find(user => user.id === id)
}

// user leaves chat
exports.leaveChat = id => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// get room users
exports.getRoomUsers = room => {
    return users.filter(user => user.room === room)
}