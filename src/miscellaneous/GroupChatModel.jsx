import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  useDisclosure,
  useToast,
  Box
} from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { Search } from "lucide-react";

const GroupChatModel = ({ children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState("");
  const [selectedUser,setSelectedUser]=useState([]);
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const [search, setSearch] = useState("");

  const toast=useToast();

  const {user,chats,setChats}=ChatState();

 const handleSearch=async(query)=>{
   setSearch(query)
   if(!query){
    return;
   }
   try {
     setLoading(true)
      const config={
        headers:{
           Authorization: `Bearer ${user.token}`
        },
      };
    
      const {data}=await axios.get(`/api/user?search=${search}`, config);;
      
      
      setLoading(false);
      setSearchResult(data)
   } catch (error) {
       toast({
    title:"Error Occured",
    description:"Failed to load Search chats",
    status:"error",
    duration:5000,
    isClosable:true,
    position:"bottom-left"
   })
   }
 }
  const handleSubmit = async () => {

  if (!groupName || !selectedUser) {
    toast({
      title: "Please fill all the fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    return;
  }

  try {

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post(
      "/api/chat/group",
      {
        name: groupName,
        users: JSON.stringify(selectedUser.map((u) => u._id)),
      },
      config
    );

    setChats([data, ...chats]);

    onClose();

    toast({
      title: "New Group Chat Created",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });

  } catch (error) {

    toast({
      title: "Failed to create chat",
      description: error.response?.data || "Error",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });

  }
};

  const handleGroup=(userToAdd)=>{
   if (selectedUser.includes(userToAdd)) {
         toast({
    title:"User already added",
    status:"Waring",
    duration:5000,
    isClosable:true,
    position:"top"
   });
   return;
    }
    setSelectedUser([...selectedUser,userToAdd])
  }
   
  const handleDelete=(delUser)=>{
    setSelectedUser(selectedUser.filter((sel)=>sel._id!== delUser._id))
  }
  return (
    <>
      {/* Button / Trigger */}
      <span onClick={onOpen}>
        {children}
      </span>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent>

          <ModalHeader
            fontSize="28px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" gap={3}>

            <FormControl>
              <Input
                placeholder="Chat Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">

  {selectedUser.map((u) => (
  <UserBadgeItem
    key={u._id}
    user={u}
    handleFunction={() => handleDelete(u)}
  />
))}

</Box>
           {loading ? (
  <div>loading</div>
) : (
  searchResult?.slice(0,4).map((user) => (
    <UserListItem
      key={user._id}
      user={user}
      handleFunction={() => handleGroup(user)}
    />
  ))
)}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
