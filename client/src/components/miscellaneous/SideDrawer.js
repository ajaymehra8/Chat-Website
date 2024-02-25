import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
useToast,
Spinner
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell } from "@fortawesome/free-solid-svg-icons";
import { useChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import Profile from "./Profile";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../userAvataar/UserListItem";
import { getSender } from "../../config/ChatLogic";
import { Badge } from "antd";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user,setSelectedChat,chats,setChats,notification,setNotification } = useChatState();

  console.log(user);
  const navigate = useNavigate();
  const toast=useToast();
  // LOGOUT HANDLER
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
// HANDLE SEARCH FOR  SEARCH BTN
const handleSearch=async()=>{

if(!search){
  toast({
    title: "Please Enter something in search",
    status: "warning",
    duration: 1000,
    isClosable: true,
    position:"top-left"
  });
  return;
}  

try{
setLoading(true);
const config={
  headers:{
    Authorization:`Bearer ${user.token}`,

  }

}
const {data}=await axios.get(`http://localhost:8000/api/v1/user/?search=${search}`,config);
setSearchResult(data);
setLoading(false);


}catch(err){
  toast({
    title: "Error occured",
    description:"Failed to load data",
    status: "warning",
    duration: 1000,
    isClosable: true,
    position:"bottom-left"
  });
}

}

// access chat function
const accessChat=async(userId)=>{
try{
setLoadingChat(true);
const config={
  headers:{
    "Content-type":"application/json",
    Authorization:`Bearer ${user.token}`,

  }

}
const {data}=await axios.post(`http://localhost:8000/api/v1/chat`,{userId},config);

if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
setSelectedChat(data);
setLoadingChat(false);
onClose();
}catch(err){
  toast({
    title: "Error in accessing chats",
    status: "warning",
    duration: 1000,
    isClosable: true,
    position:"top-left"
  });
}
}

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip
          label="Search users to chat"
          hasArrow
          placeContent="bottom-end"
        >
          <Button variant="ghost" onClick={onOpen}>
  <FontAwesomeIcon icon={faMagnifyingGlass} />
  <Text display={{ base: "none", md: "flex" }} px="4">
    Search User
  </Text>
</Button>

        </Tooltip>

        <Text fontSize="2xl" fontFamily={"Work sans"}>
          Talk-A Tive
        </Text>
        <div>
          {/* Notification Menu */}
          <Menu>
            <MenuButton p={1}>
              <Badge count={notification.length} >
              <FontAwesomeIcon
                icon={faBell}
                margin={1}
                style={{ color: "black", fontSize: "20px",marginRight:"20px" }}
              />
              </Badge>
            </MenuButton>
            <MenuList pl={2}>
{!notification.length ? " No new messages ":(
  notification.map(notif=>(
    <MenuItem key={notif._id} onClick={()=>{
      setSelectedChat(notif.chat);
      setNotification(notification.filter(n=>(n!==notif)));
    }}>
    {notif.chat.isGroupChat?`New message in ${notif.chat.chatName}`:`New message from ${getSender(user,notif.chat.users)}`}
    </MenuItem>
  ))
)}
                                </MenuList>
          </Menu>

          {/* Profile Menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={"ef"}>
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Side drawer code */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} >

<DrawerOverlay/>
<DrawerContent>
  <DrawerHeader 
  borderBottomWidth={"1px"}
  >
    Searh Users

  </DrawerHeader>

  <DrawerBody>
<Box display={"flex"} pb={2}>
<Input
placeholder="Search by name or email"
mr={2}
value={search}
onChange={(e)=>{setSearch(e.target.value)}}
/>
<Button onClick={handleSearch}>Go</Button>
</Box>
{loading ? (
  <ChatLoading />
) : (
  searchResult?.map((u) => {
  return  <UserListItem
      key={u._id}
      user={u}
      handleFunction={() => {
        accessChat(u._id);
      }}
    />;
  })
)}
{loadingChat&&<Spinner ml="auto" display={"flex"}/>}
  </DrawerBody>

</DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
