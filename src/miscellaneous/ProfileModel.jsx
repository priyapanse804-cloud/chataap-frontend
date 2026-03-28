import React from "react";
import {
  Avatar,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  useDisclosure,
  VStack,
  Box
} from "@chakra-ui/react";
import { Eye } from "lucide-react";
import { ChatState } from "../context/ChatProvider";

const ProfileModal = ({ children, userData }) => {
  const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const displayedUser = userData || user;

  const getAvatarColor = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          icon={<Eye size={22} />}
          onClick={onOpen}
          variant="ghost"
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent w="500px">
          {/* Header */}
          <ModalHeader textAlign="center" fontSize="28px" fontWeight="500">
            {displayedUser?.name || "Guest User"}
          </ModalHeader>

          <ModalCloseButton />

          {/* Body */}
          <ModalBody textAlign="center">
            <VStack spacing={6}>

              {/* 🔥 FIXED AVATAR LOGIC */}
              {displayedUser?.pic ? (
  <Box
  w="150px"
  h="150px"
  borderRadius="50%"
  overflow="hidden"
  mx="auto"
  display="flex"
  alignItems="center"
  justifyContent="center"
>
  <img
    src={`https://chataap-backend.onrender.com/${displayedUser.pic.replace(/\\/g, "/")}`}
    alt={displayedUser?.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "top"  // 🔥 CHANGE HERE
    }}
  />
</Box>
) : (
  <Box
    w="150px"
    h="150px"
    borderRadius="50%"
    mx="auto"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg={getAvatarColor(displayedUser?.email || displayedUser?.name)}
  >
    <Text fontSize="40px" fontWeight="bold">
      {displayedUser?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")}
    </Text>
  </Box>
)}
              <Text fontSize="lg" color="gray.600">
                Email: {displayedUser?.email || "guest@example.com"}
              </Text>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;