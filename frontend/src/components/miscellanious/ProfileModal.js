import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function ProfileModal({user,children}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    
  return (
    <>
      {children ? (<span onClick={onOpen} >{children}</span>
      )
       :  (
        <IconButton display={{base: 'flex'}} icon={<ViewIcon/>} onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent p={5}>
            
            <ModalCloseButton/>
            <ModalBody
            fontFamily='Work sans'
            margin='auto'
            textAlign='center'
            
            >
                <Image
                src={user.pic}
                boxSize='150px'
                borderRadius='50%'
                alt={user.name}
               margin='auto'
                />
                <Text>
                    Name: {user.name}
                    
                </Text>
                <Text>
                Email: {user.email}
                </Text>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose} >close</Button>

            </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
