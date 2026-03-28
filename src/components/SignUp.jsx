import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import axios from "axios";

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);

  const fileRef = useRef();
  const toast = useToast();

  const handleShow = () => setShow(!show);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setPic(file);
  };

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("pic", pic);

      const { data } = await axios.post("https://chataap-backend.onrender.com/api/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast({
        title: "Sign Up Successful",
        description: "You have registered successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });

      console.log(data);

      // Clear fields after successful signup
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPic("");
      if (fileRef.current) fileRef.current.value = "";

    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      console.log(error);
    }
  };

  return (
    <VStack spacing="10px"
   >

      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          
          p={1.5}
          accept="image/*"
          ref={fileRef}
          onChange={handleImage}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        mt={3}
        onClick={submitHandler}
      >
        Sign Up
      </Button>

    </VStack>
  );
};

export default SignUp;