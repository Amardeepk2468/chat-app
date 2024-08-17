import { Container,Box,Text,Tabs,Tab,TabList,TabPanels,TabPanel } from '@chakra-ui/react'
import React from 'react'
import Login from "../components/Authentication/Login";
import SignUp from '../components/Authentication/SignUp';
import { useHistory } from 'react-router';
import { useEffect } from 'react';


const HomePage = () => {
const history=useHistory();

useEffect(() => {
const user=JSON.parse(localStorage.getItem('userinfo'))
if(user)history.push('/chats')
}, [history])

  return (
    <Container maxW="xl" centerContent>
      <Box
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        d="flex"
      >
        <Text d="flex" fontSize="4xl" fontFamily="Work Sans" textAlign="center">
          Chat-Now
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        mb="3px"
        borderRadius="lg"
        borderWidth="1px"
      >
        {/* This is the tab we took from chakraUi library. */}
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage
