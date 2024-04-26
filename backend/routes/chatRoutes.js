const express =require('express');
const {protect}= require('../middleware/authMiddleware')
const {accessChats ,fetchChats ,createGroupChat, renameGroup,addToGroup,removeFromGroup}=require('../controllers/chatControllers')
const router= express.Router()

router.post("/",protect,accessChats)
router.get("/",protect,fetchChats)
router.post("/group",protect,createGroupChat)
router.put("/rename",protect,renameGroup)
router.put("/add",protect,addToGroup)
router.put("/remove",protect,removeFromGroup)



module.exports=router;