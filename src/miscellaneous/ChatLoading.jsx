import { Stack } from '@chakra-ui/react'
import React from 'react'
import { SkeletonText } from "@chakra-ui/react"

const ChatLoading = () => {
  return (
    <Stack>
      <SkeletonText noOfLines={3} gap="8" />
    </Stack>
  )
}

export default ChatLoading

