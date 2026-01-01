const mongoose= require('mongoose');
const bcrypt =require('bcryptjs');

const userModel= mongoose.Schema({
    name:{type:String ,required:true},
    email:{type:String ,required:true ,unique:true},
    password:{type:String ,required:true},
    pic:{type:String ,
         default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.pinterest.com%2Fpin%2Fdownload-blank-default-pfp-wallpaper--757308493613040301%2F&psig=AOvVaw0ujdih5Uhky3GNSM_wFXcR&ust=1710779104359000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJC7hPja-4QDFQAAAAAdAAAAABAE"},
},{timestamps:true})

const User= mongoose.model("User",userModel);

module.exports= User;module.exports= User;