import React, { useState } from "react";
import {
  FormControl,
  Input,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvataar/UserListItem";
import UserBadgeItem from "../userAvataar/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = useChatState();

  // search users

  const handleSearch = async (query) => {
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

      console.log(data);

      setLoading(false);
      setSearchResult(data);
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

  // handle submit
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all required fields",
        description: "Failed to load data",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/v1/chat/group",
        {
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          name: groupChatName,
        }
      );
      setChats([data,...chats])
      onClose();
      toast({
        title: "New group chat created",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Failed to create chat",
        description: "Failed to load data",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // handle group function

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

  // to remove someone from group

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => delUser._id !== sel._id));
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />

              <Input
                placeholder="Add users in your group"
                mb={1}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>

            {/* selected users */}
            <Box w="100%" display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => {
                    handleDelete(u);
                  }}
                />
              ))}
            </Box>

            {/* render searched users */}

            {loading ? (
              <div>Loading...</div>
            ) : (
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModel;
