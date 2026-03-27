import { Box } from '@chakra-ui/react'
import React from 'react'
import { X } from 'lucide-react'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      bg="purple.500"
      color="white"
      cursor="pointer"
      display="flex"
      alignItems="center"
      gap="4px"
      onClick={handleFunction}
    >
      {user.name}
      <X size={14}/>
    </Box>
  )
}

export default UserBadgeItem