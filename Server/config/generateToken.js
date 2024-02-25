const jwt=require('jsonwebtoken');

const generateToken=async(id)=>{
    const token=await jwt.sign({id},process.env.secret,{
        expiresIn:"30days"});
return token;

}

module.exports=generateToken;