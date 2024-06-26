import React, { useEffect } from "react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { Container } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import "./HomePage.css";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate=useNavigate();

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        if(userInfo){
            navigate('/chats');
        }
    },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <div className="form-header">
        <h1 className="form-header-heading">We-Chat</h1>
      </div>
      <div className="form-content">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList  justifyContent='center' color='black'>
            <Tab width='50%' >Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Container>
  );
}

export default HomePage;
