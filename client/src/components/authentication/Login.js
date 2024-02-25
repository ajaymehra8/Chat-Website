import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React,{useState} from 'react'
import { useToast } from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
const [email,setEmail]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");
const [show,setShow]=useState(false);
const [loading, setLoading] = useState(false);

const toast=useToast();
const navigate=useNavigate();

const handleClick=()=>setShow(!show);

const submitHandler=async()=>{
  setLoading(true);
  if ( !email || !confirmPassword) {
    toast({
      title: "Please fill all required place",
      status: "warning",
      duration: 9000,
      isClosable: true,
    });
    setLoading(false);
    return;
  }
  try{
    const config = {
      header: {
        "content-type": "application/json",
      },
    };//something
    const password=confirmPassword;
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/user/login",
      {  email,password },
      config
    );

   setTimeout(()=> {toast({
      title: "User registered successfully",
      status: "success",
      duration: 9000,
      isClosable: true,
      position:"bottom"
    });},2000);

    await localStorage.setItem('userInfo',JSON.stringify(data));
    setLoading(false);
navigate('/chats');
  }
  catch(err){
console.log(err);
      
      toast({
        title: "Problem in login",
        status: "error",
        duration: 9000,
        isClosable: true,
        position:"bottom"
      });
    }
  }

  return (
    <VStack spacing='5px'>
    

    <FormControl id='emailL' isRequired>
      <FormLabel>Email</FormLabel>
      <Input placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
      
    </FormControl>

    <FormControl id='passwordL' isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>

      <Input value={confirmPassword} placeholder="Enter your password" type={show?'text':'password'} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
      
      <InputRightElement width='4.5rem'>
      <Button h="1.75rem" size="sm" onClick={()=>handleClick()}>
{show?"hide":"show"}
      </Button>
      </InputRightElement>

      </InputGroup>
    </FormControl>

<Button
colorScheme='blue'
width="100%"
style={{marginTop:15}}
onClick={submitHandler}>
SignIn
</Button>

<Button
variant='solid'
colorScheme='red'
width="100%"
style={{marginTop:15}}
onClick={()=>{
  setEmail("guest@example.com");
  setConfirmPassword("12345");
}}
isLoading={loading}>
Sign in as a guest
</Button>

    </VStack>

  )
}

export default Login
