import React, { useCallback, useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  generateRandomString,
  getSender,
  getSenderFull,
} from "../../context/ChatLogic/Configuration";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axiosInstance from "../../config/axiosConfig";
import "../css/styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const ENDPOINT = process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5004";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const { 
    user, 
    selectedChat, 
    setSelectedChat, 
    notification, 
    setNotification,
    resetUnreadCount
  } = ChatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;

    socket = io(ENDPOINT, {
      auth: { token: user.token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("🟢 Socket connected");
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("message received", (msg) => {
      console.log("📩 WS message:", msg);

      const isCallInvite =
        typeof msg.content === "string" &&
        msg.content.includes("Video call started");

      // 🔥 ALWAYS render call invites via WebSocket
      if (isCallInvite) {
        setMessages((prev) =>
          prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]
        );
        return;
      }

      if (selectedChatCompare && selectedChatCompare._id === msg.chat._id) {
        setMessages((prev) =>
          prev.find((m) => m._id === msg._id) ? prev : [...prev, msg]
        );
      } else {
        // Notification and unread count are now handled globally in ChatProvider
        setFetchAgain((prev) => !prev);
      }
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("🔴 Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.token]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/api/message/${selectedChat._id}`
      );
      setMessages(data);
      setLoading(false);

      if (socket && socketConnected) {
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
      toast({
        title: "Error fetching messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      if (socketConnected) {
        socket.emit("stop typing", selectedChat._id);
      }

      const content = newMessage;
      setNewMessage("");

      try {
        await axiosInstance.post("/api/message", {
          content,
          chatId: selectedChat._id,
        });
        // ❌ DO NOT update messages here
      } catch (error) {
        toast({
          title: "Error sending message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setNewMessage(content);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !socketConnected || !selectedChat) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // Debounce stop typing
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
      // Reset unread count when chat is selected
      resetUnreadCount(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (socket && socketConnected && selectedChat?._id) {
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat, socketConnected]);

  const handleJoinRoom = async () => {
    if (!selectedChat?._id) return;

    const roomId = generateRandomString(12);
    const roomLink = `${window.location.origin}/room/${roomId}`;
    const content = `📞 Video call started\n${roomLink}`;

    try {
      await axiosInstance.post("/api/message", {
        content,
        chatId: selectedChat._id,
      });

      navigate(`/room/${roomId}`);
    } catch (error) {
      toast({
        title: "Failed to start call",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "25px", md: "28px" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            fontFamily="Work sans"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                <Box flex="1">{getSender(user, selectedChat.users)}</Box>
                <Box display="flex" gap="1rem">
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  <IconButton icon={<PhoneIcon />} onClick={handleJoinRoom} />
                </Box>
              </>
            ) : (
              <>
                <Box flex="1">{selectedChat.chatName.toUpperCase()}</Box>
                <Box display="flex" gap="1rem">
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                  <IconButton icon={<PhoneIcon />} onClick={handleJoinRoom} />
                </Box>
              </>
            )}
          </Box>

          <Box
            display="flex"
            w="100%"
            h="100%"
            backgroundColor="#E8E8E8"
            overflow="hidden"
            flexDir="column"
          >
            {loading ? (
              <Spinner alignSelf="center" margin="auto" size="xl" />
            ) : (
              <Box
                flex="1"
                overflowY="auto"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && (
                <Box>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </Box>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a Message"
                onChange={typingHandler}
                value={newMessage}
                m={1}
                borderRadius="sm"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          h="100%"
        >
          <Text fontFamily="Work sans" fontSize="2xl" pb={2}>
            Select An User to Chat
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
