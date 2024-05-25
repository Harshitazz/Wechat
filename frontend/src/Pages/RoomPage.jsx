import { Box, Button, Text } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { ChatState } from '../context/ChatProvider';

function RoomPage() {
    const {roomId} =useParams();
    const { user} = ChatState();
    const navigate=useNavigate()
    const meetingContainerRef = useRef(null);

    useEffect(() => {
      const appId = 967339122;
      const serverSecret = "c374df7deebfc0fa823ab1f3dd8ffa27";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        user._id,
        'xyz'
      );
      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: meetingContainerRef.current,
        sharedLinks: [{
          name: 'copy link',
          url: `http://localhost:3000/room/${roomId}`
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
      });
    }, [roomId, user]);
  
    const handleClose = () => {
      navigate('/chats');
            window.location.reload();  // This will refresh the page
    };

  return (
    <Box margin='auto' width='100%' height='100vh' marginTop="4">
    <Button onClick={handleClose} marginBottom="4" colorScheme="red">Close</Button>
      <Box
        ref={meetingContainerRef}
        width='90vw'  // Adjusted width
        height='90vh'  // Adjusted height
        maxWidth='100%'  // Optional max width
        maxHeight='100%'  // Optional max height
        margin='auto'  // Centering the box
      />
    </Box>
  )
}

export default RoomPage
