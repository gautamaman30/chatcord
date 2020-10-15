import path from 'path'
import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import formatMessage from './utils/messages.js'
import {userJoin, getCurrentUser, getRoomUsers, userLeave} from './utils/users.js'


const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(process.cwd(), 'public')));


const botName = 'ChatCord Bot';

io.on('connection', (socket) => {
  //add user socket to socket's room
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //send message to client that has connected
    socket.emit('message1', formatMessage(botName, 'Welcome to chatCord'));
    //send message to all the clients except that is being connected using broadcast.emit
    socket.broadcast
      .to(user.room)
      .emit('message1', formatMessage(botName, `${user.username} has joined the chat`));

    //send user's room info for sidebar
    io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});
  });


  //listen for chat message
  socket.on('chatMessage', (message) => {
    const user = getCurrentUser(socket.id);
    //emit message to everyone
    io.to(user.room).emit('message1', formatMessage(user.username, message));
  });
  // for all clients use io.emit, runs when someone disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user) {
      io.to(user.room).emit('message1', formatMessage(botName, `${user.username} has left the chat`));

      //send user's room info for sidebar
      io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});
    }
  });
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on ${PORT}`))
