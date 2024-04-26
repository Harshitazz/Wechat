import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormLabel,
  Input,
  FormControl,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserItemBadge from "./UserItemBadge";
import axios from "axios";
import UserListItem from "./UserListItem";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast();


  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //protected api
        },
      };
      const { data } = await axios.put(
        "api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false)
    }
    setGroupChatName('')
  };

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
      console.log("data");
      console.log(data);
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
   const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=>u._id===user1._id)){
        toast({
            title: "User already in group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    if(selectedChat.groupAdmin._id!==user._id){
        toast({
            title: "only group admins can add..",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, //protected api
          },
        };
        const { data } = await axios.put(`api/chat/add`,{
            chatId:selectedChat._id,
            userId:user1._id
        }, config);
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading(false)
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
   

    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
            toast({
                title: "only group can remove someone..",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }
        try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`, //protected api
              },
            };
            const { data } = await axios.put(`api/chat/remove`,{
                chatId:selectedChat._id,
                userId:user1._id
            }, config);
            user1._id===user._id? setSelectedChat():setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
          }catch(error){
            toast({
              title: "Error!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
    };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        display="flex"
        onClick={onOpen}
      ></IconButton>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="work sans"
            fontSize="30px"
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" my={2}>
              <Input
                placeholder="New Chat Name"
                // my={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                update
              </Button>
            </FormControl>
            <Box flexWrap="wrap" p={1} display="flex">
              {selectedChat.users.map((u) => (
                <UserItemBadge
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
              {loading?(
                <Spinner/>
              ):(
                searchResult?.map((user)=>(
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleAddUser(user)}
                    />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={(user)=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
