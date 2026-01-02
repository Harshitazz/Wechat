const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", (req, res) => {
  res.send("Message Service is running");
})

app.use("/api/message", protect, messageRoutes);

app.listen(5003, () =>
  console.log(" Message Service running on 5003")
);
