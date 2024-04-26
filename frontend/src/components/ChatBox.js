import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './miscellanious/SingleChat'

function ChatBox({fetchAgain,setFetchAgain}) {
  const {selectedChat}=ChatState()
  return (
    <Box display={{base: selectedChat?'flex':'none',md:'flex'}}
    bg='white'
    // alignItems='center'
    w={{base:'100%',md:'68%'}}
    flexDir='column'
    borderRadius='lg'
   
    
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
