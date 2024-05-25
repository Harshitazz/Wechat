import { Text } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { ChatState } from '../context/ChatProvider';

function RoomPage() {
    const {roomId} =useParams();
    const { user} = ChatState();

const myMeeting=async(element)=>{
    const appId=967339122;
    const serverSecret="c374df7deebfc0fa823ab1f3dd8ffa27";
    const kitToken= ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        user._id,
        'xyz'
    )
    const zc= ZegoUIKitPrebuilt.create(kitToken)
    zc.joinRoom({
        container: element,
        sharedLinks:[{
            name:'copy link',
            url:`http://http://localhost:3000/room/${roomId}`
        }],
        scenario:{
            mode:ZegoUIKitPrebuilt.GroupCall,

        },
        showScreenSharingButton:true
    })
}

  return (
    <Text>
      <div ref={myMeeting}/>
    </Text>
  )
}

export default RoomPage
