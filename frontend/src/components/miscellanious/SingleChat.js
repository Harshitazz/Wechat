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
import { ArrowBackIcon, PhoneIcon, ViewIcon } from "@chakra-ui/icons";
import {
  getSender,
  getSenderFull,
} from "../../context/ChatLogic/Configuration";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import '../css/styles.css'
import ScrollableChat from "./ScrollableChat";
import Lottie from 'react-lottie'
import animationData from "../animation/typing.json"
import io from 'socket.io-client'
import { useNavigate } from "react-router-dom";
const ENDPOINT="http://localhost:5000"; //cors to backend
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();
  const { user, selectedChat, setSelectedChat ,notification,setNotification} = ChatState();
  const[typing,setTyping]=useState(false);
  const[isTyping,setIsTyping]=useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const navigate=useNavigate();
  const [socketConnected ,setSocketConnected]= useState();

  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit('setup',user);
    socket.on('connected',()=>setSocketConnected(true))
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))

  },[])



  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {

          Authorization: `Bearer ${user.token}`, //protected api
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(selectedChat);
      console.log(data);
      setMessages(data)
      setLoading(false)

      socket.emit('join chat',selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      }); 
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`, //protected api
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        // console.log(selectedChat);

        socket.emit('new message',data)
        setMessages([...messages, data]);
        
      } catch (error) {
        toast({
          title: "Error Occured",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected)return;

    if(!typing){
      setTyping(true);
      socket.emit('typing',selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };



  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
    
  },[selectedChat])

  useEffect(()=>{
    socket.on('message recieved',(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification]);
          setFetchAgain(!fetchAgain)
        }
      }
      else{
        setMessages([...messages,newMessageRecieved])
      }
    })
  })

  //join room 
  let value;

  const handleJoinRoom = useCallback(() => {
    let value;
    
    if (selectedChat) {
      if (selectedChat.isGroupChat) {
        value = selectedChat.chatName ? selectedChat.chatName.toUpperCase() : 'UNKNOWN_GROUP';
      } else {
        value = getSender(user, selectedChat.users) || 'UNKNOWN_USER';
      }
      navigate(`/room/${value}`);
    } else {
      console.warn('selectedChat is not defined');
      // Handle the case when selectedChat is not defined, if necessary
    }
  }, [navigate, selectedChat, user]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "28px" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            // pb={3}
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
                {getSender(user, selectedChat.users)}
                <Text display='flex' gap='1rem'>
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                ></ProfileModal>
             <IconButton display={{base: 'flex'}} icon={<PhoneIcon/>}  onClick={handleJoinRoom}/>

                </Text>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <Text display='flex' gap='1rem'>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  
                />
                <IconButton display={{base: 'flex'}} icon={<PhoneIcon/>}  onClick={handleJoinRoom}/>
                </Text>
              </>
            )}
          </Text>
          <Box
            display="flex"
            w="100%"
            h="100%"
            backgroundColor="#E8E8E8"
            overflowY="hidden"
            flexDir="column"
            justifyContent="flex-end"
          >
            {/* messages here */}
            
            {loading ? (
              <Spinner alignSelf="center" margin="auto" size="xl" />
            ) : (
              <div className="message">
                <ScrollableChat messages={messages}/>
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping? <div>
                <Lottie
                options={defaultOptions}
                // height={50}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>:<></>}
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
