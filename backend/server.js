const express= require("express");
const dotenv =require('dotenv');
const chats = require("./data/data");
const app= express();

dotenv.config();


app.get('/',(req,res)=>{
    res.send("api running");
})

app.get('/api/chat',(req,res)=>{
    res.send(chats);
})

app.get('/api/chat/:id',(req,res)=>{
    const specificChat= chats.find(c=>c._id===req.params.id);
    res.send(specificChat);
})

const PORT=process.env.PORT || 5000
app.listen(5000,console.log("server started"));