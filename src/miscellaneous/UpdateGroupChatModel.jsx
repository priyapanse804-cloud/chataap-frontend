import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Box,
  useToast,
  FormControl,
  Input,
  Spinner,
  IconButton,
} from "@chakra-ui/react";

import { ChatState } from "../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { Eye } from "lucide-react";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat, setSelectedChat, user,setChats } = ChatState();
 
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  // ------------------ REMOVE USER ------------------

  const handleRemove = async (user1) => {
  if (
    selectedChat.groupAdmin._id !== user._id &&
    user1._id !== user._id
  ) {
    toast({
      title: "Only admins can remove someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const chatId = selectedChat._id; // 🔥 store id before change

    const { data } = await axios.put(
      "/api/chat/groupremove",
      {
        chatId: chatId,
        userId: user1._id,
      },
      config
    );

    if (user1._id === user._id) {
      // 🔥 LEAVE GROUP CASE
      setSelectedChat(null);

      // 🔥 remove chat from sidebar instantly
      setChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== chatId)
      );
    } else {
      // 🔥 remove other user
      setSelectedChat(data);

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === data._id ? data : chat
        )
      );
    }

    // 🔥 ALWAYS use functional update
    setFetchAgain((prev) => !prev);

    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occured",
      description: error.response?.data?.message || error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });

    setLoading(false);
  }
};
 
  // ------------------ RENAME GROUP ------------------

  const handleRename = async () => {
  if (!groupName) return;

  try {
    setRenameLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.put(
      '/api/chat/rename',
      {
        chatId: selectedChat._id,
        chatName: groupName,
      },
      config
    );

    setSelectedChat(data);


    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === data._id ? data : chat
      )
    );
  setFetchAgain(!fetchAgain)

    setRenameLoading(false);
    

  } catch (error) {
    toast({
      title: "Error Occured",
      description: error.response?.data?.message || error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });

    setRenameLoading(false);


  }
   setGroupName("")
};

  // ------------------ SEARCH USER ------------------

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load Search chats",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // ------------------ ADD USER ------------------

  const handleAddUser = async (user1) => {

    


    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in Group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      
      setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === data._id ? data : chat
      )
    );
      setFetchAgain(!fetchAgain)
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    }
  };

const uniqueUsers = selectedChat?.users
  ? Array.from(
      new Map(selectedChat.users.map((u) => [u._id, u])).values()
    )
  : [];
  
  return (
    <>
      {/* Eye Icon */}
      <IconButton icon={<Eye />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader textAlign="center">
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
              {/* USERS BADGE */}
        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
 {uniqueUsers.map((u) => (
    <UserBadgeItem
      key={u._id}
      user={u}
      handleFunction={() => handleRemove(u)}
    />
  ))}
</Box>
           

            {/* RENAME GROUP */}
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            {/* SEARCH USER */}
            <FormControl>
              <Input
                placeholder="Add User to Group"
                mb={2}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => handleRemove(user)}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;