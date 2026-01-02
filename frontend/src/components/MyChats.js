import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axiosInstance from "../config/axiosConfig";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../context/ChatLogic/Configuration";
import GroupChatModal from "./miscellanious/GroupChatModal";

function MyChats({ fetchAgain }) {
  const [loggeduser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const { data } = await axiosInstance.get("/api/chat");

      if (!Array.isArray(data)) {
        throw new Error("Invalid chat data");
      }

      setChats(data);
    } catch (error) {
      setChats([]); // prevent map crash
      toast({
        title: "Failed to load chats",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
    >
      <Box
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        fontFamily="Work sans"
        fontSize={{ base: "20px", md: "25px" }}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "15px", md: "10px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        borderRadius="lg"
        overflowY="hidden"
        w="100%"
        h="100%"
        p={3}
      >
        {Array.isArray(chats) ? (
          <Stack
            overflowY="scroll"
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "-ms-overflow-style": "none",
              scrollbarWidth: "none",
            }}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                bgImage="linear-gradient(to right, #3284b8, #0a9898)"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggeduser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
