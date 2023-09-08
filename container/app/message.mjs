export async function messageManager(message, io, socket) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.startsWith("h.")) {
    helpCmd(socket);
  } else if (lowerCaseMessage.startsWith("s.")) {
    await showCmd(io, socket);
  } else if (lowerCaseMessage.startsWith("c.")) {
    changeCmd(socket, message);
  } else {
    let rooms = Array.from(socket.rooms);
    socket
      .to(rooms)
      .emit("message", "<" + socket.data.username + "> " + message);
  }
}

function helpCmd(socket) {
  const helpText = [
    ">> c. <stack name> to change the stack",
    ">> e. to disconnect",
    ">> h. to show this help",
    ">> s. to show who's online",
  ];
  for (const text of helpText.reverse()) {
    socket.emit("message", text);
  }
}

async function showCmd(io, socket) {
  const sockets = await io.fetchSockets();
  socket.emit("message", "+---------------------------------------+");
  for (const user of sockets) {
    let username = user.data.username.padEnd(20, " ");
    let stack = Array.from(user.rooms)
      .filter((item) => item != user.id)
      .toString()
      .padEnd(16, " ");
    socket.emit("message", "| " + username + " " + stack + " |");
  }
  socket.emit("message", "+---------------------------------------+");
  socket.emit("message", "| Name:                Stack:           |");
  socket.emit("message", "+---------------------------------------+");
}

function changeCmd(socket, message) {
  let fromRooms = Array.from(socket.rooms);
  fromRooms.shift();
  let toRoom = message.split(" ")[1];
  socket
    .to(fromRooms)
    .emit("message", ">> " + socket.data.username + " leaves this stack");
  for (const room of fromRooms) {
    socket.leave(room);
  }
  socket.join(toRoom);
  let toRooms = Array.from(socket.rooms);
  socket
    .to(toRooms)
    .emit("message", ">> " + socket.data.username + " joined this stack");
}
