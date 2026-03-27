import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import { useNavigate } from "react-router"

const Home = () => {

   const navigate = useNavigate()

   useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) navigate("/chats")
   },[navigate])

  return (
    <Container maxW="container.xl" px={2}>
      
      <Box display="flex" flexDirection="column" alignItems="center">
        
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="white"
          w="40%"
          m="40px 0 15px 0"
          borderWidth="1px"
          p={3}
        >
          <Text fontSize="2xl" fontWeight="light">
            Talk-A-Tive
          </Text>
        </Box>

        <Box
          bg="white"
          w="50%"
          p={4}
          borderWidth="1px"
        >

          <Tabs >
            <TabList>
              <Tab>SignUp</Tab>
              <Tab>Login</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SignUp/>
              </TabPanel>
              <TabPanel>
                <Login/>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Box>

      </Box>

    </Container>
  )
}

export default Home