require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// JWT middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.sendStatus(403);
  }
};

// USER (PUBLIC)
app.use("/api/user",
  createProxyMiddleware({
    target:process.env.USER_SERVICE_URL || "http://localhost:5001",
    changeOrigin: true,
  })
);

// CHAT (PROTECTED)
app.use("/api/chat", auth,
  createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL || "http://localhost:5002",
    changeOrigin: true,
  })
);

// MESSAGE (PROTECTED)
app.use("/api/message", auth,
  createProxyMiddleware({
    target: process.env.MESSAGE_SERVICE_URL || "http://localhost:5003",
    changeOrigin: true,
  })
);

app.use("/socket.io",
  createProxyMiddleware({
    target: process.env.REALTIME_SERVICE_URL || "http://localhost:5004",
    changeOrigin: true,
    ws: true, 
  })
);

const server = app.listen(4000, () =>
  console.log(" API Gateway running on port 4000")
);

server.on('upgrade', (req, socket, head) => {
  console.log('WebSocket upgrade request');
});