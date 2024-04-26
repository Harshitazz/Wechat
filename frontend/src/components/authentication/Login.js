import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [show, setShow] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const validateEmail = (value) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });


      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
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
  };

  return (
    <VStack spacing="5px" color="white">
      <FormControl id="email" isRequired isInvalid={!!emailError}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="ENTER YOUR EMAIL"
          _placeholder={{ color: "white" }}
          onChange={handleChange}
          value={email}
        />
        <FormErrorMessage>{emailError}</FormErrorMessage>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password-</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="ENTER YOUR PASSWORD"
            _placeholder={{ color: "white" }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button onClick={() => setShow(!show)} h="1.7rem" size="sm">
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button width="100%" mt="15px" onClick={submitHandler}>
        Login
      </Button>
    </VStack>
  );
}

export default Login;
