const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const rect = {
  lastUpdate: new Date().getTime(),
  x: 0,
  y: 0,
  height: 100,
  width: 100,
  color: '',
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room');

  socket.on('draw', (data) => {
    rect.x = data.coords.x;
    rect.y = data.coords.y;
    rect.color = data.coords.color;

    rect.lastUpdate = data.time;

    io.sockets.in('room').emit('update', {
      time: rect.lastUpdate,
      coords: {
        x: rect.x, y: rect.y, width: rect.width, height: rect.height, color: rect.color,
      },
    });
  });
});
