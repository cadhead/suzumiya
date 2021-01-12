import socketIO from 'socket.io';

export const io = socketIO();

io.on('connection', (socket) => {
  console.log(socket.id);
});
