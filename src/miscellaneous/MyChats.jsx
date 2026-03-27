import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender,getSenderFull } from "../config/ChatLogics";
import GroupChatModel from "../miscellaneous/GroupChatModel";
import { Plus } from "lucide-react";

const MyChats = ({ fetchAgain , onlineUsers }) => {
  const { notification, setNotification } = ChatState();
  const formatTime = (time) => {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
  if (user) {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }
}, [fetchAgain, user]); // 🔥 user bhi add karo
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRight="1px solid #E2E8F0"
      h="100%"
    >
      {/* Header */}
      <Flex
        px={4}
        py={3}
        justify="space-between"
        align="center"
        borderBottom="1px solid #E2E8F0"
      >
        <Text fontSize="22px" fontWeight="bold">
          Chats
        </Text>

        <GroupChatModel>
  <Button
    leftIcon={<Plus size={16} />}
    colorScheme="teal"
    size="sm"
    fontSize={{ base: "14px", md: "15px" }}
  >
    New Group
  </Button>
</GroupChatModel>
      </Flex>

      {/* Chat List */}
      <Box
  flex="1"
  overflowY="auto"
  px={2}
  sx={{
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-thumb": { background: "#CBD5E0" },
  }}
>
  {chats ? (
    <Stack spacing={2}>
      {chats.map((chat) => {
        const otherUser = !chat.isGroupChat
          ? getSender(loggedUser, chat.users)
          : chat.chatName;
          const unreadCount = notification.filter(
  (n) => n.chat._id === chat._id
).length;

const isOnline = onlineUsers?.includes(
  getSenderFull(loggedUser, chat.users)?._id
);

        return (
          <Flex
            key={chat._id}
            onClick={() => {
  setSelectedChat(chat);

  // 🔴 unread clear
  setNotification((prev) =>
    prev.filter((n) => n.chat._id !== chat._id)
  );
}}
            align="center"
            gap={3}
            p={3}
            borderRadius="lg"
            cursor="pointer"
            transition="0.2s"
            bg={
              selectedChat?._id === chat._id
                ? "teal.400"
                : "white"
            }
            color={
              selectedChat?._id === chat._id
                ? "white"
                : "black"
            }
            _hover={{
              bg:
                selectedChat?._id === chat._id
                  ? "teal.500"
                  : "gray.100",
            }}
            boxShadow="sm"
          >
            {/* Avatar */}
 
 <Box position="relative">
  <Avatar
    size="md"
    name={otherUser?.name || otherUser}
    src={
      !chat.isGroupChat
        ? getSenderFull(loggedUser, chat.users)?.pic
          ? `http://localhost:5000/${getSenderFull(
              loggedUser,
              chat.users
            ).pic.replace(/\\/g, "/")}`
          : undefined
        : undefined
    }
    bg="teal.400"
    color="white"
    sx={{
      img: {
        objectFit: "cover",
        objectPosition: "top",
        borderRadius: "50%",
      },
    }}
  />

  {/* 🟢 ONLINE DOT */}
  {isOnline && (
    <Box
      position="absolute"
      bottom="1px"
      right="1px"
      w="10px"
      h="10px"
      bg="green.400"
      borderRadius="full"
      border="2px solid white"
    />
  )}
</Box>

  {/* 🟢 ONLINE DOT */}
  {isOnline && (
    <Box
      position="absolute"
      bottom="0"
      right="0"
      w="10px"
      h="10px"
      bg="green.400"
      borderRadius="full"
      border="2px solid white"
    />
  )}


            {/* Chat Info */}
            <Box flex="1">
              <Flex justify="space-between" align="center">
  <Text fontWeight="bold" fontSize="15px">
    {otherUser}
  </Text>

  {/* 🔴 UNREAD BADGE */}
  {unreadCount > 0 && (
    <Box
      bg="red.500"
      color="white"
      borderRadius="full"
      px={2}
      fontSize="10px"
    >
      {unreadCount}
    </Box>
  )}
</Flex>

              <Text
                fontSize="13px"
                color={
                  selectedChat?._id === chat._id
                    ? "whiteAlpha.800"
                    : "gray.500"
                }
                noOfLines={1}
              >
                {chat.latestMessage?.content || "Start chatting..."}
              </Text>
            </Box>

            {/* Time (fake UI for now) */}
            {chat.latestMessage && (
  <Text fontSize="xs">
    {formatTime(chat.latestMessage.createdAt)}
  </Text>
)}
          </Flex>
        );
      })}
    </Stack>
  ) : (
    <ChatLoading />
  )}
</Box>
    </Box>
  );
};

export default MyChats;