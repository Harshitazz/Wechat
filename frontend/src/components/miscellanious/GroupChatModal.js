import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserItemBadge from "./UserItemBadge";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchResult, setSearchResult] = useState([]);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //protected api
        },
      };
      const { data } = await axios.get(`api/user?search=${search}`, config);
      
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleGroup = (usertoAdd) => {
    if (selectedUser.includes(usertoAdd)) {
      toast({
        title: "User Already Added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setSelectedUser((prevSelectedUser) => [...prevSelectedUser, usertoAdd]);
    // setSelectedUser([...selectedUser,usertoAdd]);
    
  };

  const handleDelete = (deleteU) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== deleteU._id));
  };
  const handleSubmit = async() => {
    if(!groupChatName){
      toast({
        title: "Please Fill all the Feilds",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {

      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`  //protected api
        },
      }
      const {data}= await axios.post('api/chat/group'
      ,{
        chatName:groupChatName,
        users:JSON.stringify(selectedUser.map((u)=>u._id))
      }
      ,config)
      
      setChats([data,...chats]);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton />

          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create New Group Chat
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {/* selected user */}
            <Box display="flex" flexWrap="wrap" overflowY="auto">
              {selectedUser.map((user) => (
                <UserItemBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleSubmit}>
              create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
