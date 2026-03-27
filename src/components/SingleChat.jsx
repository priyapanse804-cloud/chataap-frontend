import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import { MoveLeft } from "lucide-react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModel";
import UpdateGroupChatModel from "../miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import ScrollableChat from "../components/ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");
  const { user, selectedChat, setSelectedChat ,notification,setNotification } = ChatState();
   const [fetchAgain, setFetchAgain]=useState(false)
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  // -------- SEND MESSAGE --------
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        /*const messageContent = newMessages;
        setNewMessages("");*/
   setNewMessages("")
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessages,
            chatId: selectedChat._id,
          },
          config
        );
console.log(data);

        socket.emit("new message", data);
           
       
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // -------- SOCKET SETUP --------
  useEffect(() => {
     if (!user) return;
    socket = io(ENDPOINT);

    socket.emit("setup", user);

    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));

    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  // -------- FETCH MESSAGES --------
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
     console.log(messages);
     
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

 
  
  
  

  // -------- RECEIVE MESSAGE --------
useEffect(() => {
  socket.on("message recieved", (newMessageRecieved) => {

   

    if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
      console.log("ADDING NOTIFICATION");

      // add notification
      if (!notification.find((n) => n._id === newMessageRecieved._id)) {
        
        setNotification((prev) => {
        console.log("OLD NOTIFICATION:", prev);

        return [newMessageRecieved, ...prev];
      });

        setFetchAgain(!fetchAgain)
      }

    } else {

      // add message in chat
      setMessages((prev) => [...prev, newMessageRecieved]);

    }

  });

  return () => socket.off("message recieved");

}, [selectedChat]);

  // -------- TYPING HANDLER --------
  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
  <>
    {selectedChat ? (
      <>
        {/* 🔥 HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          px={3}
          py={2}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<MoveLeft />}
              onClick={() => setSelectedChat("")}
            />

            <Text fontSize="20px" fontWeight="bold">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName}
            </Text>
          </Box>

          {!selectedChat.isGroupChat ? (
            <ProfileModal
              userData={getSenderFull(user, selectedChat?.users)}
            />
          ) : (
            <UpdateGroupChatModel
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          )}
        </Box>

        {/* 🔥 CHAT BODY */}
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          w="100%"
          h="75vh"
          overflowY="hidden"
          bg="gray.50"
          _dark={{ bg: "#0f172a" }}
          borderRadius="lg"
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              h="100%"
            >
              <Spinner size="xl" color="teal.400" />
            </Box>
          ) : (
            <ScrollableChat messages={messages} />
          )}

          {/* 🔥 TYPING INDICATOR */}
          {isTyping && (
            <Box px={2} py={1}>
              <Text fontSize="sm" color="gray.500">
                typing...
              </Text>
            </Box>
          )}

          {/* 🔥 INPUT BOX */}
          <FormControl mt={3}>
            <Box display="flex" gap={2}>
              <Input
                variant="filled"
                placeholder="Type a message..."
                value={newMessages}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                borderRadius="full"
                bg="gray.200"
                _dark={{ bg: "#1e293b", color: "white" }}
                _focus={{
                  bg: "white",
                  _dark: { bg: "#1e293b" },
                }}
              />

              <IconButton
                icon={<span>➤</span>}
                colorScheme="teal"
                borderRadius="full"
                onClick={() =>
                  sendMessage({ key: "Enter" })
                }
              />
            </Box>
          </FormControl>
        </Box>
      </>
    ) : (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100%"
       
        _dark={{ bg: "#020617" }}
      >
        <Text fontSize="2xl" color="gray.400">
          Select a chat to start messaging 💬
        </Text>
      </Box>
    )}
  </>
);
};

export default SingleChat;