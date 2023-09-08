import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { faker } from "@faker-js/faker";
import { messageManager } from "./message.mjs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

app.use(express.static(path.join(__dirname, "/static")));

io.on("connection", (socket) => {
  const randomName = faker.person.firstName();
  socket.data.username = randomName;
  socket.join("1");

  let rooms = Array.from(socket.rooms);
  io.to(rooms).emit("message", ">> " + socket.data.username + " connected");

  socket.on("disconnect", () => {
    let rooms = Array.from(socket.rooms);
    socket
      .to(rooms)
      .emit("message", ">> " + socket.data.username + " disconnected");
  });

  socket.on("message", (message) => {
    messageManager(message, io, socket);
  });
});
