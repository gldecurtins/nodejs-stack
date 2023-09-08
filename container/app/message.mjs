export async function messageManager(message, io, socket) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.startsWith("h.")) {
    helpCmd(socket);
  } else if (lowerCaseMessage.startsWith("s.")) {
    await showCmd(io, socket);
  } else {
    let rooms = Array.from(socket.rooms);
    socket
      .to(rooms)
      .emit("message", "<" + socket.data.username + "> " + message);
  }
}

function helpCmd(socket) {
  const helpText = [
    ">> h. to show this help",
    ">> e. to disconnect",
    ">> s. to show who's online",
  ];
  for (const text of helpText) {
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
