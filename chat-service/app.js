const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();
require("./models/messageModel");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.send("Chat Service is running");
})

app.use("/api/chat", protect, chatRoutes);

app.listen(5002, () =>
  console.log("Chat Service running on 5002")
);
