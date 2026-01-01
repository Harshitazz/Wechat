const express =require('express');
const {protect}= require('../middleware/authMiddleware')
const {registerUser ,authUser,allUsers} =require("../controllers/userControllers")

const router= express.Router()

router.get('/',protect,allUsers)
router.post('/', (req, res, next) => {
  next();
}, registerUser)
router.post('/login', (req, res, next) => {
  next();
}, authUser);

module.exports= router;