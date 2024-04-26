const expressAsyncHandler =require('express-async-handler')
const Chat= require("../models/chatModel");
const User = require('../models/userModel');

const accessChats=expressAsyncHandler(async(req,res)=>{
    const {userId}= req.body;
    if(!userId){
        console.log("userId param not sent with request")
        return res.sendStatus(400);
    }
    var isChat= await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{ $eq:req.user._id}} },
            {users:{$elemMatch:{ $eq:userId}} }
    ]
    }).populate("users","-password").populate("latestMessage");

    isChat= await User.populate(isChat,{
        path:'latestMessage.sender',
        select:" name pic email",
    }); 

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            chatName:'sender',
            isGroupChat:false,
            users:[req.user._id,userId],
        }
        try{
            const createdChat= await Chat.create(chatData);

            const FullChat= await Chat.findOne({_id: createdChat._id}).populate("users","-password")
            res.send(FullChat);

        }catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
})


const fetchChats=expressAsyncHandler(async(req,res)=>{
    try {
        Chat.find({users: { $elemMatch:{$eq: req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt :-1})
        .then(async(results)=>{
            results= await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email",
            })
            res.status(200).send(results);
            // if(Array.isArray(results)){
            //     console.log('result is')
            //     console.log(results)
            // }
            
        })
        // results= await User.populate(results,{
        //             path:"latestMessage.sender",
        //             select:"name pic email",
        //     })
        //                 res.status(200).send(results);

    } catch (error) {
        res.status(400);
            throw new Error(error.message);
    }
}

)

const createGroupChat=expressAsyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.chatName){
        return res.status(400).send({message:"fill all the feilds."})
    }

    var users= JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send("morethan 2 people required to make a group")
    }

    users.push(req.user);
    try {
        const groupChat=await Chat.create({
            chatName: req.body.chatName,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })
        const fullGroupChat= await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");
        res.status(200).send(fullGroupChat) 
    } catch (error) {
        res.status(400);
            throw new Error(error.message);
    }
})

const renameGroup=  expressAsyncHandler(async(req,res)=>{
    const {chatId, chatName}= req.body;
    const updatedChat= await Chat.findByIdAndUpdate(
        chatId,{chatName},{new:true}
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(404);
        throw new Error("chat not found");

    }else{
        res.send(updatedChat)
    }
})

const addToGroup= expressAsyncHandler(async(req,res)=>{
    const {chatId, userId}= req.body;
    const addeduser= await Chat.findByIdAndUpdate(
        chatId,{$push: {users:userId}},{new:true}
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!addeduser){
        res.status(404);
        throw new Error("chat not found");

    }else{
        res.send(addeduser)
    }
})

const removeFromGroup= expressAsyncHandler(async(req,res)=>{
    const {chatId, userId}= req.body;
    const removed= await Chat.findByIdAndUpdate(
        chatId,{$pull: {users:userId}},{new:true}
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(404);
        throw new Error("chat not found");

    }else{
        res.send(removed)
    }
})

module.exports={accessChats ,fetchChats ,createGroupChat, renameGroup,addToGroup, removeFromGroup}
