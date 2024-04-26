import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react';

function UserListItem({user, handleFunction}) {
  return (
    <Box
    onClick={handleFunction}
    cursor='pointer'
    w='100%'
    display='flex'
    color='black'
    bg='whitesmoke'
    _hover={{
        background:'#3284b8',
        color:'white'
    }}
    p={2}
    mb={2}
    alignItems='center'
    borderRadius='lg'
    >
        <Avatar
        src={user.pic}
        name={user.name}
        cursor='pointer'
        mr={2}
        size='sm'
        />
        <Box>
            <Text>{user.name}</Text>
            <Text>
                <b>email:</b>
                {user.email}</Text>
        </Box>
    </Box>
  )
}

export default UserListItem
