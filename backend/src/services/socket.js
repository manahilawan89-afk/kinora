const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

let io = null;

function attachSocket(server, { corsOrigin }) {
  io = new Server(server, {
    cors: {
      origin: corsOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next();
    }
  });

  io.on("connection", (socket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    socket.on("disconnect", () => {});
  });
}

function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}

module.exports = { attachSocket, emitToUser };
