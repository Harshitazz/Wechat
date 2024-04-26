import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

function UserItemBadge({user ,handleFunction}) {
  return (
    
    <Box
    m={1}
    onClick={handleFunction}
        borderRadius='lg'
        bgColor='#0a9898'
        px={1}
        fontSize={15}
    >
      {user.name}
      <CloseIcon p={1}/>
    </Box>
  )
}

export default UserItemBadge
