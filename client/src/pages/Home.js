import React,{useEffect,useState} from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate} from "react-router-dom";

const Home = () => {
  const navigate=useNavigate();
    useEffect(()=>{
const userInfo=JSON.parse(localStorage.getItem("userInfo"));
if(!userInfo){
navigate("/chats");
}
    },[navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        p={3}
        bg={"white"}
        w="100%"
        m={"40px 0 15px 0"}
        borderRadius={"large"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"}>
          My Chat App
        </Text>
      </Box>
      {/* login and sign in box */}
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant={"soft-rounded"}>
          <TabList mb={"1em"}>
            <Tab w={"50%"}>Log in</Tab>
            <Tab w={"50%"}>Sign up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>

            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
