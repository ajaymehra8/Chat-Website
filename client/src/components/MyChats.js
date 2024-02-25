import React,{useState,useEffect} from 'react'
import { useChatState } from '../Context/ChatProvider'
import ChatLoading from "./ChatLoading";
import { useToast,Box,Button, Stack,Text} from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../config/ChatLogic';
import GroupChatModel from './miscellaneous/GroupChatModel';

const MyChats = ({fetchAgain}) => {
const [loggedUser,setLoggedUser]=useState();
const {selectedChat,setSelectedChat,chats,setChats,user}=useChatState();
const toast=useToast();

// fetching chat function
const fetchChats=async()=>{
  try{
  const config={
    headers:{
      Authorization:`Bearer ${user.token}`,
  
    }
  
  }
  const {data}=await axios.get(`http://localhost:8000/api/v1/chat`,config);
  console.log(data);
  setChats(data);
  }catch(err){
    toast({
      title: "Error in fetching chats",
      status: "warning",
      duration: 1000,
      isClosable: true,
      position:"bottom-left"
    });
  }
  }

useEffect(()=>{
  setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));

fetchChats();
},[fetchAgain])

  return (
    <>
    <Box
    display={{base:selectedChat?"none":"flex",md:"flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    bg={"white"}
    w={{base:"100%",md:"31%"}}
    borderRadius="lg"
    borderWidth={"1px"}
    >
<Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
  My Chats
  <GroupChatModel>

  
  <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={"+"}
            >
            New Group Chat
          </Button>
            </GroupChatModel>
</Box>

<Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >  
      {chats?(<Stack overflowY="scroll">
{chats.map((c)=>{
  return (
    <Box
    onClick={() => setSelectedChat(c)}
    cursor="pointer"
    bg={selectedChat === c ? "#38B2AC" : "#E8E8E8"}
    color={selectedChat === c ? "white" : "black"}
    px={3}
    py={2}
    borderRadius="lg"
    key={c._id}
  >  
  <Text>
{!c.isGroupChat?(
  getSender(loggedUser,c.users)
):(c.chatName)}
  </Text>
</Box>

  )
})}
      </Stack>):<ChatLoading/>}
  </Box>

    </Box>
    </>
  )
}

export default MyChats
