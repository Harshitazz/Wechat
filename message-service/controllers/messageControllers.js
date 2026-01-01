const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const axios = require("axios");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    axios
      .post(
        `${process.env.REALTIME_SERVICE_URL}/internal/emit-message`,
        message
      )
      .catch((err) => {
        console.error(
          "Realtime service error:",
          err.response?.data || err.message
        );
      });

    res.json(message);

  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Failed to send message");
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch messages");
  }
});

module.exports = { sendMessage, allMessages };
