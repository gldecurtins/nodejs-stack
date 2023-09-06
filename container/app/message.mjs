export function messageManager(message, socket) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.startsWith("h.")) {
    helpCmd(socket);
  } else if (lowerCaseMessage.startsWith("s.")) {
    showCmd(socket);
  } else {
    let rooms = Array.from(socket.rooms);
    socket.to(rooms).emit("message", "<" + socket.userName + "> " + message);
  }
}

function helpCmd(socket) {
  const helpText = [">> h. to show this help", ">> e. to disconnect"];
  for (const text of helpText.reverse()) {
    socket.emit("message", text);
  }
}

function showCmd(socket) {
  let clients = socket.clients();
  socket.emit("message", clients);
}
