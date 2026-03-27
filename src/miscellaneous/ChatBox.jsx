/*import React from 'react'
import {ChatState} from '../context/ChatProvider'
import {Box} from '@chakra-ui/react'
import SingleChat from '../components/SingleChat'
const ChatBox = ({fetchAgain,setFetchAgain}) => {

 const {selectedChat}=  ChatState()
  return (
    <Box d={{base:selectedChat?"flex":"none",md:"flex"}}
    alignItems={'center'}
    flexDir={'column'}
    p={3}
    bg={'white'}
    w={{base:'100%',md:'68%'}}
    borderRadius={'lg'}
    borderWidth={'1px'}>
     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox*/


import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, useColorModeValue } from "@chakra-ui/react";
import SingleChat from "../components/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  // 🔥 Light/Dark theme colors
  const bg = useColorModeValue("white", "#1a202c");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={bg}
      w={{ base: "100%", md: "68%" }}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={border}
      boxShadow="md"
      transition="0.3s"
    >
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
};

export default ChatBox;