const expressAsyncHandler = require("express-async-handler");
const User= require("../models/userModel")
const generateToken=require('../config/generateToken')

const registerUser= expressAsyncHandler(
    async(req,res)=>{
        try { 
            const{name,email,password,pic} =req.body;
            
            if(!name||!email||!password){
                return res.status(400).json({ message: "please enter all the fields" });
            }
            
            const userExists= await User.findOne({email});

            if(userExists){
                return res.status(400).json({ message: "user already exists." });
            }

            const user=await User.create({
                name,email,password,pic
            });

            if(user){
                const token = generateToken(user._id);
                return res.status(201).json({
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    pic:user.pic,
                    token: token
                })

            }else{
                return res.status(400).json({ message: "failed to create user" });
            }
        } catch(error) {
            return res.status(500).json({ message: error.message });
        }
    }
)

const authUser=expressAsyncHandler(async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email});
        
        if(user && (await user.matchPassword(password))){
            return res.json(
                {
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    pic:user.pic,
                    token:generateToken(user._id)
                }
            )
        }else{
            return res.status(401).json({ message: 'invalid email or password' });
        }
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
})
const allUsers=expressAsyncHandler(async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{ $regex : req.query.search, $options:"i"}},
            {email:{ $regex : req.query.search, $options:"i"}},
        ]
    }:{};

    const users= await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
})

module.exports= {registerUser ,authUser,allUsers};