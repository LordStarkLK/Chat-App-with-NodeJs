const express = require('express');
const http = require('http');
const path = require('path');
const socketio  = require('socket.io');
const formatMessage = require('./util/messages');
const {userJoin,getCurrentUser,userLeft,roomUsers} = require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//get the username param


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connect
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id,username, room);

        socket.join(user.room);

    //welcome message
    socket.emit('message', formatMessage("server",`welcome to chat ${user.username}`));

    //when user connect
    socket.broadcast.to(user.room).emit('message', formatMessage("server",`${user.username} has joined the chat`));

    //users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: roomUsers(user.room)
    })

    })
    
    //when user disconnect
    socket.on('disconnect', () => {
        const user = userLeft(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage("server",`${user.username} has left the chat`));
        }
    });

    //listen for the chatmessage
    socket.on('chatMessage',(msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
});
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})