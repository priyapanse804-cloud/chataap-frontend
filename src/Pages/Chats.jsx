import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../miscellaneous/SideDrawer";
import MyChats from "../miscellaneous/MyChats";
import ChatBox from "../miscellaneous/ChatBox";
import io from "socket.io-client";

const ENDPOINT = "https://chataap-backend.onrender.com";
let socket;

const Chats = () => {
  const { user } = ChatState();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  


  // 🔥 SOCKET SETUP (IMPORTANT)
  useEffect(() => {
    if (!user) return;

    socket = io(ENDPOINT);

    socket.emit("setup", user);

    socket.on("online users", (users) => {
      console.log("ONLINE USERS:", users);
      setOnlineUsers(users);
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <Box w="100%" h="100vh" overflow="hidden">
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="calc(100vh - 60px)"
        p="5px"
      >
        {user && (
          <MyChats
            fetchAgain={fetchAgain}
            onlineUsers={onlineUsers}
          />
        )}

        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
      </Box>
    </Box>
  );
};

export default Chats;