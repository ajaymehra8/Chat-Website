const mongoose=require('mongoose');
const userModel=require("../models/userModel");
const generateToken=require("../config/generateToken");

//LOGIN CONTROLLER
const loginController=async(req,res)=>{
    try{
const {email,password}=req.body;
const user=await userModel.findOne({email});
const token=await generateToken(user._id);
if(user && (await user.matchPassword(password))){
    return  res.status(200).json({
        id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token
    })
}else{
    res.status(401);
    throw new Error("Invalid email or password");
}

    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Problem in login"
        })
    }
}


// SIGN IN CONTROLLER
const signinController=async(req,res)=>{
    try{

const {name,email,password,pic}=req.body;
console.log(name,email,password);

const userExists=await userModel.findOne({email});
if(userExists){
    return res.status(200).send({
        success:true,
        message:"User exists already"
    })
}
const newUser= await userModel.create({
    name,
    email,
    password,
    pic
});
if(newUser){
  return  res.status(200).json({
        id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        pic:newUser.pic,
        token:generateToken(newUser._id)
    })
}else{
   return res.status(500).json({
        err:"Problem in creating user in database"
    })
}
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Problem in signin"
        })
    }
}

// GETTING ALL USER CONTROLLER

const allUser=async(req,res)=>{
    try{
        console.log(req.query.search);
const keyword=req.query.search?{
    $or:[
{name:{$regex:req.query.search,$options:"i"}},
{email:{$regex:req.query.search,$options:"i"}}

    ]
}:"";

const users=await userModel.find(keyword).find({_id:{$ne:req.user._id}});
res.send(users);


    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Problem in getting user"
        })
    }
}

module.exports={loginController,signinController,allUser}