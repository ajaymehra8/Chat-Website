import React, { useState } from "react";
import { FormControl, Input, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";
import UserBadgeItem from "../userAvataar/UserBadgeItem";
import { useChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvataar/UserListItem";

const UpdateGroupChatModel = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = useChatState();
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();


  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8000/api/v1/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(fetchAgain);
      setRenameLoading(false);
    } catch (error) {

      toast({
        title: "Error occured",
        description: "Failed to load data",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

// HANDLE GROUP FUNCTION

const handleGroup = (userToAdd) => {
  if (selectedUsers.includes(userToAdd)) {
    toast({
      title: "User Already added",
      description: "Failed to load data",
      status: "warning",
      duration: 1000,
      isClosable: true,
      position: "bottom-center",
    });
    return;
  }
  setSelectedUsers([...selectedUsers, userToAdd]);
};


  const handleSearch = async(query) => {
    if (query.length < 1) {
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/user/?search=${query}`,
        config
      );

      setSearchResult(data);

      setLoading(false);
    } catch (err) {
      toast({
        title: "Error occured",
        description: "Failed to load data",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
// REMOVE USER FUNCTION

const handleRemove = async (user1) => {
  console.log(user,user1);
  if (user1._id === user.id) {
    toast({
      title: "Only admins can remove someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `http://localhost:8000/api/v1/chat/groupremove`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );

    user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  setGroupChatName("");
};
  return (
    <>
      <Button onClick={onOpen} display={{ base: "flex" }}>
        Open Modal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => {
                    handleRemove(u);
                  }}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users in your group"
                mb={1}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            {loading?(
              <Spinner size="lg"/>
            ):(
              searchResult?.slice(0, 3).map((sr) => (
                <UserListItem
                  key={sr._id}
                  user={sr}
                  handleFunction={() => {
                    handleGroup(sr);
                  }}
                ></UserListItem>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                handleRemove(user);
              }}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
