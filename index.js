const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;
const users = []
try {
  app.get('/', (req, res) => {
    res.json({ status: "ok", port: `${port}` });
  });
  io.on('connection', socket => {
    console.log('connection')
    socket.on('new-user', (user) => {
      user.id = socket.id
      users.push(user)
      io.emit('userlist', users)
    })
    socket.on('chatMsgFromClient', (msg) => {
      socket.broadcast.emit('chatMsgFromServer', (msg))
    })
    socket.on("disconnect", () => {
      var index = users.findIndex((user) => {
        user.id == socket.id
      })

      users.splice(index, 1)[0]
      io.emit('userlist', users)
    })
  })
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}
catch (error) {
  console.error(error)
}