// Nicholas Szegheo and Yakov Kazinets
const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('new client connected', socket.id);

  socket.on('user_join', ({ name, room }) => {
    socket.join(room);
    socket.broadcast.to(room).emit('user_join', { name:name, room:room });
  });

  socket.on('change_room', ({name, old_room, new_room}) => {
    socket.leave(old_room);
    socket.join(new_room);
    console.log(`${name} left ${old_room}, joined ${new_room}`);
    socket.broadcast.to(old_room).emit('user_leave', { name:name, room:old_room });
    socket.broadcast.to(new_room).emit('user_join', { name:name, room:new_room });
  });

  socket.on('message', ({ name, message, room }) => {
    console.log(name, message, room, socket.id);
    io.to(room).emit('message', { name, message, room });
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});