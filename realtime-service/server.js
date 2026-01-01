const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

const connectedUsers = new Map();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      
      socket.user = {
        _id: decoded.id,
        email: decoded.email || "unknown",
      };
      
      next();
      
    } catch (jwtError) {
      return next(new Error("Invalid token: " + jwtError.message));
    }
    
  } catch (error) {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  connectedUsers.set(socket.user._id.toString(), socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (message) => {
    if (!message?.chat?._id) {
      return;
    }

    socket.to(message.chat._id).emit("message received", message);
    
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.user._id.toString());
  });
});

app.post("/internal/emit-message", (req, res) => {
  const message = req.body;

  if (!message?.chat?.users) {
    return res.status(400).send("Invalid message payload");
  }
  
  message.chat.users.forEach((user) => {
    if (user._id !== message.sender._id) {
      io.to(user._id).emit("message received", message);
    }
  });

  res.sendStatus(200);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    connectedUsers: connectedUsers.size,
    users: Array.from(connectedUsers.keys()),
  });
});

app.get("/test-auth", (req, res) => {
  res.json({
    status: "ok",
    jwtSecretConfigured: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    port: process.env.PORT || 5004,
    corsOrigin: "http://localhost:3000"
  });
});

const PORT = process.env.PORT || 5004;
server.listen(PORT, () => {
  console.log(`Waiting for connections...\n`);
});