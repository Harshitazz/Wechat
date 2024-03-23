import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import '../imageElement.css'
import axios from 'axios';
import { Button, FormControl,FormErrorMessage,useToast,  Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
function Signup() {
      const[show,setShow]=useState(false);
    const toast = useToast();
    const[name,setName]=useState();
    const[email,setEmail]=useState();
    const[confirmpassord,setConfirmpassord]=useState();
    const[password,setPassword]=useState();
    const[pic,setPic]=useState();
    const [picLoading, setPicLoading] = useState(false);    
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();
        const [previewUrl, setPreviewUrl] = useState();
    const filePickerRef = useRef();
    const pickImageHandler = () => {
      filePickerRef.current.click();
    };

    const postDetails = (pics) => {
      setPicLoading(true);
      if (pics === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      console.log(pics);
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dkhbiyylo");
        fetch("https://api.cloudinary.com/v1_1/dkhbiyylo/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            setPreviewUrl(data.url.toString());
            console.log(data.url.toString());
            setPicLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setPicLoading(false);
          });
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
    };
  
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

    const submitHandler=async()=>{
      if(!name||!password||!email||!confirmpassord){
        toast({
          title: "Please fill all the fields!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if(password!==confirmpassord){
        toast({
          title: "Password do not match!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      console.log(name, email, password, pic);
      try {
        const config={
          headers: {
            "Content-type": "application/json",
          },
        }
        const { data } = await axios.post(
          "/api/user",
          {
            name,
            email,
            password,
            pic,
          },
          config
        );
        console.log(data);
        toast({
          title: "Registration successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate('/chats');
            } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

    }

  return (
    <VStack spacing='10px' color='white'>
      <FormControl id='first-name' isRequired>
        {/* <FormLabel>
            Name-
        </FormLabel> */}
        <Input placeholder='ENTER YOUR NAME' _placeholder={{ color: "white" }}
        onChange={(e)=>setName(e.target.value)}
        >
        </Input>
      </FormControl>

      <FormControl id="email" isRequired isInvalid={!!emailError}>
      {/* <FormLabel>Email</FormLabel> */}
      <Input
        type="email"
        placeholder="ENTER YOUR EMAIL"
        _placeholder={{ color: "white" }}
        onChange={handleChange}
        value={email}
      />
      <FormErrorMessage>{emailError}</FormErrorMessage>
    </FormControl>

      <FormControl id='password' isRequired>
        {/* <FormLabel>
        Password-
        </FormLabel> */}
        <InputGroup>
        <Input
        type={show?'text':'password'}
        
        placeholder='ENTER YOUR PASSWORD' _placeholder={{ color: "white" }}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <InputRightElement width='4.5rem'>
        <Button onClick={()=>setShow(!show)} h='1.7rem' size='sm'>
            {show?'hide':'show'}
        </Button>
        </InputRightElement>
        </InputGroup>
        
      </FormControl>

      <FormControl id='confirmpassword' isRequired>
        {/* <FormLabel>
        Confirm Password-
        </FormLabel> */}
        <InputGroup>
        <Input
        type={show?'text':'password'}
        
        placeholder='CONFIRM YOUR PASSWORD' _placeholder={{ color: "white" }}
        onChange={(e)=>setConfirmpassord(e.target.value)}
        />
        <InputRightElement width='4.5rem'>
        <Button onClick={()=>setShow(!show)} h='1.7rem' size='sm'>
            {show?'hide':'show'}
        </Button>
        </InputRightElement>
        </InputGroup>
        
      </FormControl>

      {/* <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl> */}
      {/* <ImageUpload center id='image' onInput={postDetails} errorText="please provide an image."/>      */}
      <FormControl id="pic">
        
        <Input
        style={{ display: 'none' }}
         ref={filePickerRef}
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      <div className={`image-upload center`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick a ProfilePic.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      </FormControl> 

      <Button 
      width='100%'
      mt='1px'
      onClick={submitHandler}
      isLoading={picLoading}
      >Sign Up</Button>

    </VStack>
  )
}

export default Signup
