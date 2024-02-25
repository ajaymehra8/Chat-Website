import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
const navigate=useNavigate();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        description: "We've created your account for you.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");

      data.append("cloud_name", "dtbkjxbea");
      fetch("https://api.cloudinary.com/v1_1/dtbkjxbea/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        description: "We've created your account for you.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !confirmPassword) {
      toast({
        title: "Please fill all required place",
        description: "We've created your account for you.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        header: {
          "content-type": "application/json",
        },
      };
      const password=confirmPassword;
      const { data } = await axios.post(
        "https://chat-website-beta.vercel.app/api/v1/user/register",
        { name, email,password },
        config
      );

    

      await localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
navigate('/');
    } catch (err) {
      console.log(err);
      
      toast({
        title: "User registe",
        status: "error",
        duration: 9000,
        isClosable: true,
        position:"bottom"
      });
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="firstName" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={confirmPassword}
            placeholder="Enter your password"
            type={show ? "text" : "password"}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => handleClick()}>
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your pic</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
