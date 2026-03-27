import {
  Avatar,
  Box,
  Button,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  Divider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  CloseButton,
  Portal,
  DrawerBody,
  Input,
  useToast,
  Spinner
} from "@chakra-ui/react";
import axios from 'axios'
import UserListItem from "../UserAvatar/UserListItem";
import React, { useState } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "../miscellaneous/ProfileModel";
import { useNavigate } from "react-router";
import ChatLoading from "../miscellaneous/ChatLoading";
import { getSender } from "../config/ChatLogics";

const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState();
  const [loading,setLoading]=useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user,setSelectedChat,chats,setChats ,notification,setNotification} = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };
   const toast=useToast()
  const handleSearch = async () => {
    console.log(user);
console.log(user.token);
  if (!search) {
    toast({
      title: "Please Enter something in Search",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    return;
  }

  try {
    
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`
      },
    };

    const { data } = await axios.get(`/api/user?search=${search}`, config);

    // Artificial delay for smooth loading
    setTimeout(() => {
      setSearchResult(data);
      setLoading(false);
    }, 1200); // 1.2 sec loading

  } catch (error) {
    setLoading(false);

    toast({
      title: "Error Occured!",
      description: "Failed to load the search results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

const accessChat = async (userId) => {
  
  try {
    setLoadingChat(true);

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    const { data } = await axios.post("/api/chat", { userId }, config);

    // 🔥 Important Fix
    if (!chats.find((c) => c._id === data._id)) {
      setChats([data, ...chats]);
    }

    setSelectedChat(data);
    setLoadingChat(false);
    onClose(); // drawer close

  } catch (error) {
    toast({
      title: "Error Fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="10px 15px"
      >

        {/* Search Button */}

        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}
           display="flex" alignItems="center">
            <Search size={20} />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* Logo */}

        <Text fontSize="2xl" fontWeight="light">
          Talk-A-Tive
        </Text>

        {/* Right Side */}

        <Box display="flex" alignItems="center" gap="15px">

          {/* Notification */}
<Menu>
  <MenuButton position="relative">
    
    <Bell size={22} />

    {notification.length > 0 && (
      <Badge
        position="absolute"
        top="-1"
        right="-1"
        borderRadius="full"
        bg="red.500"
        color="white"
        fontSize="0.7em"
        px={2}
      >
        {notification.length}
      </Badge>
    )}

  </MenuButton>

  <MenuList pl={2}>

    {!notification.length && "No New Messages"}

    {notification.map((notif) => (
      <MenuItem
        key={notif._id}
        onClick={() => {
          setSelectedChat(notif.chat);
          setNotification(notification.filter((n) => n !== notif));
        }}
      >
        {notif.chat.isGroupChat
          ? `New Message in ${notif.chat.chatName}`
          : `New Message from ${getSender(user, notif.chat.users)}`}
      </MenuItem>
    ))}

  </MenuList>
</Menu>

          {/* Profile Dropdown */}

          <Menu>
            <MenuButton>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="6px"
                cursor="pointer"
              >
                <ProfileModal user={user}>
 <Box
  w="50px"
  h="50px"
  mx="auto"
  borderRadius="50%"
  overflow="hidden"
>
  <img
    src={
      user?.pic
        ? `http://localhost:5000/${user.pic.replace(/\\/g, "/")}`
        : `https://ui-avatars.com/api/?name=${user?.name}`
    }
    alt="profile"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",       // ya contain
      objectPosition: "top",
    }}
  />
</Box>
                </ProfileModal>

                <ChevronDown size={16} />
              </Box>
            </MenuButton>

            <MenuList>
              <ProfileModal>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <Divider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>

        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Search User
          </DrawerHeader>
          <DrawerBody>
          <Box display={'flex'} pb={2} >
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <Button 
            onClick={handleSearch}
            >Go</Button>
          </Box>
          {
  loading ? (
    <ChatLoading />
  ) : (
    searchResult?.map((user) => (
      <UserListItem
        key={user._id}
        user={user}
        handleFunction={() => accessChat(user._id)}
      />
    ))
  )
}      
{loadingChat&&<Spinner ml={'auto'} d='flex'/>}
        </DrawerBody>
        </DrawerContent>
        
      </Drawer>
    </>
  );
};

export default SideDrawer;