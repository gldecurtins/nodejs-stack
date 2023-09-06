const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3001;
const { faker } = require("@faker-js/faker");

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

app.use(express.static(path.join(__dirname, "/static")));

io.on("connection", (socket) => {
  const randomName = faker.person.firstName();
  socket.userName = randomName;
  socket.join("1");

  let rooms = Array.from(socket.rooms);
  io.to(rooms).emit("message", ">> " + socket.userName + " connected");

  socket.on("disconnect", () => {
    let rooms = Array.from(socket.rooms);
    socket.to(rooms).emit("message", ">> " + socket.userName + " disconnected");
  });

  socket.on("message", (message) => {
    let rooms = Array.from(socket.rooms);
    socket.to(rooms).emit("message", "<" + socket.userName + "> " + message);
  });
});
