import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router"; // <-- import useNavigate

const Login = () => {
  const [show,setShow] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const toast = useToast()
  const navigate = useNavigate() // <-- initialize navigate

  const handleClick = () => setShow(!show)

  const submitHandler = async () => {
    if(!email || !password){
      toast({
        title:"Please fill all fields",
        status:"warning",
        duration:3000,
        isClosable:true
      })
      return
    }

    try {
      const {data} = await axios.post("/api/user/login",{
        email,
        password
      })

      toast({
        title:"Login Successful",
        status:"success",
        duration:3000,
        isClosable:true
      })

      localStorage.setItem("userInfo",JSON.stringify(data))

      navigate("/chats"); // <-- navigate to chats page after login

    } catch (error) {
      toast({
        title:"Error Occurred",
        description:"Invalid Email or Password",
        status:"error",
        duration:3000,
        isClosable:true
      })
    }
  }

  const guestLogin = () => {
    setEmail("guest@example.com")
    setPassword("123456")
  }

  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        mt={4}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={guestLogin}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login;