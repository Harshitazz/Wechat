import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import ChatLoading from "../ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../../context/ChatLogic/Configuration";
function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingChat, setLoadingChat] = useState("");
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    resetUnreadCount,
  } = ChatState();
  const toast = useToast();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/user?search=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axiosInstance.post("/api/chat", { userId });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //if not already in chats
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        bgImage="linear-gradient(to right, #3284b8, #0a9898)"
        h="3rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        // px={4}
      >
        <Tooltip label="search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontFamily="Work sans"
          fontWeight="600"
          fontSize={{ base: "24px", md: "30px" }}
        >
          Chatter-App
        </Text>
        <div>
          <Menu>
            <MenuButton position="relative">
              <BellIcon boxSize={5} />

              {notification.length > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  px="2"
                  fontSize="0.7em"
                >
                  {notification.length}
                </Badge>
              )}
            </MenuButton>

            <MenuList>
              {!notification.length && "No new messages"}

              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    resetUnreadCount(notif.chat._id);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              border={{ base: "none", md: "2px solid black" }}
              as={Button}
              rightIcon={<ChevronDownIcon boxSize={6}></ChevronDownIcon>}
              variant="ghost"
            >
              <Avatar
                display={{ base: "none", md: "flex" }}
                boxSize={8}
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search By Name Or Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                mr={2}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
