const mongoose=require("mongoose");

const db=async()=>{
    try{
      await  mongoose.connect(process.env.MONGO_url);
      console.log("Succesfully connected with database");
    }
        catch(err){
            console.log(err);
        }
}
module.exports=db;