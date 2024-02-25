import React, { useEffect, useState } from "react";
import { useChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Lottie from 'react-lottie';
import { useToast } from "@chakra-ui/react";
import { backIn } from "framer-motion";
import { getSender, getSenderFull } from "../config/ChatLogic";
import Profile from "./miscellaneous/Profile";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import animationData from '../animation/typing.json';
import './style.css';
import ScrollableChat from "./ScrollableChat";
import { Badge } from "antd";


import io from 'socket.io-client';

const defaultOptions={
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

const ENDPOINT="https://chat-website-beta.vercel.app";
var socket,selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected,setSocketConnected]=useState(false);
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } = useChatState();

const toast=useToast();

const fetchMessages=async()=>{
if(!selectedChat._id) return;

try {
  const config={
    headers:{
Authorization:`Bearer ${user.token}`
    }
  };

  setLoading(true);
  const {data}=await axios.get(`https://chat-website-beta.vercel.app/api/v1/message/${selectedChat._id}`,config);
  setMessages(data);

  setLoading(false);

  socket.emit("join chat",selectedChat._id);

} catch (error) {
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
fetchMessages();
selectedChatCompare=selectedChat;
},[selectedChat])

useEffect(()=>{
  socket=io(ENDPOINT);
  socket.on('message received',(newMessageReceive)=>{
    if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceive.chat._id){
      // give notification
if(!notification.includes(newMessageReceive)){
setNotification([newMessageReceive,...notification]);
setFetchAgain(!fetchAgain);
}
      return;
    }
    setMessages([...messages,newMessageReceive]);
  })
})

useEffect(()=>{
socket=io(ENDPOINT);
socket.emit('setup',user);

socket.on("connected",()=>{
setSocketConnected(true);
});
socket.on("typing",()=>{
  setIsTyping(true);
})
socket.on("stop typing",()=>{
  setIsTyping(false);
})
},[]);

  const sendMessage = async(e) => {
    if(e.key==="Enter" && newMessage){
      socket.emit('stop typing',selectedChat._id);
try {
  const config={
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${user.token}`,
    }
  };

const {data}=await axios.post(`https://chat-website-beta.vercel.app/api/v1/message`,{
  content:newMessage,
  chatId:selectedChat._id
},config);

setNewMessage("");
socket.emit('new message',data);
setMessages([...messages,data]);

} catch (error) {
 toast({
      title: "Error in fetching chats",
      status: "warning",
      duration: 1000,
      isClosable: true,
      position:"bottom-left"
    });  
}
    }
  };

  const typingHandler = (e) => {
setNewMessage(e.target.value);

// typing indicator logic

if(!socketConnected)return;
if(!typing){
  setTyping(true);
  socket.emit('typing',selectedChat._id);

}
let lastTypingTime=new Date();
var timerLength=3000;
setTimeout(()=>{
var timeNow=new Date().getTime();
var timeDiff=timeNow-lastTypingTime;
if(timeDiff>=timerLength && typing){
  socket.emit('stop typing',selectedChat._id);
  setTyping(false);
}
},timerLength)
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={backIn}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}

                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ) : (
              <>
                {selectedChat.users ? getSender(user, selectedChat.users) : ""}
                <Profile
                  user={
                    selectedChat.users
                      ? getSenderFull(user, selectedChat.users)
                      : ""
                  }
                >
                  hello
                </Profile>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages Here */}
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf="center"
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                {/* Messages */}
              <ScrollableChat messages={messages}/>

              
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
{isTyping?<div>
<Lottie 
options={defaultOptions}
width={70}
style={{marginBottom:15,marginLeft:0}}

/>
</div>:""}

              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />

            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="30px" pb={3} fontFamily="Work sans" color={"black"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
