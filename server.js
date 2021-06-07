const express = require('express');
const path = require('path')
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const botName = "Web Bot"
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
    socket.on('joinRoom', ( {username, room}) => {
        const user = userJoin(socket.id ,username ,room);

        socket.emit(
            'message',
            formatMessage(botName, 'Welcome to WebChat')
        );

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName,`A ${user.username} has joined the chat`)
        );
    })

    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id);
        io
            .to(user.room)
            .emit('message', formatMessage(user.username,message));
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io
                .to(user.room)
                .emit('message', formatMessage(botName,`A ${user.username} has left the chat`));
        }

    })
})


const PORT = 3100 || process.env.PORT;

server.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
})